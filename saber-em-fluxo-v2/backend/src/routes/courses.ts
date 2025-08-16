// FILE: /backend/src/routes/courses.ts
import { Router } from 'express';
import { CourseController } from '../controllers/CourseController';
import { authenticateToken as authMiddleware } from '../middlewares/auth';

const router = Router();

// Rotas públicas (não requerem autenticação)
router.get('/', CourseController.getCourses);
router.get('/:id', CourseController.getCourseById);

// Rotas protegidas (requerem autenticação)
router.post('/', authMiddleware, CourseController.createCourse);
router.post('/:id/enroll', authMiddleware, CourseController.enrollUser);
router.get('/my/enrolled', authMiddleware, CourseController.getUserCourses);

// Rotas para criação de conteúdo
router.post('/:courseId/modules', authMiddleware, CourseController.addModule);
router.post('/modules/:moduleId/lessons', authMiddleware, CourseController.addLesson);

// Progresso
router.post('/lessons/:lessonId/complete', authMiddleware, CourseController.completeLesson);

export default router;
