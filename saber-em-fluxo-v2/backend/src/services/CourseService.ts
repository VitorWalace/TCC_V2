// FILE: /backend/src/services/CourseService.ts
import db from '../database/connection';
import { 
  Course, 
  CourseModule, 
  Lesson, 
  Enrollment, 
  LessonProgress,
  CreateCourseDto,
  CreateModuleDto,
  CreateLessonDto,
  CourseWithDetails
} from '../types/course';
import { XpService } from './XpService';

export class CourseService {
  
  /**
   * Criar um novo curso
   */
  static async createCourse(instructorId: string, data: CreateCourseDto): Promise<Course> {
    try {
      const [course] = await db('courses')
        .insert({
          ...data,
          instructor_id: instructorId,
          estimated_hours: data.estimated_hours || 0,
          xp_reward: data.xp_reward || 100
        })
        .returning('*');
        
      return course;
    } catch (error) {
      console.error('❌ Erro ao criar curso:', error);
      throw new Error('Falha ao criar curso');
    }
  }

  /**
   * Buscar cursos com filtros
   */
  static async getCourses(filters: {
    category?: string;
    difficulty?: string;
    instructor_id?: string;
    is_published?: boolean;
    search?: string;
    limit?: number;
    offset?: number;
  } = {}): Promise<CourseWithDetails[]> {
    try {
      let query = db('courses as c')
        .leftJoin('users as u', 'c.instructor_id', 'u.id')
        .select(
          'c.*',
          'u.first_name as instructor_first_name',
          'u.last_name as instructor_last_name',
          'u.avatar_url as instructor_avatar'
        )
        .where('c.is_active', true);

      // Aplicar filtros
      if (filters.category) {
        query = query.where('c.category', filters.category);
      }
      
      if (filters.difficulty) {
        query = query.where('c.difficulty', filters.difficulty);
      }
      
      if (filters.instructor_id) {
        query = query.where('c.instructor_id', filters.instructor_id);
      }
      
      if (filters.is_published !== undefined) {
        query = query.where('c.is_published', filters.is_published);
      }
      
      if (filters.search) {
        query = query.where(function() {
          this.where('c.title', 'ilike', `%${filters.search}%`)
              .orWhere('c.description', 'ilike', `%${filters.search}%`);
        });
      }

      // Paginação
      if (filters.limit) {
        query = query.limit(filters.limit);
      }
      
      if (filters.offset) {
        query = query.offset(filters.offset);
      }

      const courses = await query.orderBy('c.created_at', 'desc');

      // Formatear dados para o frontend
      return courses.map(course => ({
        ...course,
        instructor: {
          id: course.instructor_id,
          first_name: course.instructor_first_name,
          last_name: course.instructor_last_name,
          avatar_url: course.instructor_avatar
        }
      }));
    } catch (error) {
      console.error('❌ Erro ao buscar cursos:', error);
      throw new Error('Falha ao buscar cursos');
    }
  }

  /**
   * Buscar curso por ID com todos os detalhes
   */
  static async getCourseById(courseId: string, userId?: string): Promise<CourseWithDetails | null> {
    try {
      // Buscar curso
      const course = await db('courses as c')
        .leftJoin('users as u', 'c.instructor_id', 'u.id')
        .select(
          'c.*',
          'u.first_name as instructor_first_name',
          'u.last_name as instructor_last_name',
          'u.avatar_url as instructor_avatar'
        )
        .where('c.id', courseId)
        .where('c.is_active', true)
        .first();

      if (!course) return null;

      // Buscar módulos com aulas
      const modules = await db('course_modules as m')
        .leftJoin('lessons as l', 'm.id', 'l.module_id')
        .select(
          'm.*',
          db.raw('JSON_AGG(l.*) as lessons')
        )
        .where('m.course_id', courseId)
        .where('m.is_active', true)
        .groupBy('m.id')
        .orderBy('m.order_index');

      // Buscar matrícula do usuário se fornecido
      let enrollment = null;
      let progress = 0;
      let completedLessons = 0;
      
      if (userId) {
        enrollment = await db('enrollments')
          .where('user_id', userId)
          .where('course_id', courseId)
          .where('is_active', true)
          .first();
          
        if (enrollment) {
          const progressData = await db('lesson_progress as lp')
            .join('lessons as l', 'lp.lesson_id', 'l.id')
            .join('course_modules as m', 'l.module_id', 'm.id')
            .where('lp.user_id', userId)
            .where('m.course_id', courseId)
            .where('lp.is_completed', true)
            .count('lp.id as completed');
            
          completedLessons = parseInt(String(progressData[0]?.completed || 0));
        }
      }

      const totalLessons = modules.reduce((total, module) => {
        return total + (module.lessons?.filter((l: any) => l.id).length || 0);
      }, 0);

      if (totalLessons > 0) {
        progress = Math.round((completedLessons / totalLessons) * 100);
      }

      return {
        ...course,
        modules: modules.map(m => ({
          ...m,
          lessons: m.lessons?.filter((l: any) => l.id) || []
        })),
        instructor: {
          id: course.instructor_id,
          first_name: course.instructor_first_name,
          last_name: course.instructor_last_name,
          avatar_url: course.instructor_avatar
        },
        enrollment,
        progress,
        total_lessons: totalLessons,
        completed_lessons: completedLessons
      };
    } catch (error) {
      console.error('❌ Erro ao buscar curso:', error);
      throw new Error('Falha ao buscar curso');
    }
  }

  /**
   * Matricular usuário em um curso
   */
  static async enrollUser(userId: string, courseId: string): Promise<Enrollment> {
    try {
      // Verificar se já está matriculado
      const existingEnrollment = await db('enrollments')
        .where('user_id', userId)
        .where('course_id', courseId)
        .first();

      if (existingEnrollment) {
        if (existingEnrollment.is_active) {
          throw new Error('Usuário já está matriculado neste curso');
        } else {
          // Reativar matrícula
          const [enrollment] = await db('enrollments')
            .where('id', existingEnrollment.id)
            .update({ is_active: true, enrolled_at: db.fn.now() })
            .returning('*');
          return enrollment;
        }
      }

      // Criar nova matrícula
      const [enrollment] = await db('enrollments')
        .insert({
          user_id: userId,
          course_id: courseId
        })
        .returning('*');

      // Dar XP por se matricular
      await XpService.addXp(userId, 50, 'course_enrolled', courseId, 'Matriculado em um novo curso');

      return enrollment;
    } catch (error) {
      console.error('❌ Erro ao matricular usuário:', error);
      throw error;
    }
  }

  /**
   * Marcar aula como completa
   */
  static async completLesson(userId: string, lessonId: string, quizData?: any): Promise<void> {
    try {
      // Buscar informações da aula
      const lesson = await db('lessons as l')
        .join('course_modules as m', 'l.module_id', 'm.id')
        .join('enrollments as e', function() {
          this.on('m.course_id', 'e.course_id')
              .andOn('e.user_id', '=', db.raw('?', [userId]));
        })
        .select('l.*', 'e.id as enrollment_id', 'e.course_id')
        .where('l.id', lessonId)
        .first();

      if (!lesson) {
        throw new Error('Aula não encontrada ou usuário não matriculado');
      }

      // Verificar se já foi completada
      const existingProgress = await db('lesson_progress')
        .where('user_id', userId)
        .where('lesson_id', lessonId)
        .first();

      if (existingProgress && existingProgress.is_completed) {
        return; // Já completada
      }

      let quizScore = 0;
      if (lesson.type === 'quiz' && quizData) {
        // Calcular score do quiz
        const quizContent = JSON.parse(lesson.content || '{}');
        const { answers } = quizData;
        let correct = 0;
        
        quizContent.questions?.forEach((question: any, index: number) => {
          if (answers[index] === question.correctAnswer) {
            correct++;
          }
        });
        
        quizScore = Math.round((correct / (quizContent.questions?.length || 1)) * 100);
      }

      // Salvar ou atualizar progresso
      if (existingProgress) {
        await db('lesson_progress')
          .where('id', existingProgress.id)
          .update({
            is_completed: true,
            completion_percentage: 100,
            completed_at: db.fn.now(),
            quiz_answers: quizData?.answers,
            quiz_score: quizScore
          });
      } else {
        await db('lesson_progress').insert({
          user_id: userId,
          lesson_id: lessonId,
          enrollment_id: lesson.enrollment_id,
          is_completed: true,
          completion_percentage: 100,
          completed_at: db.fn.now(),
          quiz_answers: quizData?.answers,
          quiz_score: quizScore
        });
      }

      // Dar XP pela conclusão
      let xpReward = lesson.xp_reward || 10;
      if (lesson.type === 'quiz') {
        xpReward = Math.round(xpReward * (quizScore / 100)); // XP proporcional ao score
      }

      await XpService.addXp(
        userId, 
        xpReward, 
        'lesson_completed', 
        lessonId, 
        `Completou a aula: ${lesson.title}`
      );

      // Atualizar progresso do curso
      await this.updateCourseProgress(userId, lesson.course_id);

    } catch (error) {
      console.error('❌ Erro ao completar aula:', error);
      throw error;
    }
  }

  /**
   * Atualizar progresso geral do curso
   */
  private static async updateCourseProgress(userId: string, courseId: string): Promise<void> {
    try {
      // Contar total de aulas do curso
      const totalLessonsResult = await db('lessons as l')
        .join('course_modules as m', 'l.module_id', 'm.id')
        .where('m.course_id', courseId)
        .where('l.is_active', true)
        .count('l.id as total');

      const totalLessons = parseInt(String(totalLessonsResult[0]?.total || 0));

      // Contar aulas completadas
      const completedLessonsResult = await db('lesson_progress as lp')
        .join('lessons as l', 'lp.lesson_id', 'l.id')
        .join('course_modules as m', 'l.module_id', 'm.id')
        .where('m.course_id', courseId)
        .where('lp.user_id', userId)
        .where('lp.is_completed', true)
        .count('lp.id as completed');

      const completedLessons = parseInt(String(completedLessonsResult[0]?.completed || 0));

      // Calcular porcentagem
      const progressPercentage = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

      // Atualizar matrícula
      const updateData: any = { progress_percentage: progressPercentage };
      
      if (progressPercentage === 100) {
        updateData.completed_at = db.fn.now();
        
        // Dar XP extra por completar o curso
        const course = await db('courses').where('id', courseId).first();
        if (course) {
          await XpService.addXp(
            userId, 
            course.xp_reward || 500, 
            'course_completed', 
            courseId, 
            `Completou o curso: ${course.title}`
          );
        }
      }

      await db('enrollments')
        .where('user_id', userId)
        .where('course_id', courseId)
        .update(updateData);

    } catch (error) {
      console.error('❌ Erro ao atualizar progresso do curso:', error);
      throw error;
    }
  }

  /**
   * Adicionar módulo ao curso
   */
  static async addModule(courseId: string, data: CreateModuleDto): Promise<CourseModule> {
    try {
      const [module] = await db('course_modules')
        .insert({
          course_id: courseId,
          ...data,
          order_index: data.order_index || 0
        })
        .returning('*');

      return module;
    } catch (error) {
      console.error('❌ Erro ao criar módulo:', error);
      throw new Error('Falha ao criar módulo');
    }
  }

  /**
   * Adicionar aula ao módulo
   */
  static async addLesson(moduleId: string, data: CreateLessonDto): Promise<Lesson> {
    try {
      const [lesson] = await db('lessons')
        .insert({
          module_id: moduleId,
          ...data,
          duration_minutes: data.duration_minutes || 0,
          xp_reward: data.xp_reward || 10,
          order_index: data.order_index || 0,
          is_free: data.is_free || false
        })
        .returning('*');

      return lesson;
    } catch (error) {
      console.error('❌ Erro ao criar aula:', error);
      throw new Error('Falha ao criar aula');
    }
  }

  /**
   * Buscar cursos do usuário (matriculado)
   */
  static async getUserCourses(userId: string): Promise<CourseWithDetails[]> {
    try {
      const courses = await db('enrollments as e')
        .join('courses as c', 'e.course_id', 'c.id')
        .leftJoin('users as u', 'c.instructor_id', 'u.id')
        .select(
          'c.*',
          'e.progress_percentage',
          'e.enrolled_at',
          'e.completed_at',
          'u.first_name as instructor_first_name',
          'u.last_name as instructor_last_name',
          'u.avatar_url as instructor_avatar'
        )
        .where('e.user_id', userId)
        .where('e.is_active', true)
        .where('c.is_active', true)
        .orderBy('e.enrolled_at', 'desc');

      return courses.map(course => ({
        ...course,
        instructor: {
          id: course.instructor_id,
          first_name: course.instructor_first_name,
          last_name: course.instructor_last_name,
          avatar_url: course.instructor_avatar
        },
        progress: course.progress_percentage
      }));
    } catch (error) {
      console.error('❌ Erro ao buscar cursos do usuário:', error);
      throw new Error('Falha ao buscar cursos do usuário');
    }
  }
}
