import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { 
  BookOpenIcon, 
  PlayIcon, 
  ClockIcon, 
  StarIcon,
  FireIcon,
  TrophyIcon,
  BoltIcon,
  SparklesIcon,
  RocketLaunchIcon,
  AcademicCapIcon
} from '@heroicons/react/24/outline'

const Courses: React.FC = () => {
  const [filter, setFilter] = useState('all')

  const courses = [
    {
      id: 1,
      title: "JavaScript Quest: Dominando a Força",
      description: "Torne-se um mestre JavaScript nesta jornada épica repleta de desafios e conquistas!",
      image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400",
      progress: 75,
      duration: "40h",
      rating: 4.9,
      students: 1234,
      category: "Frontend",
      level: "Intermediário",
      emoji: "⚛️",
      xp: 2400,
      badges: 8,
      streak: 12,
      difficulty: "epic",
      color: "from-blue-600 to-purple-600"
    },
    {
      id: 2,
      title: "Node.js Warrior: Servidor Supremo",
      description: "Construa APIs lendárias e torne-se o guardião dos servidores mais poderosos!",
      image: "https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=400",
      progress: 30,
      duration: "35h",
      rating: 4.8,
      students: 856,
      category: "Backend",
      level: "Avançado",
      emoji: "🚀",
      xp: 1800,
      badges: 5,
      streak: 0,
      difficulty: "legendary",
      color: "from-green-500 to-teal-600"
    },
    {
      id: 3,
      title: "TypeScript Ninja: Código Invencível",
      description: "Domine a arte ancestral do TypeScript e crie aplicações indestrutíveis!",
      image: "https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=400",
      progress: 0,
      duration: "25h",
      rating: 4.9,
      students: 692,
      category: "Programming",
      level: "Avançado",
      emoji: "📘",
      xp: 0,
      badges: 0,
      streak: 0,
      difficulty: "legendary",
      color: "from-indigo-500 to-purple-600"
    },
    {
      id: 4,
      title: "Design System Alchemist",
      description: "Transforme pixels em ouro! Crie interfaces mágicas que encantam usuários!",
      image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400",
      progress: 60,
      duration: "30h",
      rating: 4.7,
      students: 445,
      category: "Design",
      level: "Iniciante",
      emoji: "🎨",
      xp: 1200,
      badges: 6,
      streak: 5,
      difficulty: "rare",
      color: "from-pink-500 to-rose-600"
    },
    {
      id: 5,
      title: "React Native: Mobile Conqueror",
      description: "Conquiste todos os dispositivos! Torne-se o imperador do desenvolvimento mobile!",
      image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400",
      progress: 0,
      duration: "50h",
      rating: 4.8,
      students: 723,
      category: "Mobile",
      level: "Intermediário",
      emoji: "📱",
      xp: 0,
      badges: 0,
      streak: 0,
      difficulty: "epic",
      color: "from-cyan-500 to-blue-600"
    },
    {
      id: 6,
      title: "Python Data Wizard",
      description: "Desvende os segredos dos dados! Torne-se um feiticeiro da análise de dados!",
      image: "https://images.unsplash.com/photo-1526379879527-8559ecfcaec0?w=400",
      progress: 0,
      duration: "45h",
      rating: 4.9,
      students: 1567,
      category: "Data Science",
      level: "Intermediário",
      emoji: "🐍",
      xp: 0,
      badges: 0,
      streak: 0,
      difficulty: "legendary",
      color: "from-emerald-500 to-green-600"
    }
  ]

  const categories = ["all", "Frontend", "Backend", "Design", "Mobile", "Data Science", "Programming"]
  
  const getDifficultyBadge = (difficulty: string) => {
    switch(difficulty) {
      case 'rare':
        return { bg: 'bg-gradient-to-r from-blue-500 to-cyan-500', text: 'RARO', glow: 'shadow-blue-500/50' }
      case 'epic':
        return { bg: 'bg-gradient-to-r from-purple-500 to-pink-500', text: 'ÉPICO', glow: 'shadow-purple-500/50' }
      case 'legendary':
        return { bg: 'bg-gradient-to-r from-yellow-500 to-orange-500', text: 'LENDÁRIO', glow: 'shadow-yellow-500/50' }
      default:
        return { bg: 'bg-gradient-to-r from-gray-500 to-gray-600', text: 'COMUM', glow: 'shadow-gray-500/50' }
    }
  }

  const filteredCourses = courses.filter(course => 
    filter === 'all' || course.category === filter
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute bottom-1/4 left-3/4 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-500"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-12">
        {/* Hero Header */}
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <motion.h1 
            className="text-6xl font-black mb-6 bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600 bg-clip-text text-transparent"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 100 }}
          >
            🎮 ARCADE DE CURSOS 🎮
          </motion.h1>
          <motion.p 
            className="text-2xl text-purple-200 font-bold mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            Escolha sua aventura e torne-se uma LENDA!
          </motion.p>
          
          {/* Player Stats */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="flex justify-center gap-8 mb-12"
          >
            <div className="bg-gradient-to-r from-orange-500 to-red-500 px-6 py-3 rounded-full border-4 border-yellow-400">
              <div className="flex items-center gap-2">
                <FireIcon className="w-6 h-6 text-white" />
                <span className="text-white font-black text-xl">Nível 12</span>
              </div>
            </div>
            <div className="bg-gradient-to-r from-yellow-500 to-amber-500 px-6 py-3 rounded-full border-4 border-orange-400">
              <div className="flex items-center gap-2">
                <TrophyIcon className="w-6 h-6 text-white" />
                <span className="text-white font-black text-xl">15,840 XP</span>
              </div>
            </div>
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 px-6 py-3 rounded-full border-4 border-purple-300">
              <div className="flex items-center gap-2">
                <SparklesIcon className="w-6 h-6 text-white" />
                <span className="text-white font-black text-xl">28 Badges</span>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="flex flex-wrap justify-center gap-4 mb-12"
        >
          {categories.map((category) => (
            <motion.button
              key={category}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setFilter(category)}
              className={`px-6 py-3 rounded-full font-bold text-lg transition-all duration-300 border-2 ${
                filter === category
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white border-purple-400 shadow-lg shadow-purple-500/50'
                  : 'bg-white/10 backdrop-blur-sm text-purple-200 border-purple-400/50 hover:bg-white/20 hover:border-purple-400'
              }`}
            >
              {category === 'all' ? '🎯 TODOS' : `🎪 ${category.toUpperCase()}`}
            </motion.button>
          ))}
        </motion.div>

        {/* Courses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCourses.map((course, index) => {
            const difficulty = getDifficultyBadge(course.difficulty)
            
            return (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ 
                  y: -10,
                  scale: 1.02,
                  rotateY: 5
                }}
                className="group perspective-1000"
              >
                <Link to={`/courses/${course.id}`}>
                  <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${course.color} p-1 shadow-2xl ${difficulty.glow} shadow-2xl hover:shadow-3xl transition-all duration-500`}>
                    {/* Glowing border effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-pulse"></div>
                    
                    <div className="bg-slate-900/90 backdrop-blur-sm rounded-2xl p-6 relative z-10 h-full">
                      {/* Difficulty Badge */}
                      <div className="absolute -top-2 -right-2 z-20">
                        <motion.div
                          animate={{ rotate: [0, -5, 5, 0] }}
                          transition={{ duration: 2, repeat: Infinity }}
                          className={`${difficulty.bg} px-3 py-1 rounded-full border-2 border-white shadow-lg`}
                        >
                          <span className="text-white font-black text-xs">{difficulty.text}</span>
                        </motion.div>
                      </div>

                      {/* Course Emoji Avatar */}
                      <motion.div
                        whileHover={{ scale: 1.2, rotate: 360 }}
                        transition={{ duration: 0.5 }}
                        className="text-6xl mb-4 text-center"
                      >
                        {course.emoji}
                      </motion.div>

                      {/* Title */}
                      <h3 className="font-black text-xl text-white mb-3 text-center group-hover:text-yellow-300 transition-colors">
                        {course.title}
                      </h3>

                      {/* Description */}
                      <p className="text-purple-200 text-sm mb-4 leading-relaxed">
                        {course.description}
                      </p>

                      {/* Progress Bar */}
                      {course.progress > 0 && (
                        <div className="mb-4">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-purple-300 font-bold text-sm">PROGRESSO</span>
                            <span className="text-white font-black">{course.progress}%</span>
                          </div>
                          <div className="w-full bg-slate-700 rounded-full h-3 overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${course.progress}%` }}
                              transition={{ duration: 1.5, ease: "easeOut", delay: index * 0.1 }}
                              className="bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 h-full rounded-full flex items-center justify-end pr-1"
                            >
                              <SparklesIcon className="w-2 h-2 text-white" />
                            </motion.div>
                          </div>
                        </div>
                      )}

                      {/* Stats */}
                      <div className="flex justify-between items-center mb-4 text-sm">
                        <div className="flex items-center gap-1 text-yellow-400">
                          <ClockIcon className="w-4 h-4" />
                          <span className="font-bold">{course.duration}</span>
                        </div>
                        <div className="flex items-center gap-1 text-yellow-400">
                          <StarIcon className="w-4 h-4 fill-current" />
                          <span className="font-bold">{course.rating}</span>
                        </div>
                        <div className="flex items-center gap-1 text-purple-300">
                          <AcademicCapIcon className="w-4 h-4" />
                          <span className="font-bold">{course.students}</span>
                        </div>
                      </div>

                      {/* Game Stats */}
                      <div className="flex justify-between items-center mb-6">
                        <div className="flex items-center gap-1 bg-yellow-500/20 px-2 py-1 rounded-full">
                          <BoltIcon className="w-4 h-4 text-yellow-400" />
                          <span className="text-yellow-300 font-bold text-xs">{course.xp} XP</span>
                        </div>
                        <div className="flex items-center gap-1 bg-purple-500/20 px-2 py-1 rounded-full">
                          <TrophyIcon className="w-4 h-4 text-purple-400" />
                          <span className="text-purple-300 font-bold text-xs">{course.badges} Badges</span>
                        </div>
                        {course.streak > 0 && (
                          <div className="flex items-center gap-1 bg-orange-500/20 px-2 py-1 rounded-full">
                            <FireIcon className="w-4 h-4 text-orange-400" />
                            <span className="text-orange-300 font-bold text-xs">{course.streak}🔥</span>
                          </div>
                        )}
                      </div>

                      {/* CTA Button */}
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="w-full"
                      >
                        <div className={`w-full bg-gradient-to-r ${course.color} p-3 rounded-xl text-center font-black text-white text-lg shadow-lg group-hover:shadow-xl transition-all duration-300 border-2 border-white/20`}>
                          <div className="flex items-center justify-center gap-2">
                            {course.progress > 0 ? (
                              <>
                                <RocketLaunchIcon className="w-5 h-5" />
                                CONTINUAR QUEST
                              </>
                            ) : (
                              <>
                                <PlayIcon className="w-5 h-5" />
                                INICIAR AVENTURA
                              </>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            )
          })}
        </div>

        {/* Achievement Toast */}
        <motion.div
          initial={{ opacity: 0, x: 300 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 2 }}
          className="fixed bottom-8 right-8 bg-gradient-to-r from-green-500 to-emerald-600 text-white p-4 rounded-xl shadow-2xl border-2 border-green-400"
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
              <TrophyIcon className="w-6 h-6 text-yellow-300" />
            </div>
            <div>
              <p className="font-bold">Nova Conquista Desbloqueada!</p>
              <p className="text-sm opacity-90">🎯 Explorador de Cursos</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default Courses
