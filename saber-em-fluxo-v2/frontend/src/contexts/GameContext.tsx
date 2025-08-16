import React, { createContext, useContext, useState, useEffect } from 'react'

// Interfaces
export interface Lesson {
  id: string
  title: string
  duration: number
  completed: boolean
  locked: boolean
  type: 'video' | 'quiz' | 'challenge' | 'boss' | 'text' | 'assignment'
  xp: number
  content: string
  order: number
  videoUrl?: string
  textContent?: string
  quizQuestions?: QuizQuestion[]
  assignmentDescription?: string
}

export interface QuizQuestion {
  id: string
  question: string
  options: string[]
  correctAnswer: number
  explanation: string
}

export interface Module {
  id: string
  title: string
  description: string
  lessons: Lesson[]
  order: number
  locked: boolean
}

export interface Course {
  id: string
  title: string
  description: string
  instructor: string
  totalLessons: number
  completedLessons: number
  totalXP: number
  earnedXP: number
  progress: number
  modules: Module[]
  lessons: Lesson[] // Legacy support
  difficulty: 'comum' | 'raro' | 'épico' | 'lendário'
  thumbnail: string
  category: string
  rating: number
  students: number
  duration: string
  published: boolean
  createdAt: string
  updatedAt: string
}

export interface UserProgress {
  userId: string
  level: number
  totalXP: number
  nextLevelXP: number
  streak: number
  badges: string[]
  completedCourses: string[]
  currentCourses: string[]
}

interface GameContextType {
  // User Progress
  userProgress: UserProgress
  
  // Courses
  courses: Course[]
  
  // Actions
  completLesson: (courseId: string, lessonId: string) => void
  enrollInCourse: (courseId: string) => void
  updateUserProgress: (xp: number) => void
  addBadge: (badge: string) => void
  incrementStreak: () => void
  
  // Course Creation/Editing
  createCourse: (courseData: Partial<Course>) => Course
  updateCourse: (courseId: string, updates: Partial<Course>) => void
  addModule: (courseId: string, moduleData: Partial<Module>) => void
  updateModule: (courseId: string, moduleId: string, updates: Partial<Module>) => void
  deleteModule: (courseId: string, moduleId: string) => void
  addLesson: (courseId: string, moduleId: string, lessonData: Partial<Lesson>) => void
  updateLesson: (courseId: string, moduleId: string, lessonId: string, updates: Partial<Lesson>) => void
  deleteLesson: (courseId: string, moduleId: string, lessonId: string) => void
  deleteCourse: (courseId: string) => void
  publishCourse: (courseId: string) => void
  
  // Getters
  getCourseById: (courseId: string) => Course | undefined
  getUserCourses: () => Course[]
  getAvailableCourses: () => Course[]
  getInstructorCourses: () => Course[]
}

const GameContext = createContext<GameContextType | undefined>(undefined)

export const useGame = () => {
  const context = useContext(GameContext)
  if (!context) {
    throw new Error('useGame must be used within a GameProvider')
  }
  return context
}

// Cursos Realistas para TCC - Conteúdo Educacional Brasileiro
const mockCourses: Course[] = [
  {
    id: '1',
    title: 'Fundamentos de Programação com Python',
    description: 'Aprenda programação do zero com Python, linguagem essencial para iniciantes e mercado de trabalho brasileiro.',
    instructor: 'Prof. Ana Carolina Santos',
    totalLessons: 15,
    completedLessons: 5,
    totalXP: 3000,
    earnedXP: 850,
    progress: 33,
    difficulty: 'comum',
    thumbnail: '🐍',
    category: 'Programação',
    rating: 4.8,
    students: 2847,
    duration: '45h',
    published: true,
    createdAt: '2024-10-01',
    updatedAt: '2025-01-15',
    modules: [
      {
        id: 'm1',
        title: 'Introdução à Programação',
        description: 'Conceitos básicos de lógica e algoritmos',
        order: 1,
        locked: false,
        lessons: [
          { 
            id: '1', 
            title: 'O que é Programação?', 
            duration: 12, 
            completed: true, 
            locked: false, 
            type: 'video', 
            xp: 100,
            content: 'Conceitos fundamentais de programação e como os computadores processam informações...',
            order: 1,
            videoUrl: 'https://example.com/python-intro'
          },
          { 
            id: '2', 
            title: 'Instalando Python e IDE', 
            duration: 18, 
            completed: true, 
            locked: false, 
            type: 'text', 
            xp: 80,
            content: 'Passo a passo para instalar Python e configurar ambiente de desenvolvimento',
            order: 2,
            textContent: 'Guia completo de instalação do Python 3.x e configuração do VS Code...'
          },
          { 
            id: '3', 
            title: 'Primeiro Programa em Python', 
            duration: 15, 
            completed: true, 
            locked: false, 
            type: 'challenge', 
            xp: 120,
            content: 'Desafio prático: criar seu primeiro "Hello World" em Python',
            order: 3
          },
          { 
            id: '4', 
            title: 'Variáveis e Tipos de Dados', 
            duration: 25, 
            completed: true, 
            locked: false, 
            type: 'video', 
            xp: 150,
            content: 'Aprendendo sobre strings, números, booleanos e como armazenar dados',
            order: 4
          },
          { 
            id: '5', 
            title: 'Quiz: Fundamentos Básicos', 
            duration: 10, 
            completed: true, 
            locked: false, 
            type: 'quiz', 
            xp: 100,
            content: 'Teste seus conhecimentos sobre os conceitos iniciais',
            order: 5,
            quizQuestions: [
              {
                id: 'q1',
                question: 'Qual comando é usado para exibir texto na tela em Python?',
                options: ['show()', 'print()', 'display()', 'output()'],
                correctAnswer: 1,
                explanation: 'O comando print() é usado para exibir informações na tela em Python.'
              }
            ]
          }
        ]
      },
      {
        id: 'm2', 
        title: 'Estruturas de Controle',
        description: 'Condições, loops e tomada de decisões',
        order: 2,
        locked: false,
        lessons: [
          { 
            id: '6', 
            title: 'Estruturas Condicionais (if/else)', 
            duration: 22, 
            completed: false, 
            locked: false, 
            type: 'video', 
            xp: 180,
            content: 'Como fazer o programa tomar decisões baseadas em condições',
            order: 6
          },
          { 
            id: '7', 
            title: 'Loops: For e While', 
            duration: 28, 
            completed: false, 
            locked: true, 
            type: 'video', 
            xp: 200,
            content: 'Repetindo ações com estruturas de repetição',
            order: 7
          }
        ]
      }
    ],
    lessons: [
      { 
        id: '1', 
        title: 'O que é Programação?', 
        duration: 12, 
        completed: true, 
        locked: false, 
        type: 'video', 
        xp: 100,
        content: 'Conceitos fundamentais de programação e como os computadores processam informações...',
        order: 1
      },
      { 
        id: '2', 
        title: 'Instalando Python e IDE', 
        duration: 18, 
        completed: true, 
        locked: false, 
        type: 'text', 
        xp: 80,
        content: 'Passo a passo para instalar Python e configurar ambiente de desenvolvimento',
        order: 2
      },
      { 
        id: '3', 
        title: 'Primeiro Programa em Python', 
        duration: 15, 
        completed: true, 
        locked: false, 
        type: 'challenge', 
        xp: 120,
        content: 'Desafio prático: criar seu primeiro "Hello World" em Python',
        order: 3
      },
      { 
        id: '4', 
        title: 'Variáveis e Tipos de Dados', 
        duration: 25, 
        completed: true, 
        locked: false, 
        type: 'video', 
        xp: 150,
        content: 'Aprendendo sobre strings, números, booleanos e como armazenar dados',
        order: 4
      },
      { 
        id: '5', 
        title: 'Quiz: Fundamentos Básicos', 
        duration: 10, 
        completed: true, 
        locked: false, 
        type: 'quiz', 
        xp: 100,
        content: 'Teste seus conhecimentos sobre os conceitos iniciais',
        order: 5
      },
      { 
        id: '6', 
        title: 'Estruturas Condicionais (if/else)', 
        duration: 22, 
        completed: false, 
        locked: false, 
        type: 'video', 
        xp: 180,
        content: 'Como fazer o programa tomar decisões baseadas em condições',
        order: 6
      },
      { 
        id: '7', 
        title: 'Loops: For e While', 
        duration: 28, 
        completed: false, 
        locked: true, 
        type: 'video', 
        xp: 200,
        content: 'Repetindo ações com estruturas de repetição',
        order: 7
      },
      { 
        id: '8', 
        title: 'Listas e Manipulação de Dados', 
        duration: 30, 
        completed: false, 
        locked: true, 
        type: 'video', 
        xp: 220,
        content: 'Trabalhando com coleções de dados em Python',
        order: 8
      },
      { 
        id: '9', 
        title: 'Funções: Organizando o Código', 
        duration: 25, 
        completed: false, 
        locked: true, 
        type: 'video', 
        xp: 190,
        content: 'Criando funções reutilizáveis para organizar melhor o código',
        order: 9
      },
      { 
        id: '10', 
        title: 'Projeto Prático: Calculadora', 
        duration: 45, 
        completed: false, 
        locked: true, 
        type: 'assignment', 
        xp: 300,
        content: 'Desenvolva uma calculadora completa aplicando todos os conceitos aprendidos',
        order: 10,
        assignmentDescription: 'Criar uma calculadora em Python que faça as 4 operações básicas, com interface amigável e tratamento de erros.'
      },
      { 
        id: '11', 
        title: 'Manipulação de Arquivos', 
        duration: 35, 
        completed: false, 
        locked: true, 
        type: 'video', 
        xp: 250,
        content: 'Aprendendo a ler e escrever arquivos em Python',
        order: 11
      },
      { 
        id: '12', 
        title: 'Bibliotecas Essenciais (Pandas, NumPy)', 
        duration: 40, 
        completed: false, 
        locked: true, 
        type: 'video', 
        xp: 280,
        content: 'Introdução às principais bibliotecas Python para análise de dados',
        order: 12
      },
      { 
        id: '13', 
        title: 'Projeto Final: Sistema de Cadastro', 
        duration: 60, 
        completed: false, 
        locked: true, 
        type: 'assignment', 
        xp: 400,
        content: 'Desenvolva um sistema completo de cadastro de clientes',
        order: 13,
        assignmentDescription: 'Sistema completo com CRUD (Create, Read, Update, Delete) para gerenciar cadastros, salvando dados em arquivo.'
      },
      { 
        id: '14', 
        title: 'Próximos Passos na Programação', 
        duration: 20, 
        completed: false, 
        locked: true, 
        type: 'video', 
        xp: 150,
        content: 'Orientações sobre como continuar seus estudos em programação',
        order: 14
      },
      { 
        id: '15', 
        title: 'Certificado de Conclusão', 
        duration: 5, 
        completed: false, 
        locked: true, 
        type: 'text', 
        xp: 200,
        content: 'Parabéns! Você concluiu o curso de Fundamentos de Programação com Python',
        order: 15
      }
    ]
  },
  {
    id: '2',
    title: 'Desenvolvimento Web com HTML, CSS e JavaScript',
    description: 'Aprenda a criar sites modernos e responsivos do zero. Curso completo para quem quer entrar no mercado de desenvolvimento web.',
    instructor: 'Prof. Carlos Eduardo Silva',
    totalLessons: 18,
    completedLessons: 0,
    totalXP: 3600,
    earnedXP: 0,
    progress: 0,
    difficulty: 'raro',
    thumbnail: '🌐',
    category: 'Desenvolvimento Web',
    rating: 4.9,
    students: 4521,
    duration: '55h',
    published: true,
    createdAt: '2024-09-15',
    updatedAt: '2025-01-10',
    modules: [
      {
        id: 'm1',
        title: 'Fundamentos da Web',
        description: 'HTML e estruturação de conteúdo',
        order: 1,
        locked: false,
        lessons: [
          { 
            id: '1', 
            title: 'Como Funciona a Internet', 
            duration: 20, 
            completed: false, 
            locked: false, 
            type: 'video', 
            xp: 120,
            content: 'Entenda como navegadores, servidores e protocolos funcionam',
            order: 1
          },
          { 
            id: '2', 
            title: 'Estrutura Básica do HTML', 
            duration: 25, 
            completed: false, 
            locked: true, 
            type: 'video', 
            xp: 150,
            content: 'Tags, elementos e estrutura de um documento HTML',
            order: 2
          }
        ]
      }
    ],
    lessons: [
      { 
        id: '1', 
        title: 'Como Funciona a Internet', 
        duration: 20, 
        completed: false, 
        locked: false, 
        type: 'video', 
        xp: 120,
        content: 'Entenda como navegadores, servidores e protocolos funcionam',
        order: 1
      },
      { 
        id: '2', 
        title: 'Estrutura Básica do HTML', 
        duration: 25, 
        completed: false, 
        locked: true, 
        type: 'video', 
        xp: 150,
        content: 'Tags, elementos e estrutura de um documento HTML',
        order: 2
      },
      { 
        id: '3', 
        title: 'Formulários e Inputs', 
        duration: 30, 
        completed: false, 
        locked: true, 
        type: 'challenge', 
        xp: 180,
        content: 'Criando formulários interativos com HTML',
        order: 3
      },
      { 
        id: '4', 
        title: 'Introdução ao CSS', 
        duration: 28, 
        completed: false, 
        locked: true, 
        type: 'video', 
        xp: 160,
        content: 'Aprendendo a estilizar páginas web com CSS',
        order: 4
      },
      { 
        id: '5', 
        title: 'CSS Responsivo e Mobile-First', 
        duration: 35, 
        completed: false, 
        locked: true, 
        type: 'challenge', 
        xp: 220,
        content: 'Criando layouts que funcionam em todos os dispositivos',
        order: 5
      },
      { 
        id: '6', 
        title: 'JavaScript Básico', 
        duration: 40, 
        completed: false, 
        locked: true, 
        type: 'video', 
        xp: 250,
        content: 'Introdução à programação com JavaScript no browser',
        order: 6
      },
      { 
        id: '7', 
        title: 'Manipulação do DOM', 
        duration: 32, 
        completed: false, 
        locked: true, 
        type: 'challenge', 
        xp: 200,
        content: 'Alterando elementos da página com JavaScript',
        order: 7
      },
      { 
        id: '8', 
        title: 'Projeto Final: Site Pessoal', 
        duration: 60, 
        completed: false, 
        locked: true, 
        type: 'assignment', 
        xp: 350,
        content: 'Construa seu primeiro site pessoal completo',
        order: 8,
        assignmentDescription: 'Desenvolva um site pessoal responsivo com HTML, CSS e JavaScript, incluindo portfólio e formulário de contato.'
      }
    ]
  },
  {
    id: '3',
    title: 'Excel Avançado para o Mercado de Trabalho',
    description: 'Domine planilhas profissionais, automação e análise de dados. Essencial para qualquer área profissional no Brasil.',
    instructor: 'Profa. Marina Oliveira',
    totalLessons: 12,
    completedLessons: 0,
    totalXP: 2200,
    earnedXP: 0,
    progress: 0,
    difficulty: 'raro',
    thumbnail: '�',
    category: 'Produtividade',
    rating: 4.7,
    students: 6892,
    duration: '30h',
    published: true,
    createdAt: '2024-11-01',
    updatedAt: '2025-01-05',
    modules: [
      {
        id: 'm1',
        title: 'Excel Profissional',
        description: 'Fórmulas avançadas e análise de dados',
        order: 1,
        locked: false,
        lessons: [
          { 
            id: '1', 
            title: 'Interface e Ferramentas Avançadas', 
            duration: 22, 
            completed: false, 
            locked: false, 
            type: 'video', 
            xp: 140,
            content: 'Dominando a interface e recursos profissionais do Excel',
            order: 1
          }
        ]
      }
    ],
    lessons: [
      { 
        id: '1', 
        title: 'Interface e Ferramentas Avançadas', 
        duration: 22, 
        completed: false, 
        locked: false, 
        type: 'video', 
        xp: 140,
        content: 'Dominando a interface e recursos profissionais do Excel',
        order: 1
      },
      { 
        id: '2', 
        title: 'Fórmulas e Funções Essenciais', 
        duration: 28, 
        completed: false, 
        locked: true, 
        type: 'challenge', 
        xp: 180,
        content: 'PROCV, SE, SOMASE e outras funções fundamentais',
        order: 2
      },
      { 
        id: '3', 
        title: 'Tabelas Dinâmicas Profissionais', 
        duration: 35, 
        completed: false, 
        locked: true, 
        type: 'video', 
        xp: 220,
        content: 'Criando relatórios e análises com tabelas dinâmicas',
        order: 3
      },
      { 
        id: '4', 
        title: 'Gráficos e Visualização de Dados', 
        duration: 25, 
        completed: false, 
        locked: true, 
        type: 'challenge', 
        xp: 170,
        content: 'Criando apresentações visuais impactantes',
        order: 4
      },
      { 
        id: '5', 
        title: 'Macros e Automação Básica', 
        duration: 40, 
        completed: false, 
        locked: true, 
        type: 'video', 
        xp: 280,
        content: 'Automatizando tarefas repetitivas com macros',
        order: 5
      }
    ]
  }
]

// Função para carregar dados do localStorage
function loadFromStorage<T>(key: string, defaultValue: T): T {
  try {
    const saved = localStorage.getItem(key)
    return saved ? JSON.parse(saved) : defaultValue
  } catch (error) {
    console.error(`Erro ao carregar ${key} do localStorage:`, error)
    return defaultValue
  }
}

// Função para salvar no localStorage
function saveToStorage<T>(key: string, data: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(data))
  } catch (error) {
    console.error(`Erro ao salvar ${key} no localStorage:`, error)
  }
}

export const GameProvider: React.FC<{ children: any }> = ({ children }) => {
  // Carrega dados salvos ou usa dados padrão
  const [courses, setCourses] = useState<Course[]>(() => 
    loadFromStorage('saber_courses', mockCourses)
  )
  
  const [userProgress, setUserProgress] = useState<UserProgress>(() =>
    loadFromStorage('saber_user_progress', {
      userId: '1',
      level: 1,
      totalXP: 850,
      nextLevelXP: 1000,
      streak: 1,
      badges: ['🎯'],
      completedCourses: [],
      currentCourses: ['1']
    })
  )

  // Salva automaticamente quando dados mudam
  useEffect(() => {
    saveToStorage('saber_courses', courses)
  }, [courses])

  useEffect(() => {
    saveToStorage('saber_user_progress', userProgress)
  }, [userProgress])

  const completLesson = (courseId: string, lessonId: string) => {
    setCourses(prev => prev.map(course => {
      if (course.id === courseId) {
        const updatedLessons = course.lessons.map(lesson => {
          if (lesson.id === lessonId && !lesson.completed) {
            // Award XP
            updateUserProgress(lesson.xp)
            
            // Check for achievements
            if (lesson.type === 'boss') {
              addBadge('👑')
            }
            
            return { ...lesson, completed: true }
          }
          return lesson
        })
        
        const completedCount = updatedLessons.filter(l => l.completed).length
        const earnedXP = updatedLessons.filter(l => l.completed).reduce((sum, l) => sum + l.xp, 0)
        const progress = Math.round((completedCount / course.totalLessons) * 100)
        
        // Unlock next lesson
        const currentIndex = updatedLessons.findIndex(l => l.id === lessonId)
        if (currentIndex < updatedLessons.length - 1) {
          updatedLessons[currentIndex + 1].locked = false
        }
        
        return {
          ...course,
          lessons: updatedLessons,
          completedLessons: completedCount,
          earnedXP,
          progress
        }
      }
      return course
    }))
    
    incrementStreak()
  }

  const enrollInCourse = (courseId: string) => {
    setUserProgress(prev => ({
      ...prev,
      currentCourses: [...prev.currentCourses, courseId]
    }))
  }

  const updateUserProgress = (xp: number) => {
    setUserProgress(prev => {
      const newTotalXP = prev.totalXP + xp
      let newLevel = prev.level
      let newNextLevelXP = prev.nextLevelXP
      
      // Level up logic
      if (newTotalXP >= prev.nextLevelXP) {
        newLevel += 1
        newNextLevelXP = prev.nextLevelXP + 1000 // Next level requires 1000 more XP
        
        // Award level up badge
        addBadge('🌟')
      }
      
      return {
        ...prev,
        totalXP: newTotalXP,
        level: newLevel,
        nextLevelXP: newNextLevelXP
      }
    })
  }

  const addBadge = (badge: string) => {
    setUserProgress(prev => {
      if (!prev.badges.includes(badge)) {
        return {
          ...prev,
          badges: [...prev.badges, badge]
        }
      }
      return prev
    })
  }

  const incrementStreak = () => {
    setUserProgress(prev => ({
      ...prev,
      streak: prev.streak + 1
    }))
  }

  const getCourseById = (courseId: string) => {
    return courses.find(course => course.id === courseId)
  }

  const getUserCourses = () => {
    return courses.filter(course => userProgress.currentCourses.includes(course.id))
  }

  const getAvailableCourses = () => {
    return courses.filter(course => !userProgress.currentCourses.includes(course.id))
  }

  const getInstructorCourses = () => {
    return courses.filter(course => course.instructor === 'Current User') // This would be dynamic
  }

  // Course Creation/Editing Functions
  const createCourse = (courseData: Partial<Course>): Course => {
    const newCourse: Course = {
      id: Date.now().toString(),
      title: courseData.title || 'Novo Curso',
      description: courseData.description || '',
      instructor: 'Current User', // This would be from auth
      totalLessons: 0,
      completedLessons: 0,
      totalXP: 0,
      earnedXP: 0,
      progress: 0,
      modules: [],
      lessons: [],
      difficulty: courseData.difficulty || 'comum',
      thumbnail: courseData.thumbnail || '📚',
      category: courseData.category || 'Geral',
      rating: 0,
      students: 0,
      duration: '0h',
      published: false,
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
      ...courseData
    }

    setCourses(prev => [...prev, newCourse])
    return newCourse
  }

  const updateCourse = (courseId: string, updates: Partial<Course>) => {
    setCourses(prev => prev.map(course => 
      course.id === courseId 
        ? { ...course, ...updates, updatedAt: new Date().toISOString().split('T')[0] }
        : course
    ))
  }

  const addModule = (courseId: string, moduleData: Partial<Module>) => {
    const newModule: Module = {
      id: Date.now().toString(),
      title: moduleData.title || 'Novo Módulo',
      description: moduleData.description || '',
      lessons: [],
      order: moduleData.order || 1,
      locked: false,
      ...moduleData
    }

    setCourses(prev => prev.map(course => 
      course.id === courseId 
        ? { 
            ...course, 
            modules: [...course.modules, newModule],
            updatedAt: new Date().toISOString().split('T')[0]
          }
        : course
    ))
  }

  const updateModule = (courseId: string, moduleId: string, updates: Partial<Module>) => {
    setCourses(prev => prev.map(course => 
      course.id === courseId 
        ? {
            ...course,
            modules: course.modules.map(module => 
              module.id === moduleId ? { ...module, ...updates } : module
            ),
            updatedAt: new Date().toISOString().split('T')[0]
          }
        : course
    ))
  }

  const deleteModule = (courseId: string, moduleId: string) => {
    setCourses(prev => prev.map(course => 
      course.id === courseId 
        ? {
            ...course,
            modules: course.modules.filter(module => module.id !== moduleId),
            updatedAt: new Date().toISOString().split('T')[0]
          }
        : course
    ))
  }

  const addLesson = (courseId: string, moduleId: string, lessonData: Partial<Lesson>) => {
    const newLesson: Lesson = {
      id: Date.now().toString(),
      title: lessonData.title || 'Nova Aula',
      duration: lessonData.duration || 10,
      completed: false,
      locked: false,
      type: lessonData.type || 'video',
      xp: lessonData.xp || 100,
      content: lessonData.content || '',
      order: lessonData.order || 1,
      ...lessonData
    }

    setCourses(prev => prev.map(course => 
      course.id === courseId 
        ? {
            ...course,
            modules: course.modules.map(module => 
              module.id === moduleId 
                ? { ...module, lessons: [...module.lessons, newLesson] }
                : module
            ),
            totalLessons: course.totalLessons + 1,
            totalXP: course.totalXP + newLesson.xp,
            updatedAt: new Date().toISOString().split('T')[0]
          }
        : course
    ))
  }

  const updateLesson = (courseId: string, moduleId: string, lessonId: string, updates: Partial<Lesson>) => {
    setCourses(prev => prev.map(course => 
      course.id === courseId 
        ? {
            ...course,
            modules: course.modules.map(module => 
              module.id === moduleId 
                ? {
                    ...module,
                    lessons: module.lessons.map(lesson => 
                      lesson.id === lessonId ? { ...lesson, ...updates } : lesson
                    )
                  }
                : module
            ),
            updatedAt: new Date().toISOString().split('T')[0]
          }
        : course
    ))
  }

  const deleteLesson = (courseId: string, moduleId: string, lessonId: string) => {
    setCourses(prev => prev.map(course => 
      course.id === courseId 
        ? {
            ...course,
            modules: course.modules.map(module => 
              module.id === moduleId 
                ? {
                    ...module,
                    lessons: module.lessons.filter(lesson => lesson.id !== lessonId)
                  }
                : module
            ),
            totalLessons: Math.max(0, course.totalLessons - 1),
            updatedAt: new Date().toISOString().split('T')[0]
          }
        : course
    ))
  }

  const deleteCourse = (courseId: string) => {
    setCourses(prev => prev.filter(course => course.id !== courseId))
  }

  const publishCourse = (courseId: string) => {
    setCourses(prev => prev.map(course => 
      course.id === courseId 
        ? { 
            ...course, 
            published: true, 
            updatedAt: new Date().toISOString().split('T')[0]
          }
        : course
    ))
  }

  return (
    <GameContext.Provider value={{
      userProgress,
      courses,
      completLesson,
      enrollInCourse,
      updateUserProgress,
      addBadge,
      incrementStreak,
      getCourseById,
      getUserCourses,
      getAvailableCourses,
      getInstructorCourses,
      createCourse,
      updateCourse,
      addModule,
      updateModule,
      deleteModule,
      addLesson,
      updateLesson,
      deleteLesson,
      deleteCourse,
      publishCourse
    }}>
      {children}
    </GameContext.Provider>
  )
}
