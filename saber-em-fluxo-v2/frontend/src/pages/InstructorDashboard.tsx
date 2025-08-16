import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  PlusIcon, 
  BookOpenIcon, 
  UsersIcon, 
  PlayIcon,
  FireIcon,
  TrophyIcon,
  BoltIcon,
  SparklesIcon,
  PaintBrushIcon,
  WrenchScrewdriverIcon,
  RocketLaunchIcon,
  StarIcon,
  EyeIcon
} from '@heroicons/react/24/outline'

interface Course {
  id: string
  title: string
  description: string
  students: number
  lessons: number
  created: string
  status: 'draft' | 'published' | 'featured'
  views: number
  rating: number
  earnings: number
  thumbnail: string
  difficulty: 'comum' | 'raro' | 'épico' | 'lendário'
}

const InstructorDashboard: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([
    {
      id: '1',
      title: 'JavaScript Quest: Dominando a Força',
      description: 'Curso épico de JavaScript com 12 desafios progressivos',
      students: 1234,
      lessons: 12,
      created: '2024-01-15',
      status: 'published',
      views: 5600,
      rating: 4.9,
      earnings: 2450.50,
      thumbnail: '⚛️',
      difficulty: 'épico'
    },
    {
      id: '2',
      title: 'Node.js Warrior: APIs Lendárias',
      description: 'Construa APIs invencíveis como um verdadeiro guerreiro',
      students: 856,
      lessons: 8,
      created: '2024-01-20',
      status: 'published',
      views: 3200,
      rating: 4.8,
      earnings: 1820.30,
      thumbnail: '🚀',
      difficulty: 'lendário'
    },
    {
      id: '3',
      title: 'CSS Magic: Alquimia Visual',
      description: 'Transforme designs em realidade com poderes CSS místicos',
      students: 445,
      lessons: 6,
      created: '2024-02-01',
      status: 'draft',
      views: 120,
      rating: 0,
      earnings: 0,
      thumbnail: '🎨',
      difficulty: 'raro'
    }
  ])

  const [showCreateForm, setShowCreateForm] = useState(false)
  const [newCourse, setNewCourse] = useState({
    title: '',
    description: '',
    difficulty: 'comum' as Course['difficulty']
  })

  const handleCreateCourse = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!newCourse.title.trim() || !newCourse.description.trim()) {
      return
    }

    const course: Course = {
      id: Math.random().toString(36).substr(2, 9),
      title: newCourse.title,
      description: newCourse.description,
      students: 0,
      lessons: 0,
      created: new Date().toISOString().split('T')[0],
      status: 'draft',
      views: 0,
      rating: 0,
      earnings: 0,
      thumbnail: '📚',
      difficulty: newCourse.difficulty
    }

    setCourses(prev => [course, ...prev])
    setNewCourse({ title: '', description: '', difficulty: 'comum' })
    setShowCreateForm(false)
  }

  const getDifficultyStyle = (difficulty: string) => {
    switch(difficulty) {
      case 'comum':
        return { bg: 'from-gray-500 to-gray-600', text: 'text-gray-100', border: 'border-gray-400' }
      case 'raro':
        return { bg: 'from-blue-500 to-cyan-500', text: 'text-blue-100', border: 'border-blue-400' }
      case 'épico':
        return { bg: 'from-purple-500 to-pink-500', text: 'text-purple-100', border: 'border-purple-400' }
      case 'lendário':
        return { bg: 'from-yellow-500 to-orange-500', text: 'text-yellow-100', border: 'border-yellow-400' }
      default:
        return { bg: 'from-gray-500 to-gray-600', text: 'text-gray-100', border: 'border-gray-400' }
    }
  }

  const totalStudents = courses.reduce((sum, course) => sum + course.students, 0)
  const totalEarnings = courses.reduce((sum, course) => sum + course.earnings, 0)
  const totalLessons = courses.reduce((sum, course) => sum + course.lessons, 0)

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-yellow-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-500"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-4 pb-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-12"
        >
          <div>
            <h1 className="text-5xl font-black bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600 bg-clip-text text-transparent mb-2">
              🎨 ESTÚDIO DE CRIAÇÃO 🎨
            </h1>
            <p className="text-xl text-purple-200 font-bold">Forje suas legendas educacionais!</p>
          </div>
          
          <motion.button
            whileHover={{ scale: 1.1, rotate: 5 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowCreateForm(true)}
            className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-8 py-4 rounded-xl font-black text-lg shadow-2xl border-4 border-green-300 hover:shadow-green-500/50 transition-all"
          >
            <div className="flex items-center gap-3">
              <PlusIcon className="w-6 h-6" />
              CRIAR NOVA QUEST
            </div>
          </motion.button>
        </motion.div>

        {/* Creator Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl p-6 border-4 border-orange-300 shadow-2xl"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-black text-white">{courses.length}</p>
                <p className="text-orange-100 font-bold">Quests Criadas</p>
              </div>
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                <BookOpenIcon className="w-8 h-8 text-white" />
              </div>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl p-6 border-4 border-blue-300 shadow-2xl"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-black text-white">{totalStudents}</p>
                <p className="text-blue-100 font-bold">Heróis Treinados</p>
              </div>
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                <UsersIcon className="w-8 h-8 text-white" />
              </div>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="bg-gradient-to-br from-green-500 to-teal-500 rounded-2xl p-6 border-4 border-green-300 shadow-2xl"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-black text-white">{totalLessons}</p>
                <p className="text-green-100 font-bold">Desafios</p>
              </div>
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                <PlayIcon className="w-8 h-8 text-white" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="bg-gradient-to-br from-yellow-500 to-orange-500 rounded-2xl p-6 border-4 border-yellow-300 shadow-2xl"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-black text-white">R$ {totalEarnings.toFixed(2)}</p>
                <p className="text-yellow-100 font-bold">Tesouro</p>
              </div>
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                <TrophyIcon className="w-8 h-8 text-white" />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Course Creation Form Modal */}
        {showCreateForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-gradient-to-br from-slate-900 to-purple-900 rounded-2xl p-8 max-w-md w-full border-4 border-purple-400 shadow-2xl"
            >
              <h2 className="text-3xl font-black text-white mb-6 text-center bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                ⚔️ FORJAR NOVA QUEST ⚔️
              </h2>
              
              <form onSubmit={handleCreateCourse}>
                <div className="mb-4">
                  <label className="block text-lg font-bold text-purple-200 mb-2">
                    Nome da Quest
                  </label>
                  <input
                    type="text"
                    value={newCourse.title}
                    onChange={(e) => setNewCourse(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full bg-slate-800 border-2 border-purple-400 rounded-lg px-4 py-3 text-white font-bold placeholder-purple-300 focus:outline-none focus:border-yellow-400 transition-colors"
                    placeholder="Ex: Python Dragon Slayer"
                    required
                  />
                </div>
                
                <div className="mb-4">
                  <label className="block text-lg font-bold text-purple-200 mb-2">
                    Lore da Aventura
                  </label>
                  <textarea
                    value={newCourse.description}
                    onChange={(e) => setNewCourse(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full bg-slate-800 border-2 border-purple-400 rounded-lg px-4 py-3 text-white font-bold placeholder-purple-300 focus:outline-none focus:border-yellow-400 transition-colors resize-none"
                    rows={3}
                    placeholder="Descreva a jornada épica que os heróis irão percorrer..."
                    required
                  />
                </div>

                <div className="mb-6">
                  <label className="block text-lg font-bold text-purple-200 mb-2">
                    Raridade da Quest
                  </label>
                  <select
                    value={newCourse.difficulty}
                    onChange={(e) => setNewCourse(prev => ({ ...prev, difficulty: e.target.value as Course['difficulty'] }))}
                    className="w-full bg-slate-800 border-2 border-purple-400 rounded-lg px-4 py-3 text-white font-bold focus:outline-none focus:border-yellow-400 transition-colors"
                  >
                    <option value="comum">🔸 COMUM</option>
                    <option value="raro">💎 RARO</option>
                    <option value="épico">🌟 ÉPICO</option>
                    <option value="lendário">👑 LENDÁRIO</option>
                  </select>
                </div>
                
                <div className="flex gap-3">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white py-3 px-6 rounded-lg font-black text-lg border-2 border-green-300 shadow-lg"
                  >
                    ⚔️ FORJAR
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="button"
                    onClick={() => {
                      setShowCreateForm(false)
                      setNewCourse({ title: '', description: '', difficulty: 'comum' })
                    }}
                    className="flex-1 bg-gradient-to-r from-red-500 to-pink-500 text-white py-3 px-6 rounded-lg font-black text-lg border-2 border-red-300 shadow-lg"
                  >
                    ❌ CANCELAR
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}

        {/* Courses Workshop */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white/5 backdrop-blur-lg rounded-2xl border-2 border-white/20 p-8"
        >
          <h2 className="text-3xl font-black text-white mb-8 flex items-center gap-3">
            <WrenchScrewdriverIcon className="w-8 h-8 text-yellow-400" />
            OFICINA DE QUESTS
          </h2>

          <div className="space-y-6">
            {courses.map((course, index) => {
              const difficulty = getDifficultyStyle(course.difficulty)
              
              return (
                <motion.div
                  key={course.id}
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index }}
                  whileHover={{ scale: 1.02, x: 10 }}
                  className="relative"
                >
                  <div className={`bg-gradient-to-r ${difficulty.bg} p-1 rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-500`}>
                    <div className="bg-slate-900/90 backdrop-blur-sm rounded-2xl p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-6 flex-1">
                          {/* Course Avatar */}
                          <div className="text-6xl">{course.thumbnail}</div>
                          
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="text-2xl font-black text-white">
                                {course.title}
                              </h3>
                              <span className={`px-3 py-1 text-xs font-black rounded-full uppercase ${difficulty.text} bg-white/20 ${difficulty.border} border-2`}>
                                {course.difficulty}
                              </span>
                              <span className={`px-2 py-1 text-xs font-black rounded-full uppercase ${
                                course.status === 'published' 
                                  ? 'bg-green-500 text-white' 
                                  : course.status === 'featured'
                                  ? 'bg-yellow-500 text-black'
                                  : 'bg-gray-500 text-white'
                              }`}>
                                {course.status === 'published' ? '🟢 ATIVO' : 
                                 course.status === 'featured' ? '⭐ DESTAQUE' : '🔸 RASCUNHO'}
                              </span>
                            </div>
                            
                            <p className="text-purple-200 mb-4 leading-relaxed">
                              {course.description}
                            </p>
                            
                            {/* Stats Grid */}
                            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                              <div className="flex items-center gap-2 bg-blue-500/20 px-3 py-2 rounded-lg">
                                <UsersIcon className="w-4 h-4 text-blue-400" />
                                <span className="text-blue-200 font-bold">{course.students}</span>
                              </div>
                              <div className="flex items-center gap-2 bg-purple-500/20 px-3 py-2 rounded-lg">
                                <PlayIcon className="w-4 h-4 text-purple-400" />
                                <span className="text-purple-200 font-bold">{course.lessons} lições</span>
                              </div>
                              <div className="flex items-center gap-2 bg-green-500/20 px-3 py-2 rounded-lg">
                                <EyeIcon className="w-4 h-4 text-green-400" />
                                <span className="text-green-200 font-bold">{course.views}</span>
                              </div>
                              {course.rating > 0 && (
                                <div className="flex items-center gap-2 bg-yellow-500/20 px-3 py-2 rounded-lg">
                                  <StarIcon className="w-4 h-4 text-yellow-400 fill-current" />
                                  <span className="text-yellow-200 font-bold">{course.rating}</span>
                                </div>
                              )}
                              {course.earnings > 0 && (
                                <div className="flex items-center gap-2 bg-orange-500/20 px-3 py-2 rounded-lg">
                                  <TrophyIcon className="w-4 h-4 text-orange-400" />
                                  <span className="text-orange-200 font-bold">R$ {course.earnings.toFixed(2)}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="ml-6 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-xl font-black shadow-lg hover:shadow-purple-500/50 transition-all"
                        >
                          <div className="flex items-center gap-2">
                            <PaintBrushIcon className="w-5 h-5" />
                            EDITAR
                          </div>
                        </motion.button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>

          {courses.length === 0 && (
            <div className="text-center py-16">
              <div className="text-8xl mb-6">🎨</div>
              <h3 className="text-2xl font-black text-white mb-4">Sua Oficina Está Vazia!</h3>
              <p className="text-purple-200 mb-8 text-lg">Que tal criar sua primeira quest lendária?</p>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowCreateForm(true)}
                className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-8 py-4 rounded-xl font-black text-lg shadow-2xl border-4 border-green-300"
              >
                <div className="flex items-center gap-3">
                  <RocketLaunchIcon className="w-6 h-6" />
                  COMEÇAR JORNADA
                </div>
              </motion.button>
            </div>
          )}
        </motion.div>

        {/* Success Toast */}
        <motion.div
          initial={{ opacity: 0, x: 300 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 3 }}
          className="fixed bottom-8 right-8 bg-gradient-to-r from-purple-600 to-pink-600 text-white p-4 rounded-xl shadow-2xl border-2 border-purple-400"
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
              <SparklesIcon className="w-6 h-6 text-yellow-300" />
            </div>
            <div>
              <p className="font-bold">Novo Poder Desbloqueado!</p>
              <p className="text-sm opacity-90">🎯 Mestre Criador de Conteúdo</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default InstructorDashboard
