import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useGame } from '../contexts/GameContext'
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
  AcademicCapIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline'

const Courses: React.FC = () => {
  const [filter, setFilter] = useState('all')
  const { courses, userProgress, enrollInCourse, getUserCourses, getAvailableCourses } = useGame()

  const userCourses = getUserCourses()
  const availableCourses = getAvailableCourses()

  const filteredCourses = filter === 'all' ? courses :
    filter === 'enrolled' ? userCourses :
    filter === 'available' ? availableCourses :
    courses.filter(course => course.difficulty === filter)

  const categories = ["all", "enrolled", "available", "comum", "raro", "épico", "lendário"]
  
  const getDifficultyBadge = (difficulty: string) => {
    switch(difficulty) {
      case 'raro':
        return { bg: 'bg-gradient-to-r from-blue-500 to-cyan-500', text: 'RARO', glow: 'shadow-blue-500/50' }
      case 'épico':
        return { bg: 'bg-gradient-to-r from-purple-500 to-pink-500', text: 'ÉPICO', glow: 'shadow-purple-500/50' }
      case 'lendário':
        return { bg: 'bg-gradient-to-r from-yellow-500 to-orange-500', text: 'LENDÁRIO', glow: 'shadow-yellow-500/50' }
      default:
        return { bg: 'bg-gradient-to-r from-gray-500 to-gray-600', text: 'COMUM', glow: 'shadow-gray-500/50' }
    }
  }

  const getCourseColor = (difficulty: string) => {
    switch(difficulty) {
      case 'raro':
        return 'from-blue-600 to-cyan-600'
      case 'épico':
        return 'from-purple-600 to-pink-600'
      case 'lendário':
        return 'from-yellow-500 to-orange-600'
      default:
        return 'from-gray-600 to-gray-700'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute bottom-1/4 left-3/4 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-500"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-6 pb-12">
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
          {categories.map((category, index) => (
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
                  <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${getCourseColor(course.difficulty)} p-1 shadow-2xl ${difficulty.glow} shadow-2xl hover:shadow-3xl transition-all duration-500`}>
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
                        {course.thumbnail}
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
                          <span className="text-yellow-300 font-bold text-xs">{course.earnedXP}/{course.totalXP} XP</span>
                        </div>
                        <div className="flex items-center gap-1 bg-purple-500/20 px-2 py-1 rounded-full">
                          <TrophyIcon className="w-4 h-4 text-purple-400" />
                          <span className="text-purple-300 font-bold text-xs">{userProgress.badges.length} Badges</span>
                        </div>
                        {userProgress.streak > 0 && (
                          <div className="flex items-center gap-1 bg-orange-500/20 px-2 py-1 rounded-full">
                            <FireIcon className="w-4 h-4 text-orange-400" />
                            <span className="text-orange-300 font-bold text-xs">{userProgress.streak}🔥</span>
                          </div>
                        )}
                      </div>

                      {/* CTA Button */}
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="w-full"
                        onClick={(e) => {
                          e.preventDefault()
                          if (!userProgress.currentCourses.includes(course.id)) {
                            enrollInCourse(course.id)
                          }
                        }}
                      >
                        <div className={`w-full bg-gradient-to-r ${getCourseColor(course.difficulty)} p-3 rounded-xl text-center font-black text-white text-lg shadow-lg group-hover:shadow-xl transition-all duration-300 border-2 border-white/20`}>
                          <div className="flex items-center justify-center gap-2">
                            {userProgress.currentCourses.includes(course.id) ? (
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
