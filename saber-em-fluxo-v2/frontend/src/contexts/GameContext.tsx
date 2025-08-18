import React, { createContext, useContext, useState, useEffect } from 'react'
import { CourseService } from '../services/courseService'

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
  coursesLoading: boolean
  
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
            content: 'Nesta videoaula, você descobrirá os conceitos fundamentais da programação e como os computadores processam informações. Aprenderá sobre algoritmos, lógica de programação e por que Python é uma excelente escolha para iniciantes.',
            order: 1,
            videoUrl: 'https://www.youtube.com/embed/S9uPNppGsGo?rel=0&modestbranding=1'
          },
          { 
            id: '2', 
            title: 'Instalando Python e IDE', 
            duration: 18, 
            completed: true, 
            locked: false, 
            type: 'text', 
            xp: 80,
            content: 'Guia completo para instalar Python em seu computador e configurar um ambiente de desenvolvimento profissional. Você aprenderá a instalar o Python, configurar variáveis de ambiente e preparar o VS Code com as extensões necessárias.',
            order: 2,
            textContent: 'Lembre-se: sempre baixe o Python do site oficial (python.org) e marque a opção "Add to PATH" durante a instalação. Isso facilitará o uso do Python no terminal.'
          },
          { 
            id: '3', 
            title: 'Primeiro Programa em Python', 
            duration: 15, 
            completed: true, 
            locked: false, 
            type: 'video', 
            xp: 120,
            content: 'Hora de colocar a mão na massa! Neste desafio prático, você criará seu primeiro programa em Python - o famoso "Hello World". Aprenderá sobre a função print() e como executar código Python.',
            order: 3,
            videoUrl: 'https://www.youtube.com/embed/rfscVS0vtbw?rel=0&modestbranding=1'
          },
          { 
            id: '4', 
            title: 'Variáveis e Tipos de Dados', 
            duration: 25, 
            completed: true, 
            locked: false, 
            type: 'video', 
            xp: 150,
            content: 'Descubra como armazenar e manipular informações em Python. Aprenda sobre strings (textos), números inteiros e decimais, booleanos (True/False) e como criar variáveis para guardar esses dados.',
            order: 4,
            videoUrl: 'https://www.youtube.com/embed/O4bJjmASNdI?rel=0&modestbranding=1'
          },
          { 
            id: '5', 
            title: 'Quiz: Fundamentos Básicos', 
            duration: 10, 
            completed: true, 
            locked: false, 
            type: 'quiz', 
            xp: 100,
            content: 'Teste seus conhecimentos sobre os conceitos iniciais de programação Python. Quiz com 5 perguntas sobre instalação, variáveis e tipos de dados.',
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
        content: 'Aprenda como fazer seu programa tomar decisões inteligentes! Nesta aula, você descobrirá como usar if, else e elif para criar programas que respondem de forma diferente dependendo das situações.',
        order: 6,
        videoUrl: 'https://www.youtube.com/embed/lWeCgEbk-Ro?rel=0&modestbranding=1'
      },
      { 
        id: '7', 
        title: 'Loops: For e While', 
        duration: 28, 
        completed: false, 
        locked: true, 
        type: 'video', 
        xp: 200,
        content: 'Domine as estruturas de repetição em Python! Aprenda a usar loops for e while para automatizar tarefas repetitivas e processar grandes quantidades de dados de forma eficiente.',
        order: 7,
        videoUrl: 'https://www.youtube.com/embed/6iF8Xb7Z3wQ?rel=0&modestbranding=1'
      },
      { 
        id: '8', 
        title: 'Listas e Manipulação de Dados', 
        duration: 30, 
        completed: false, 
        locked: true, 
        type: 'video', 
        xp: 220,
        content: 'Descubra o poder das listas em Python! Aprenda a criar, modificar e manipular coleções de dados, incluindo operações como adicionar, remover e percorrer elementos.',
        order: 8,
        videoUrl: 'https://www.youtube.com/embed/tw7ror9x32s?rel=0&modestbranding=1'
      },
      { 
        id: '9', 
        title: 'Funções: Organizando o Código', 
        duration: 25, 
        completed: false, 
        locked: true, 
        type: 'video', 
        xp: 190,
        content: 'Aprenda a criar funções reutilizáveis em Python! Descubra como organizar melhor seu código, evitar repetições e criar programas mais limpos e eficientes usando def, parâmetros e return.',
        order: 9,
        videoUrl: 'https://www.youtube.com/embed/9Os0o3wzS_I?rel=0&modestbranding=1'
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
  // Estado para cursos - inicia vazio e carrega da API
  const [courses, setCourses] = useState<Course[]>([])
  const [coursesLoading, setCoursesLoading] = useState(true)
  
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

  // Carregar cursos da API
  useEffect(() => {
    const loadCourses = async () => {
      try {
        setCoursesLoading(true)
        console.log('🚀 Carregando cursos da API...')
        
        // Tentar carregar da API primeiro
        try {
          const apiCourses = await CourseService.getCourses({ limit: 50 })
          console.log('✅ Cursos carregados da API:', apiCourses.length)
          
          // Converter cursos da API para o formato do GameContext
          const formattedCourses: Course[] = apiCourses.map((apiCourse: any) => ({
            id: apiCourse.id,
            title: apiCourse.title,
            description: apiCourse.description,
            instructor: `${apiCourse.instructor?.first_name || ''} ${apiCourse.instructor?.last_name || ''}`.trim() || 'Instrutor',
            totalLessons: 10, // Placeholder - seria calculado dos módulos
            completedLessons: 0,
            totalXP: apiCourse.xp_reward || 1000,
            earnedXP: 0,
            progress: 0,
            difficulty: mapDifficulty(apiCourse.difficulty),
            thumbnail: getCategoryEmoji(apiCourse.category),
            category: apiCourse.category,
            rating: 4.5, // Placeholder
            students: Math.floor(Math.random() * 3000) + 500, // Placeholder
            duration: `${apiCourse.estimated_hours}h`,
            published: apiCourse.is_published,
            createdAt: apiCourse.created_at,
            updatedAt: apiCourse.updated_at,
            modules: [], // Seria carregado separadamente se necessário
            lessons: [] // Seria carregado separadamente se necessário
          }))
          
          setCourses(formattedCourses)
          console.log('✅ Cursos da API configurados com sucesso!')
        } catch (apiError) {
          console.warn('⚠️ Erro na API, usando dados expandidos mockados:', apiError)
          
          // Fallback: usar dados mockados expandidos com 24 cursos
          const expandedMockCourses: Course[] = [
            ...mockCourses, // 12 cursos originais
            // 12 novos cursos mockados
            {
              id: 'flutter-dart-101',
              title: 'Flutter & Dart - Desenvolvimento Mobile',
              description: 'Aprenda a criar aplicativos móveis nativos para iOS e Android usando Flutter e Dart.',
              instructor: 'Ana Silva',
              totalLessons: 45,
              completedLessons: 0,
              totalXP: 2500,
              earnedXP: 0,
              progress: 0,
              difficulty: 'raro',
              thumbnail: '📱',
              category: 'Mobile',
              rating: 4.8,
              students: 1250,
              duration: '55h',
              published: true,
              createdAt: '2024-01-15',
              updatedAt: '2024-01-15',
              modules: [],
              lessons: [
                { 
                  id: '1', 
                  title: 'Introdução ao Flutter', 
                  duration: 20, 
                  completed: false, 
                  locked: false, 
                  type: 'video', 
                  xp: 150,
                  content: 'Descubra o poder do Flutter! Framework revolucionário do Google para desenvolvimento mobile multiplataforma.',
                  order: 1,
                  videoUrl: 'https://www.youtube.com/embed/x0uinJvhNxI?rel=0&modestbranding=1'
                },
                { 
                  id: '2', 
                  title: 'Instalação e Configuração', 
                  duration: 25, 
                  completed: false, 
                  locked: false, 
                  type: 'video', 
                  xp: 120,
                  content: 'Configure seu ambiente de desenvolvimento Flutter no Windows, macOS e Linux.',
                  order: 2,
                  videoUrl: 'https://www.youtube.com/embed/Z3TGEC2TGdE?rel=0&modestbranding=1'
                },
                { 
                  id: '3', 
                  title: 'Primeiro App Flutter', 
                  duration: 30, 
                  completed: false, 
                  locked: false, 
                  type: 'video', 
                  xp: 180,
                  content: 'Crie seu primeiro aplicativo Flutter: Hello World e conceitos básicos de Widgets.',
                  order: 3,
                  videoUrl: 'https://www.youtube.com/embed/1gDhl4leEzA?rel=0&modestbranding=1'
                },
                { 
                  id: '4', 
                  title: 'Dart Language Fundamentals', 
                  duration: 35, 
                  completed: false, 
                  locked: false, 
                  type: 'video', 
                  xp: 200,
                  content: 'Domine a linguagem Dart: variáveis, funções, classes e programação orientada a objetos.',
                  order: 4,
                  videoUrl: 'https://www.youtube.com/embed/Ej_Pcr4uC2Q?rel=0&modestbranding=1'
                },
                { 
                  id: '5', 
                  title: 'Widgets Essenciais', 
                  duration: 40, 
                  completed: false, 
                  locked: false, 
                  type: 'video', 
                  xp: 220,
                  content: 'Explore widgets fundamentais: Container, Column, Row, Stack e como criar layouts responsivos.',
                  order: 5,
                  videoUrl: 'https://www.youtube.com/embed/b_sQ9bMltGU?rel=0&modestbranding=1'
                }
              ]
            },
            {
              id: 'angular-17-modern',
              title: 'Angular 17 - Framework Moderno',
              description: 'Domine o Angular 17 com suas novas features e melhores práticas de desenvolvimento.',
              instructor: 'Carlos Mendes',
              totalLessons: 50,
              completedLessons: 0,
              totalXP: 2800,
              earnedXP: 0,
              progress: 0,
              difficulty: 'épico',
              thumbnail: '🅰️',
              category: 'Frontend',
              rating: 4.7,
              students: 980,
              duration: '65h',
              published: true,
              createdAt: '2024-01-16',
              updatedAt: '2024-01-16',
              modules: [],
              lessons: [
                { 
                  id: '1', 
                  title: 'Angular 17: O que há de novo?', 
                  duration: 18, 
                  completed: false, 
                  locked: false, 
                  type: 'video', 
                  xp: 140,
                  content: 'Descubra todas as novidades do Angular 17: Control Flow, Standalone Components e muito mais!',
                  order: 1,
                  videoUrl: 'https://www.youtube.com/embed/I7f-qfzqfyM?rel=0&modestbranding=1'
                },
                { 
                  id: '2', 
                  title: 'Configuração do Ambiente Angular', 
                  duration: 22, 
                  completed: false, 
                  locked: false, 
                  type: 'video', 
                  xp: 130,
                  content: 'Configure o Angular CLI, Node.js e VSCode com as melhores extensões para desenvolvimento.',
                  order: 2,
                  videoUrl: 'https://www.youtube.com/embed/AAu8bjBz6HA?rel=0&modestbranding=1'
                },
                { 
                  id: '3', 
                  title: 'Primeiro Projeto Angular', 
                  duration: 28, 
                  completed: false, 
                  locked: false, 
                  type: 'video', 
                  xp: 170,
                  content: 'Crie seu primeiro projeto Angular 17 e entenda a estrutura de arquivos e componentes.',
                  order: 3,
                  videoUrl: 'https://www.youtube.com/embed/3qBXWUpoPHo?rel=0&modestbranding=1'
                },
                { 
                  id: '4', 
                  title: 'Components e Templates', 
                  duration: 32, 
                  completed: false, 
                  locked: false, 
                  type: 'video', 
                  xp: 190,
                  content: 'Domine componentes Angular: criação, templates, interpolação e property binding.',
                  order: 4,
                  videoUrl: 'https://www.youtube.com/embed/k5E2AVpwsko?rel=0&modestbranding=1'
                },
                { 
                  id: '5', 
                  title: 'Services e Dependency Injection', 
                  duration: 35, 
                  completed: false, 
                  locked: false, 
                  type: 'video', 
                  xp: 210,
                  content: 'Aprenda a criar services, trabalhar com injeção de dependência e compartilhar dados.',
                  order: 5,
                  videoUrl: 'https://www.youtube.com/embed/0BIqnmaDPPI?rel=0&modestbranding=1'
                }
              ]
            },
            {
              id: 'tensorflow-ai-ml',
              title: 'TensorFlow & Inteligência Artificial',
              description: 'Mergulhe no mundo da IA com TensorFlow, criando modelos de machine learning avançados.',
              instructor: 'Dra. Marina Costa',
              totalLessons: 60,
              completedLessons: 0,
              totalXP: 3500,
              earnedXP: 0,
              progress: 0,
              difficulty: 'lendário',
              thumbnail: '🧠',
              category: 'Inteligência Artificial',
              rating: 4.9,
              students: 750,
              duration: '80h',
              published: true,
              createdAt: '2024-01-17',
              updatedAt: '2024-01-17',
              modules: [],
              lessons: [
                { 
                  id: '1', 
                  title: 'Introdução ao Machine Learning', 
                  duration: 25, 
                  completed: false, 
                  locked: false, 
                  type: 'video', 
                  xp: 180,
                  content: 'Fundamentos da Inteligência Artificial e como ela está transformando o mundo.',
                  order: 1,
                  videoUrl: 'https://www.youtube.com/embed/HcqpanDadyQ?rel=0&modestbranding=1'
                },
                { 
                  id: '2', 
                  title: 'TensorFlow: Primeiros Passos', 
                  duration: 30, 
                  completed: false, 
                  locked: false, 
                  type: 'video', 
                  xp: 200,
                  content: 'Instalação e configuração do TensorFlow. Seu primeiro modelo de IA.',
                  order: 2,
                  videoUrl: 'https://www.youtube.com/embed/tPYj3fFJGjk?rel=0&modestbranding=1'
                },
                { 
                  id: '3', 
                  title: 'Redes Neurais Artificiais', 
                  duration: 35, 
                  completed: false, 
                  locked: false, 
                  type: 'video', 
                  xp: 220,
                  content: 'Como funcionam as redes neurais e por que são tão poderosas.',
                  order: 3,
                  videoUrl: 'https://www.youtube.com/embed/aircAruvnKk?rel=0&modestbranding=1'
                },
                { 
                  id: '4', 
                  title: 'Processamento de Imagens com IA', 
                  duration: 40, 
                  completed: false, 
                  locked: false, 
                  type: 'video', 
                  xp: 250,
                  content: 'Crie modelos que reconhecem objetos e rostos em imagens usando CNN.',
                  order: 4,
                  videoUrl: 'https://www.youtube.com/embed/AgkfIQ4IGaM?rel=0&modestbranding=1'
                },
                { 
                  id: '5', 
                  title: 'Natural Language Processing', 
                  duration: 38, 
                  completed: false, 
                  locked: false, 
                  type: 'video', 
                  xp: 240,
                  content: 'Ensine sua IA a entender e processar linguagem humana.',
                  order: 5,
                  videoUrl: 'https://www.youtube.com/embed/fNxaJsNG3-s?rel=0&modestbranding=1'
                }
              ]
            },
            {
              id: 'blockchain-crypto',
              title: 'Blockchain & Criptomoedas',
              description: 'Entenda a tecnologia blockchain e desenvolva aplicações descentralizadas.',
              instructor: 'Roberto Blockchain',
              totalLessons: 55,
              completedLessons: 0,
              totalXP: 3000,
              earnedXP: 0,
              progress: 0,
              difficulty: 'épico',
              thumbnail: '⛓️',
              category: 'Blockchain',
              rating: 4.6,
              students: 890,
              duration: '70h',
              published: true,
              createdAt: '2024-01-18',
              updatedAt: '2024-01-18',
              modules: [],
              lessons: [
                { 
                  id: '1', 
                  title: 'O que é Blockchain?', 
                  duration: 22, 
                  completed: false, 
                  locked: false, 
                  type: 'video', 
                  xp: 160,
                  content: 'Entenda os fundamentos da tecnologia que revolucionou as transações digitais.',
                  order: 1,
                  videoUrl: 'https://www.youtube.com/embed/SSo_EIwHSd4?rel=0&modestbranding=1'
                },
                { 
                  id: '2', 
                  title: 'Bitcoin e Criptomoedas', 
                  duration: 28, 
                  completed: false, 
                  locked: false, 
                  type: 'video', 
                  xp: 180,
                  content: 'Como funciona o Bitcoin e outras criptomoedas: mineração, carteiras e transações.',
                  order: 2,
                  videoUrl: 'https://www.youtube.com/embed/bBC-nXj3Ng4?rel=0&modestbranding=1'
                },
                { 
                  id: '3', 
                  title: 'Ethereum e Smart Contracts', 
                  duration: 35, 
                  completed: false, 
                  locked: false, 
                  type: 'video', 
                  xp: 210,
                  content: 'Programação de contratos inteligentes na rede Ethereum usando Solidity.',
                  order: 3,
                  videoUrl: 'https://www.youtube.com/embed/M576WGiDBdQ?rel=0&modestbranding=1'
                },
                { 
                  id: '4', 
                  title: 'NFTs e Tokens', 
                  duration: 30, 
                  completed: false, 
                  locked: false, 
                  type: 'video', 
                  xp: 190,
                  content: 'Crie e comercialize NFTs: arte digital, jogos e colecionáveis únicos.',
                  order: 4,
                  videoUrl: 'https://www.youtube.com/embed/Oz9zw7-_vhM?rel=0&modestbranding=1'
                },
                { 
                  id: '5', 
                  title: 'DeFi - Finanças Descentralizadas', 
                  duration: 32, 
                  completed: false, 
                  locked: false, 
                  type: 'video', 
                  xp: 200,
                  content: 'Explore o mundo das finanças descentralizadas: empréstimos, staking e DEXs.',
                  order: 5,
                  videoUrl: 'https://www.youtube.com/embed/17QRFlml4pA?rel=0&modestbranding=1'
                }
              ]
            },
            {
              id: 'golang-performance',
              title: 'Go Lang - Programação de Alto Desempenho',
              description: 'Aprenda Go, a linguagem criada pelo Google para aplicações de alta performance.',
              instructor: 'João Gopher',
              totalLessons: 35,
              completedLessons: 0,
              totalXP: 2000,
              earnedXP: 0,
              progress: 0,
              difficulty: 'raro',
              thumbnail: '🐹',
              category: 'Backend',
              rating: 4.7,
              students: 650,
              duration: '45h',
              published: true,
              createdAt: '2024-01-19',
              updatedAt: '2024-01-19',
              modules: [],
              lessons: [
                { 
                  id: '1', 
                  title: 'Introdução ao Go Lang', 
                  duration: 20, 
                  completed: false, 
                  locked: false, 
                  type: 'video', 
                  xp: 150,
                  content: 'Conheça a linguagem Go: simplicidade, performance e concorrência nativa.',
                  order: 1,
                  videoUrl: 'https://www.youtube.com/embed/YS4e4q9oBaU?rel=0&modestbranding=1'
                },
                { 
                  id: '2', 
                  title: 'Instalação e Primeiro Programa', 
                  duration: 25, 
                  completed: false, 
                  locked: false, 
                  type: 'video', 
                  xp: 130,
                  content: 'Configure Go em sua máquina e escreva seu primeiro "Hello, World!".',
                  order: 2,
                  videoUrl: 'https://www.youtube.com/embed/etSN4X_fCnM?rel=0&modestbranding=1'
                },
                { 
                  id: '3', 
                  title: 'Sintaxe e Estruturas de Dados', 
                  duration: 30, 
                  completed: false, 
                  locked: false, 
                  type: 'video', 
                  xp: 170,
                  content: 'Variables, arrays, slices, maps e structs: as bases da programação Go.',
                  order: 3,
                  videoUrl: 'https://www.youtube.com/embed/YMvpl24js3o?rel=0&modestbranding=1'
                },
                { 
                  id: '4', 
                  title: 'Goroutines e Canais', 
                  duration: 35, 
                  completed: false, 
                  locked: false, 
                  type: 'video', 
                  xp: 200,
                  content: 'Domine a concorrência em Go: goroutines, channels e patterns avançados.',
                  order: 4,
                  videoUrl: 'https://www.youtube.com/embed/f6kdp27TYZs?rel=0&modestbranding=1'
                },
                { 
                  id: '5', 
                  title: 'Web APIs com Go', 
                  duration: 40, 
                  completed: false, 
                  locked: false, 
                  type: 'video', 
                  xp: 220,
                  content: 'Construa APIs REST performáticas usando Go e frameworks populares.',
                  order: 5,
                  videoUrl: 'https://www.youtube.com/embed/Hs7u5EHb11Y?rel=0&modestbranding=1'
                }
              ]
            },
            {
              id: 'rust-systems',
              title: 'Rust - Programação de Sistemas Segura',
              description: 'Domine Rust, a linguagem que combina performance com segurança de memória.',
              instructor: 'Elena Ferris',
              totalLessons: 48,
              completedLessons: 0,
              totalXP: 2700,
              earnedXP: 0,
              progress: 0,
              difficulty: 'épico',
              thumbnail: '🦀',
              category: 'Sistemas',
              rating: 4.8,
              students: 540,
              duration: '60h',
              published: true,
              createdAt: '2024-01-20',
              updatedAt: '2024-01-20',
              modules: [],
              lessons: [
                { 
                  id: '1', 
                  title: 'Por que Rust? Introdução', 
                  duration: 25, 
                  completed: false, 
                  locked: false, 
                  type: 'video', 
                  xp: 170,
                  content: 'Descubra por que Rust está revolucionando a programação de sistemas.',
                  order: 1,
                  videoUrl: 'https://www.youtube.com/embed/5C_HPTJg5ek?rel=0&modestbranding=1'
                },
                { 
                  id: '2', 
                  title: 'Instalação e Cargo', 
                  duration: 20, 
                  completed: false, 
                  locked: false, 
                  type: 'video', 
                  xp: 140,
                  content: 'Configure Rust e aprenda a usar o Cargo, o gerenciador de pacotes.',
                  order: 2,
                  videoUrl: 'https://www.youtube.com/embed/br3GIIQeefY?rel=0&modestbranding=1'
                },
                { 
                  id: '3', 
                  title: 'Ownership e Borrowing', 
                  duration: 35, 
                  completed: false, 
                  locked: false, 
                  type: 'video', 
                  xp: 220,
                  content: 'O conceito mais importante de Rust: como gerenciar memória de forma segura.',
                  order: 3,
                  videoUrl: 'https://www.youtube.com/embed/VFIOSWy93H0?rel=0&modestbranding=1'
                },
                { 
                  id: '4', 
                  title: 'Structs e Enums', 
                  duration: 30, 
                  completed: false, 
                  locked: false, 
                  type: 'video', 
                  xp: 190,
                  content: 'Organize dados com structs e crie tipos poderosos com enums.',
                  order: 4,
                  videoUrl: 'https://www.youtube.com/embed/Epwlk4B90vk?rel=0&modestbranding=1'
                },
                { 
                  id: '5', 
                  title: 'Error Handling com Result', 
                  duration: 28, 
                  completed: false, 
                  locked: false, 
                  type: 'video', 
                  xp: 180,
                  content: 'Gerencie erros de forma elegante usando Result e Option.',
                  order: 5,
                  videoUrl: 'https://www.youtube.com/embed/lpOg2nl3kr0?rel=0&modestbranding=1'
                }
              ]
            },
            {
              id: 'kubernetes-devops',
              title: 'Kubernetes - Orquestração de Containers',
              description: 'Aprenda a gerenciar aplicações em containers usando Kubernetes.',
              instructor: 'Miguel DevOps',
              totalLessons: 40,
              completedLessons: 0,
              totalXP: 2300,
              earnedXP: 0,
              progress: 0,
              difficulty: 'épico',
              thumbnail: '☸️',
              category: 'DevOps',
              rating: 4.7,
              students: 720,
              duration: '50h',
              published: true,
              createdAt: '2024-01-21',
              updatedAt: '2024-01-21',
              modules: [],
              lessons: [
                { 
                  id: '1', 
                  title: 'Introdução ao Kubernetes', 
                  duration: 22, 
                  completed: false, 
                  locked: false, 
                  type: 'video', 
                  xp: 160,
                  content: 'Entenda o que é orquestração de containers e por que usar Kubernetes.',
                  order: 1,
                  videoUrl: 'https://www.youtube.com/embed/PH-2FfFD2PU?rel=0&modestbranding=1'
                },
                { 
                  id: '2', 
                  title: 'Instalação e Configuração', 
                  duration: 30, 
                  completed: false, 
                  locked: false, 
                  type: 'video', 
                  xp: 180,
                  content: 'Configure um cluster Kubernetes local usando Minikube e kubectl.',
                  order: 2,
                  videoUrl: 'https://www.youtube.com/embed/X48VuDVv0do?rel=0&modestbranding=1'
                },
                { 
                  id: '3', 
                  title: 'Pods, Deployments e Services', 
                  duration: 35, 
                  completed: false, 
                  locked: false, 
                  type: 'video', 
                  xp: 210,
                  content: 'Os componentes fundamentais do Kubernetes: pods, deployments e services.',
                  order: 3,
                  videoUrl: 'https://www.youtube.com/embed/Krpb44XR0bk?rel=0&modestbranding=1'
                },
                { 
                  id: '4', 
                  title: 'ConfigMaps e Secrets', 
                  duration: 28, 
                  completed: false, 
                  locked: false, 
                  type: 'video', 
                  xp: 170,
                  content: 'Gerencie configurações e dados sensíveis de forma segura.',
                  order: 4,
                  videoUrl: 'https://www.youtube.com/embed/FAnQTgr04mU?rel=0&modestbranding=1'
                },
                { 
                  id: '5', 
                  title: 'Ingress e Load Balancing', 
                  duration: 32, 
                  completed: false, 
                  locked: false, 
                  type: 'video', 
                  xp: 190,
                  content: 'Exponha suas aplicações para o mundo externo usando Ingress.',
                  order: 5,
                  videoUrl: 'https://www.youtube.com/embed/80Ew_fsV4rM?rel=0&modestbranding=1'
                }
              ]
            },
            {
              id: 'unity-gamedev',
              title: 'Unity - Desenvolvimento de Jogos 3D',
              description: 'Crie jogos incríveis em 3D usando a engine Unity e C#.',
              instructor: 'Paula GameDev',
              totalLessons: 58,
              completedLessons: 0,
              totalXP: 3200,
              earnedXP: 0,
              progress: 0,
              difficulty: 'épico',
              thumbnail: '🎮',
              category: 'Game Development',
              rating: 4.8,
              students: 1100,
              duration: '75h',
              published: true,
              createdAt: '2024-01-22',
              updatedAt: '2024-01-22',
              modules: [],
              lessons: [
                { 
                  id: '1', 
                  title: 'Introdução ao Unity', 
                  duration: 20, 
                  completed: false, 
                  locked: false, 
                  type: 'video', 
                  xp: 150,
                  content: 'Conheça a engine Unity e suas possibilidades para desenvolvimento de jogos.',
                  order: 1,
                  videoUrl: 'https://www.youtube.com/embed/XtQMytORBmM?rel=0&modestbranding=1'
                },
                { 
                  id: '2', 
                  title: 'Instalação e Interface', 
                  duration: 25, 
                  completed: false, 
                  locked: false, 
                  type: 'video', 
                  xp: 130,
                  content: 'Instale Unity e aprenda a navegar pela interface do editor.',
                  order: 2,
                  videoUrl: 'https://www.youtube.com/embed/v1h7BqoYhLU?rel=0&modestbranding=1'
                },
                { 
                  id: '3', 
                  title: 'GameObjects e Components', 
                  duration: 30, 
                  completed: false, 
                  locked: false, 
                  type: 'video', 
                  xp: 170,
                  content: 'Entenda a arquitetura do Unity: GameObjects, Components e Transform.',
                  order: 3,
                  videoUrl: 'https://www.youtube.com/embed/3nKXhbNJVlQ?rel=0&modestbranding=1'
                },
                { 
                  id: '4', 
                  title: 'Scripts e Programação C#', 
                  duration: 35, 
                  completed: false, 
                  locked: false, 
                  type: 'video', 
                  xp: 200,
                  content: 'Programe comportamentos de jogos usando C# no Unity.',
                  order: 4,
                  videoUrl: 'https://www.youtube.com/embed/HpTOcjm0qzg?rel=0&modestbranding=1'
                },
                { 
                  id: '5', 
                  title: 'Physics e Collisions', 
                  duration: 28, 
                  completed: false, 
                  locked: false, 
                  type: 'video', 
                  xp: 180,
                  content: 'Implemente física realista: Rigidbody, Colliders e detecção de colisão.',
                  order: 5,
                  videoUrl: 'https://www.youtube.com/embed/7I7JRLwJDPM?rel=0&modestbranding=1'
                }
              ]
            },
            {
              id: 'graphql-api',
              title: 'GraphQL - APIs Modernas',
              description: 'Desenvolva APIs eficientes e flexíveis com GraphQL.',
              instructor: 'Lucas Query',
              totalLessons: 30,
              completedLessons: 0,
              totalXP: 1800,
              earnedXP: 0,
              progress: 0,
              difficulty: 'raro',
              thumbnail: '📊',
              category: 'Backend',
              rating: 4.6,
              students: 580,
              duration: '40h',
              published: true,
              createdAt: '2024-01-23',
              updatedAt: '2024-01-23',
              modules: [],
              lessons: [
                { 
                  id: '1', 
                  title: 'GraphQL vs REST: Por que migrar?', 
                  duration: 18, 
                  completed: false, 
                  locked: false, 
                  type: 'video', 
                  xp: 140,
                  content: 'Entenda as vantagens do GraphQL sobre APIs REST tradicionais.',
                  order: 1,
                  videoUrl: 'https://www.youtube.com/embed/eIQh02xuVw4?rel=0&modestbranding=1'
                },
                { 
                  id: '2', 
                  title: 'Schema e Type System', 
                  duration: 25, 
                  completed: false, 
                  locked: false, 
                  type: 'video', 
                  xp: 160,
                  content: 'Defina esquemas robustos usando o sistema de tipos do GraphQL.',
                  order: 2,
                  videoUrl: 'https://www.youtube.com/embed/eaKtUjPwR2I?rel=0&modestbranding=1'
                },
                { 
                  id: '3', 
                  title: 'Queries e Mutations', 
                  duration: 30, 
                  completed: false, 
                  locked: false, 
                  type: 'video', 
                  xp: 180,
                  content: 'Aprenda a criar queries para buscar dados e mutations para modificá-los.',
                  order: 3,
                  videoUrl: 'https://www.youtube.com/embed/ZQL7tL2S0oQ?rel=0&modestbranding=1'
                },
                { 
                  id: '4', 
                  title: 'Resolvers e DataLoaders', 
                  duration: 32, 
                  completed: false, 
                  locked: false, 
                  type: 'video', 
                  xp: 190,
                  content: 'Implemente resolvers eficientes e evite o problema N+1 com DataLoaders.',
                  order: 4,
                  videoUrl: 'https://www.youtube.com/embed/LD9lxYGNxGY?rel=0&modestbranding=1'
                },
                { 
                  id: '5', 
                  title: 'Subscriptions em Tempo Real', 
                  duration: 28, 
                  completed: false, 
                  locked: false, 
                  type: 'video', 
                  xp: 170,
                  content: 'Crie aplicações em tempo real usando GraphQL Subscriptions.',
                  order: 5,
                  videoUrl: 'https://www.youtube.com/embed/R-kbtpMHiMo?rel=0&modestbranding=1'
                }
              ]
            },
            {
              id: 'nextjs-fullstack',
              title: 'Next.js - React Full-Stack',
              description: 'Construa aplicações web completas com Next.js, SSR e SSG.',
              instructor: 'Sofia Next',
              totalLessons: 42,
              completedLessons: 0,
              totalXP: 2400,
              earnedXP: 0,
              progress: 0,
              difficulty: 'épico',
              thumbnail: '⚡',
              category: 'Full-Stack',
              rating: 4.9,
              students: 1300,
              duration: '55h',
              published: true,
              createdAt: '2024-01-24',
              updatedAt: '2024-01-24',
              modules: [],
              lessons: [
                { 
                  id: '1', 
                  title: 'Next.js 14: Introdução', 
                  duration: 22, 
                  completed: false, 
                  locked: false, 
                  type: 'video', 
                  xp: 160,
                  content: 'Conheça o Next.js 14 e suas novas funcionalidades: App Router, Server Components.',
                  order: 1,
                  videoUrl: 'https://www.youtube.com/embed/wm5gMKuwSYk?rel=0&modestbranding=1'
                },
                { 
                  id: '2', 
                  title: 'Pages e Routing Avançado', 
                  duration: 28, 
                  completed: false, 
                  locked: false, 
                  type: 'video', 
                  xp: 180,
                  content: 'Sistema de roteamento dinâmico, nested routes e layouts compartilhados.',
                  order: 2,
                  videoUrl: 'https://www.youtube.com/embed/ZjAqacIC_3c?rel=0&modestbranding=1'
                },
                { 
                  id: '3', 
                  title: 'Server Side Rendering (SSR)', 
                  duration: 32, 
                  completed: false, 
                  locked: false, 
                  type: 'video', 
                  xp: 200,
                  content: 'Renderização no servidor para melhor SEO e performance inicial.',
                  order: 3,
                  videoUrl: 'https://www.youtube.com/embed/f1rF9YKm1Ms?rel=0&modestbranding=1'
                },
                { 
                  id: '4', 
                  title: 'Static Site Generation (SSG)', 
                  duration: 30, 
                  completed: false, 
                  locked: false, 
                  type: 'video', 
                  xp: 190,
                  content: 'Gere sites estáticos super rápidos com getStaticProps e getStaticPaths.',
                  order: 4,
                  videoUrl: 'https://www.youtube.com/embed/pY0vWYLDDco?rel=0&modestbranding=1'
                },
                { 
                  id: '5', 
                  title: 'API Routes e Full-Stack', 
                  duration: 35, 
                  completed: false, 
                  locked: false, 
                  type: 'video', 
                  xp: 210,
                  content: 'Crie APIs completas dentro do Next.js usando API Routes.',
                  order: 5,
                  videoUrl: 'https://www.youtube.com/embed/tt3PUvhOVzo?rel=0&modestbranding=1'
                }
              ]
            },
            {
              id: 'spring-boot-java',
              title: 'Spring Boot - Java Enterprise',
              description: 'Desenvolva aplicações empresariais robustas com Spring Boot.',
              instructor: 'Eduardo Spring',
              totalLessons: 52,
              completedLessons: 0,
              totalXP: 2900,
              earnedXP: 0,
              progress: 0,
              difficulty: 'épico',
              thumbnail: '🍃',
              category: 'Backend',
              rating: 4.7,
              students: 950,
              duration: '65h',
              published: true,
              createdAt: '2024-01-25',
              updatedAt: '2024-01-25',
              modules: [],
              lessons: [
                { 
                  id: '1', 
                  title: 'Introdução ao Spring Boot', 
                  duration: 25, 
                  completed: false, 
                  locked: false, 
                  type: 'video', 
                  xp: 170,
                  content: 'Entenda o ecossistema Spring e as vantagens do Spring Boot para Java.',
                  order: 1,
                  videoUrl: 'https://www.youtube.com/embed/vtPkZShrvXQ?rel=0&modestbranding=1'
                },
                { 
                  id: '2', 
                  title: 'Criando Primeiro Projeto', 
                  duration: 30, 
                  completed: false, 
                  locked: false, 
                  type: 'video', 
                  xp: 180,
                  content: 'Configure seu primeiro projeto Spring Boot usando Spring Initializr.',
                  order: 2,
                  videoUrl: 'https://www.youtube.com/embed/9SGDpanrc8U?rel=0&modestbranding=1'
                },
                { 
                  id: '3', 
                  title: 'Controllers e REST APIs', 
                  duration: 35, 
                  completed: false, 
                  locked: false, 
                  type: 'video', 
                  xp: 200,
                  content: 'Crie APIs REST robustas usando @RestController e validações.',
                  order: 3,
                  videoUrl: 'https://www.youtube.com/embed/8SGI_XS5OPw?rel=0&modestbranding=1'
                },
                { 
                  id: '4', 
                  title: 'JPA e Banco de Dados', 
                  duration: 40, 
                  completed: false, 
                  locked: false, 
                  type: 'video', 
                  xp: 220,
                  content: 'Integre com bancos de dados usando Spring Data JPA e Hibernate.',
                  order: 4,
                  videoUrl: 'https://www.youtube.com/embed/8ueiZf988qY?rel=0&modestbranding=1'
                },
                { 
                  id: '5', 
                  title: 'Security e Autenticação', 
                  duration: 38, 
                  completed: false, 
                  locked: false, 
                  type: 'video', 
                  xp: 210,
                  content: 'Implemente segurança robusta com Spring Security e JWT.',
                  order: 5,
                  videoUrl: 'https://www.youtube.com/embed/her_7pa0vrg?rel=0&modestbranding=1'
                }
              ]
            },
            {
              id: 'svelte-modern-ui',
              title: 'Svelte - UI Reativa Moderna',
              description: 'Crie interfaces de usuário rápidas e reativas com Svelte.',
              instructor: 'Clara Svelte',
              totalLessons: 28,
              completedLessons: 0,
              totalXP: 1600,
              earnedXP: 0,
              progress: 0,
              difficulty: 'raro',
              thumbnail: '🔥',
              category: 'Frontend',
              rating: 4.8,
              students: 420,
              duration: '35h',
              published: true,
              createdAt: '2024-01-26',
              updatedAt: '2024-01-26',
              modules: [],
              lessons: [
                { 
                  id: '1', 
                  title: 'Por que Svelte? Introdução', 
                  duration: 20, 
                  completed: false, 
                  locked: false, 
                  type: 'video', 
                  xp: 140,
                  content: 'Descubra por que Svelte está revolucionando o desenvolvimento frontend.',
                  order: 1,
                  videoUrl: 'https://www.youtube.com/embed/rv3Yq-B8qp4?rel=0&modestbranding=1'
                },
                { 
                  id: '2', 
                  title: 'Primeiro Componente Svelte', 
                  duration: 25, 
                  completed: false, 
                  locked: false, 
                  type: 'video', 
                  xp: 160,
                  content: 'Crie seu primeiro componente e entenda a sintaxe do Svelte.',
                  order: 2,
                  videoUrl: 'https://www.youtube.com/embed/UGBJHYpHPvA?rel=0&modestbranding=1'
                },
                { 
                  id: '3', 
                  title: 'Reatividade e State', 
                  duration: 30, 
                  completed: false, 
                  locked: false, 
                  type: 'video', 
                  xp: 180,
                  content: 'Domine a reatividade nativa do Svelte e gerenciamento de estado.',
                  order: 3,
                  videoUrl: 'https://www.youtube.com/embed/AdNJ3fydeao?rel=0&modestbranding=1'
                },
                { 
                  id: '4', 
                  title: 'Stores e Context API', 
                  duration: 28, 
                  completed: false, 
                  locked: false, 
                  type: 'video', 
                  xp: 170,
                  content: 'Compartilhe estado entre componentes usando Stores.',
                  order: 4,
                  videoUrl: 'https://www.youtube.com/embed/1Df-9EKvZr0?rel=0&modestbranding=1'
                },
                { 
                  id: '5', 
                  title: 'SvelteKit para Apps Completas', 
                  duration: 32, 
                  completed: false, 
                  locked: false, 
                  type: 'video', 
                  xp: 190,
                  content: 'Construa aplicações full-stack usando SvelteKit.',
                  order: 5,
                  videoUrl: 'https://www.youtube.com/embed/9OlLxkEjSxI?rel=0&modestbranding=1'
                }
              ]
            }
          ]
          
          setCourses(expandedMockCourses)
          console.log('✅ Total de cursos carregados (mock expandido):', expandedMockCourses.length)
        }
      } catch (error) {
        console.error('❌ Erro geral ao carregar cursos:', error)
        // Em último caso, usar cursos originais
        setCourses(loadFromStorage('saber_courses', mockCourses))
      } finally {
        setCoursesLoading(false)
      }
    }

    loadCourses()
  }, [])

  // Funções auxiliares para mapeamento
  const mapDifficulty = (difficulty: string): 'comum' | 'raro' | 'épico' | 'lendário' => {
    switch(difficulty?.toLowerCase()) {
      case 'iniciante': return 'comum'
      case 'intermediário': return 'raro'  
      case 'avançado': return 'épico'
      default: return 'comum'
    }
  }

  const getCategoryEmoji = (category: string): string => {
    switch(category?.toLowerCase()) {
      case 'desenvolvimento web': return '🌐'
      case 'mobile': return '📱'
      case 'backend': return '⚙️'
      case 'inteligência artificial': return '🤖'
      case 'data science': return '📊'
      case 'devops': return '🐳'
      case 'blockchain': return '⛓️'
      case 'game development': return '🎮'
      case 'segurança': return '🔒'
      case 'sistemas': return '💻'
      default: return '📚'
    }
  }

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
      coursesLoading,
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
