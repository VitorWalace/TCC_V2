// FILE: /frontend/src/types/course.ts
export interface Course {
  id: string;
  title: string;
  description?: string;
  category: string;
  difficulty: 'Iniciante' | 'Intermediário' | 'Avançado';
  cover_image_url?: string;
  estimated_hours: number;
  xp_reward: number;
  instructor_id: string;
  is_published: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  
  // Dados extras quando vem com detalhes
  instructor?: {
    id: string;
    first_name: string;
    last_name: string;
    avatar_url?: string;
  };
  enrollment?: Enrollment;
  progress?: number;
  total_lessons?: number;
  completed_lessons?: number;
  modules?: CourseModule[];
}

export interface CourseModule {
  id: string;
  course_id: string;
  title: string;
  description?: string;
  order_index: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  lessons?: Lesson[];
}

export interface Lesson {
  id: string;
  module_id: string;
  title: string;
  description?: string;
  type: 'video' | 'text' | 'quiz' | 'assignment';
  content?: string;
  video_url?: string;
  resource_url?: string;
  duration_minutes: number;
  xp_reward: number;
  order_index: number;
  is_free: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  is_completed?: boolean;
}

export interface Enrollment {
  id: string;
  user_id: string;
  course_id: string;
  enrolled_at: string;
  completed_at?: string;
  progress_percentage: number;
  current_lesson_id?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateCourseDto {
  title: string;
  description?: string;
  category: string;
  difficulty: 'Iniciante' | 'Intermediário' | 'Avançado';
  cover_image_url?: string;
  estimated_hours?: number;
  xp_reward?: number;
}

export interface CreateModuleDto {
  title: string;
  description?: string;
  order_index?: number;
}

export interface CreateLessonDto {
  title: string;
  description?: string;
  type: 'video' | 'text' | 'quiz' | 'assignment';
  content?: string;
  video_url?: string;
  resource_url?: string;
  duration_minutes?: number;
  xp_reward?: number;
  order_index?: number;
  is_free?: boolean;
}

export interface QuizData {
  answers: number[];
  score?: number;
  time_spent?: number;
}
