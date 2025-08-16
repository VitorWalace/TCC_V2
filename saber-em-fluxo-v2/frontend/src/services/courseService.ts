// FILE: /frontend/src/services/courseService.ts
import api from './api';
import { Course, CreateCourseDto, CreateModuleDto, CreateLessonDto, QuizData } from '../types/course';

export class CourseService {
  
  /**
   * Buscar todos os cursos com filtros
   */
  static async getCourses(filters: {
    category?: string;
    difficulty?: string;
    search?: string;
    limit?: number;
    offset?: number;
  } = {}): Promise<Course[]> {
    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) {
          params.append(key, value.toString());
        }
      });

      const response = await api.get(`/api/courses?${params.toString()}`);
      return response.data.data;
    } catch (error: any) {
      console.error('❌ Erro ao buscar cursos:', error);
      throw new Error(error.response?.data?.message || 'Falha ao buscar cursos');
    }
  }

  /**
   * Buscar curso por ID com detalhes completos
   */
  static async getCourseById(courseId: string): Promise<Course> {
    try {
      const response = await api.get(`/api/courses/${courseId}`);
      return response.data.data;
    } catch (error: any) {
      console.error('❌ Erro ao buscar curso:', error);
      throw new Error(error.response?.data?.message || 'Curso não encontrado');
    }
  }

  /**
   * Buscar cursos matriculados do usuário
   */
  static async getMyCourses(): Promise<Course[]> {
    try {
      const response = await api.get('/api/courses/my/enrolled');
      return response.data.data;
    } catch (error: any) {
      console.error('❌ Erro ao buscar meus cursos:', error);
      throw new Error(error.response?.data?.message || 'Falha ao buscar seus cursos');
    }
  }

  /**
   * Matricular-se em um curso
   */
  static async enrollInCourse(courseId: string): Promise<void> {
    try {
      const response = await api.post(`/api/courses/${courseId}/enroll`);
      return response.data.data;
    } catch (error: any) {
      console.error('❌ Erro ao se matricular:', error);
      throw new Error(error.response?.data?.message || 'Falha ao se matricular');
    }
  }

  /**
   * Criar novo curso (para instrutores)
   */
  static async createCourse(courseData: CreateCourseDto): Promise<Course> {
    try {
      const response = await api.post('/api/courses', courseData);
      return response.data.data;
    } catch (error: any) {
      console.error('❌ Erro ao criar curso:', error);
      throw new Error(error.response?.data?.message || 'Falha ao criar curso');
    }
  }

  /**
   * Adicionar módulo a um curso
   */
  static async addModule(courseId: string, moduleData: CreateModuleDto): Promise<any> {
    try {
      const response = await api.post(`/api/courses/${courseId}/modules`, moduleData);
      return response.data.data;
    } catch (error: any) {
      console.error('❌ Erro ao adicionar módulo:', error);
      throw new Error(error.response?.data?.message || 'Falha ao adicionar módulo');
    }
  }

  /**
   * Adicionar aula a um módulo
   */
  static async addLesson(moduleId: string, lessonData: CreateLessonDto): Promise<any> {
    try {
      const response = await api.post(`/api/courses/modules/${moduleId}/lessons`, lessonData);
      return response.data.data;
    } catch (error: any) {
      console.error('❌ Erro ao adicionar aula:', error);
      throw new Error(error.response?.data?.message || 'Falha ao adicionar aula');
    }
  }

  /**
   * Marcar aula como completa
   */
  static async completeLesson(lessonId: string, quizData?: QuizData): Promise<any> {
    try {
      const response = await api.post(`/api/courses/lessons/${lessonId}/complete`, {
        quizData
      });
      return response.data.data;
    } catch (error: any) {
      console.error('❌ Erro ao completar aula:', error);
      throw new Error(error.response?.data?.message || 'Falha ao completar aula');
    }
  }

  /**
   * Buscar categorias de cursos
   */
  static async getCategories(): Promise<string[]> {
    // Em uma implementação real, isso viria do backend
    return [
      'Desenvolvimento Web',
      'Mobile',
      'Data Science',
      'DevOps',
      'Design',
      'Marketing Digital',
      'Negócios',
      'Idiomas'
    ];
  }

  /**
   * Buscar dificuldades disponíveis
   */
  static getDifficulties(): Array<{value: string, label: string}> {
    return [
      { value: 'Iniciante', label: 'Iniciante' },
      { value: 'Intermediário', label: 'Intermediário' },
      { value: 'Avançado', label: 'Avançado' }
    ];
  }
}
