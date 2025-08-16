// FILE: /backend/src/controllers/CourseController.ts
import { Request, Response } from 'express';
import { CourseService } from '../services/CourseService';
import { XpService } from '../services/XpService';

export class CourseController {

  /**
   * GET /api/courses - Listar cursos com filtros
   */
  static async getCourses(req: Request, res: Response): Promise<void> {
    try {
      const { 
        category, 
        difficulty, 
        instructor_id, 
        is_published, 
        search, 
        limit = '20', 
        offset = '0' 
      } = req.query;

      const filters = {
        category: category as string,
        difficulty: difficulty as string,
        instructor_id: instructor_id as string,
        is_published: is_published === 'true',
        search: search as string,
        limit: parseInt(limit as string),
        offset: parseInt(offset as string)
      };

      const courses = await CourseService.getCourses(filters);

      res.json({
        success: true,
        data: courses,
        count: courses.length
      });
    } catch (error: any) {
      console.error('❌ Erro no CourseController.getCourses:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Erro interno do servidor'
      });
    }
  }

  /**
   * GET /api/courses/:id - Buscar curso por ID
   */
  static async getCourseById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const userId = (req.user as any)?.id; // Type assertion para contornar o problema

      const course = await CourseService.getCourseById(id, userId);

      if (!course) {
        res.status(404).json({
          success: false,
          message: 'Curso não encontrado'
        });
        return;
      }

      res.json({
        success: true,
        data: course
      });
    } catch (error: any) {
      console.error('❌ Erro no CourseController.getCourseById:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Erro interno do servidor'
      });
    }
  }

  /**
   * POST /api/courses - Criar novo curso
   */
  static async createCourse(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req.user as any)?.id;
      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'Usuário não autenticado'
        });
        return;
      }

      const courseData = req.body;
      const course = await CourseService.createCourse(userId, courseData);

      res.status(201).json({
        success: true,
        message: 'Curso criado com sucesso',
        data: course
      });
    } catch (error: any) {
      console.error('❌ Erro no CourseController.createCourse:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Erro interno do servidor'
      });
    }
  }

  /**
   * POST /api/courses/:id/enroll - Matricular usuário
   */
  static async enrollUser(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const userId = (req.user as any)?.id;

      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'Usuário não autenticado'
        });
        return;
      }

      const enrollment = await CourseService.enrollUser(userId, id);

      res.status(201).json({
        success: true,
        message: 'Matrícula realizada com sucesso!',
        data: enrollment
      });
    } catch (error: any) {
      console.error('❌ Erro no CourseController.enrollUser:', error);
      res.status(400).json({
        success: false,
        message: error.message || 'Erro interno do servidor'
      });
    }
  }

  /**
   * GET /api/courses/my - Buscar cursos do usuário
   */
  static async getUserCourses(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req.user as any)?.id;
      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'Usuário não autenticado'
        });
        return;
      }

      const courses = await CourseService.getUserCourses(userId);

      res.json({
        success: true,
        data: courses,
        count: courses.length
      });
    } catch (error: any) {
      console.error('❌ Erro no CourseController.getUserCourses:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Erro interno do servidor'
      });
    }
  }

  /**
   * POST /api/courses/:courseId/modules - Adicionar módulo
   */
  static async addModule(req: Request, res: Response): Promise<void> {
    try {
      const { courseId } = req.params;
      const moduleData = req.body;

      if (!courseId) {
        res.status(400).json({
          success: false,
          message: 'ID do curso é obrigatório'
        });
        return;
      }

      const module = await CourseService.addModule(courseId, moduleData);

      res.status(201).json({
        success: true,
        message: 'Módulo adicionado com sucesso',
        data: module
      });
    } catch (error: any) {
      console.error('❌ Erro no CourseController.addModule:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Erro interno do servidor'
      });
    }
  }

  /**
   * POST /api/modules/:moduleId/lessons - Adicionar aula
   */
  static async addLesson(req: Request, res: Response): Promise<void> {
    try {
      const { moduleId } = req.params;
      const lessonData = req.body;

      if (!moduleId) {
        res.status(400).json({
          success: false,
          message: 'ID do módulo é obrigatório'
        });
        return;
      }

      const lesson = await CourseService.addLesson(moduleId, lessonData);

      res.status(201).json({
        success: true,
        message: 'Aula adicionada com sucesso',
        data: lesson
      });
    } catch (error: any) {
      console.error('❌ Erro no CourseController.addLesson:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Erro interno do servidor'
      });
    }
  }

  /**
   * POST /api/lessons/:lessonId/complete - Marcar aula como completa
   */
  static async completeLesson(req: Request, res: Response): Promise<void> {
    try {
      const { lessonId } = req.params;
      const userId = (req.user as any)?.id;
      const { quizData } = req.body;

      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'Usuário não autenticado'
        });
        return;
      }

      if (!lessonId) {
        res.status(400).json({
          success: false,
          message: 'ID da aula é obrigatório'
        });
        return;
      }

      await CourseService.completLesson(userId, lessonId, quizData);

      // Buscar estatísticas atualizadas
      const stats = await XpService.getUserStats(userId);

      res.json({
        success: true,
        message: 'Aula completada com sucesso! 🎉',
        data: {
          xp_earned: quizData?.score || 10,
          new_stats: stats
        }
      });
    } catch (error: any) {
      console.error('❌ Erro no CourseController.completeLesson:', error);
      res.status(400).json({
        success: false,
        message: error.message || 'Erro interno do servidor'
      });
    }
  }
}
