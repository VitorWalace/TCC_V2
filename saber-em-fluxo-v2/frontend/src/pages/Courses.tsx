import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
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
  UserGroupIcon,
  ShieldCheckIcon,
  BeakerIcon,
  CommandLineIcon,
  CpuChipIcon,
  GlobeAltIcon,
  EyeIcon,
  HeartIcon,
  ChevronUpIcon,
  ChevronDownIcon,
  LockClosedIcon,
  MapIcon,
  SwordIcon
} from '@heroicons/react/24/outline'

const Courses: React.FC = () => {
  const [filter, setFilter] = useState('all')
  const [showStatsPanel, setShowStatsPanel] = useState(false)
  const [hoveredCourse, setHoveredCourse] = useState<string | null>(null)
  const [particlesVisible, setParticlesVisible] = useState(false)
  const { courses, coursesLoading, userProgress, enrollInCourse, getUserCourses, getAvailableCourses } = useGame()

  useEffect(() => {
    // Particles animation on mount
    setTimeout(() => setParticlesVisible(true), 1000)
  }, [])

  // Loading state
  if (coursesLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-2xl text-purple-200 font-bold">Carregando cursos incríveis... 🚀</p>
        </div>
      </div>
    )
  }

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
        {/* Epic Hero Header */}
        <motion.div className="text-center mb-16 relative">
          {/* Background Power Effect */}
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.3 }}
            transition={{ duration: 2 }}
            className="absolute inset-0 bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 rounded-full blur-3xl"
          />
          
          {/* Floating Particles */}
          <AnimatePresence>
            {particlesVisible && [...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 0 }}
                animate={{ 
                  opacity: [0, 1, 0],
                  y: -100,
                  x: Math.sin(i) * 50
                }}
                transition={{
                  duration: 3,
                  delay: i * 0.2,
                  repeat: Infinity,
                  repeatDelay: 2
                }}
                className="absolute w-2 h-2 bg-yellow-400 rounded-full"
                style={{
                  left: `${20 + (i * 3)}%`,
                  top: `${50 + Math.sin(i) * 20}%`
                }}
              />
            ))}
          </AnimatePresence>

          {/* Main Title with Epic Animation */}
          <motion.h1
            initial={{ opacity: 0, y: -50, scale: 0.5 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 1, type: "spring", bounce: 0.4 }}
            className="text-6xl md:text-8xl font-black mb-6 relative z-10"
          >
            <span className="bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500 bg-clip-text text-transparent animate-pulse">
              ⚔️ ACADEMIA ⚔️
            </span>
            <br />
            <motion.span
              animate={{ 
                backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"]
              }}
              transition={{ duration: 3, repeat: Infinity }}
              className="bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent bg-[length:200%_200%]"
            >
              DOS LEGENDS
            </motion.span>
          </motion.h1>

          {/* Epic Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="text-xl md:text-2xl text-purple-200 mb-8 font-bold max-w-4xl mx-auto leading-relaxed"
          >
            <span className="text-yellow-400">🌟 DESPERTE SEU PODER INTERIOR! 🌟</span>
            <br />
            Cada curso é uma QUEST épica que transformará você num MESTRE da tecnologia!
          </motion.p>
          
          {/* Gaming Stats Dashboard */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="relative"
          >
            {/* Toggleable Stats Panel */}
            <motion.button
              onClick={() => setShowStatsPanel(!showStatsPanel)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="mb-4 bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-3 rounded-full border-2 border-cyan-400 text-white font-bold flex items-center gap-2 mx-auto shadow-lg shadow-purple-500/50"
            >
              <TrophyIcon className="w-5 h-5" />
              PAINEL DE PODER
              {showStatsPanel ? <ChevronUpIcon className="w-4 h-4" /> : <ChevronDownIcon className="w-4 h-4" />}
            </motion.button>

            <AnimatePresence>
              {showStatsPanel && (
                <motion.div
                  initial={{ opacity: 0, height: 0, y: -20 }}
                  animate={{ opacity: 1, height: "auto", y: 0 }}
                  exit={{ opacity: 0, height: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                  className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8 overflow-hidden"
                >
                  {/* Level Card */}
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    className="bg-gradient-to-br from-red-500 to-pink-600 p-4 rounded-2xl border-4 border-yellow-400 shadow-2xl shadow-red-500/50"
                  >
                    <div className="text-center">
                      <FireIcon className="w-8 h-8 text-white mx-auto mb-2" />
                      <div className="text-white font-black text-2xl">NÍVEL 12</div>
                      <div className="text-yellow-200 text-sm">WARRIOR</div>
                    </div>
                  </motion.div>

                  {/* XP Card */}
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: -5 }}
                    className="bg-gradient-to-br from-yellow-500 to-orange-600 p-4 rounded-2xl border-4 border-yellow-300 shadow-2xl shadow-yellow-500/50"
                  >
                    <div className="text-center">
                      <BoltIcon className="w-8 h-8 text-white mx-auto mb-2" />
                      <div className="text-white font-black text-2xl">15,840</div>
                      <div className="text-yellow-200 text-sm">XP TOTAL</div>
                    </div>
                  </motion.div>

                  {/* Badges Card */}
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    className="bg-gradient-to-br from-purple-500 to-indigo-600 p-4 rounded-2xl border-4 border-purple-300 shadow-2xl shadow-purple-500/50"
                  >
                    <div className="text-center">
                      <SparklesIcon className="w-8 h-8 text-white mx-auto mb-2" />
                      <div className="text-white font-black text-2xl">28</div>
                      <div className="text-purple-200 text-sm">CONQUISTAS</div>
                    </div>
                  </motion.div>

                  {/* Streak Card */}
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: -5 }}
                    className="bg-gradient-to-br from-green-500 to-emerald-600 p-4 rounded-2xl border-4 border-green-300 shadow-2xl shadow-green-500/50"
                  >
                    <div className="text-center">
                      <ShieldCheckIcon className="w-8 h-8 text-white mx-auto mb-2" />
                      <div className="text-white font-black text-2xl">7</div>
                      <div className="text-green-200 text-sm">DIAS STREAK</div>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
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

        {/* Epic Courses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCourses.map((course, index) => {
            const difficulty = getDifficultyBadge(course.difficulty)
            
            return (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 50, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: index * 0.1, type: "spring", bounce: 0.4 }}
                whileHover={{ 
                  y: -15,
                  scale: 1.05,
                  rotateY: 8,
                  rotateX: 5
                }}
                onHoverStart={() => setHoveredCourse(course.id)}
                onHoverEnd={() => setHoveredCourse(null)}
                className="group perspective-1000 relative"
              >
                {/* Epic Card Background Effects */}
                <motion.div
                  className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 opacity-75 blur-sm"
                  animate={{
                    rotate: hoveredCourse === course.id ? 360 : 0,
                  }}
                  transition={{ duration: 2, ease: "linear" }}
                />
                
                {/* Lightning Effect on Hover */}
                <AnimatePresence>
                  {hoveredCourse === course.id && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-0 bg-gradient-to-r from-yellow-400/30 via-orange-500/30 to-red-500/30 rounded-3xl animate-pulse"
                    />
                  )}
                </AnimatePresence>

                <Link to={`/courses/${course.id}`}>
                  <div className={`relative overflow-hidden rounded-3xl bg-gradient-to-br ${getCourseColor(course.difficulty)} p-1 shadow-2xl ${difficulty.glow} transition-all duration-500 transform-gpu`}>
                    
                    <div className="bg-slate-900/95 backdrop-blur-sm rounded-3xl p-8 relative z-10 h-full border border-white/10">
                      {/* Epic Difficulty Badge */}
                      <div className="absolute -top-4 -right-4 z-20">
                        <motion.div
                          animate={{ 
                            rotate: hoveredCourse === course.id ? [0, -10, 10, 0] : 0,
                            scale: hoveredCourse === course.id ? [1, 1.2, 1] : 1
                          }}
                          transition={{ duration: 0.5 }}
                          className={`${difficulty.bg} px-4 py-2 rounded-full border-4 border-white shadow-2xl relative overflow-hidden`}
                        >
                          <div className="absolute inset-0 bg-white/20 animate-pulse rounded-full" />
                          <span className="text-white font-black text-sm relative z-10">
                            ⭐ {difficulty.text}
                          </span>
                        </motion.div>
                      </div>

                      {/* Course Emoji Avatar with Power Effect */}
                      <motion.div
                        whileHover={{ scale: 1.3, rotate: 360 }}
                        transition={{ duration: 0.6, type: "spring" }}
                        className="text-8xl mb-6 text-center relative"
                      >
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                          className="absolute inset-0 bg-gradient-to-r from-purple-500/30 to-pink-500/30 rounded-full blur-xl"
                        />
                        <span className="relative z-10">
                          {course.thumbnail}
                        </span>
                      </motion.div>

                      {/* Epic Title with Glow */}
                      <h3 className="font-black text-2xl text-center mb-4 relative">
                        <span className="bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent group-hover:from-yellow-300 group-hover:via-orange-300 group-hover:to-red-300 transition-all duration-500">
                          {course.title}
                        </span>
                        {hoveredCourse === course.id && (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="absolute inset-0 bg-gradient-to-r from-yellow-300/50 via-orange-300/50 to-red-300/50 bg-clip-text text-transparent blur-sm"
                          />
                        )}
                      </h3>

                      {/* Description */}
                      <p className="text-purple-200 text-sm mb-6 leading-relaxed text-center">
                        {course.description}
                      </p>

                      {/* Epic Progress Bar */}
                      {course.progress > 0 && (
                        <div className="mb-6">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-purple-300 font-bold text-xs">⚡ PROGRESSO DA QUEST</span>
                            <span className="text-yellow-400 font-black text-lg">{course.progress}%</span>
                          </div>
                          <div className="w-full bg-slate-800 rounded-full h-4 overflow-hidden border border-purple-500/30">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${course.progress}%` }}
                              transition={{ duration: 2, ease: "easeOut", delay: index * 0.1 }}
                              className="bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 h-full rounded-full flex items-center justify-end pr-2 relative overflow-hidden"
                            >
                              <motion.div
                                animate={{ x: [0, 100, 0] }}
                                transition={{ duration: 2, repeat: Infinity }}
                                className="absolute inset-0 bg-white/20 w-8 skew-x-12"
                              />
                              <SparklesIcon className="w-3 h-3 text-white relative z-10" />
                            </motion.div>
                          </div>
                        </div>
                      )}

                      {/* Stats Grid */}
                      <div className="grid grid-cols-3 gap-4 mb-6 text-xs">
                        <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 p-2 rounded-xl border border-yellow-500/30 text-center">
                          <ClockIcon className="w-4 h-4 text-yellow-400 mx-auto mb-1" />
                          <span className="text-yellow-300 font-bold block">{course.duration}</span>
                        </div>
                        <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 p-2 rounded-xl border border-purple-500/30 text-center">
                          <StarIcon className="w-4 h-4 text-purple-400 mx-auto mb-1 fill-current" />
                          <span className="text-purple-300 font-bold block">{course.rating}</span>
                        </div>
                        <div className="bg-gradient-to-r from-blue-500/20 to-cyan-500/20 p-2 rounded-xl border border-blue-500/30 text-center">
                          <AcademicCapIcon className="w-4 h-4 text-blue-400 mx-auto mb-1" />
                          <span className="text-blue-300 font-bold block">{course.students}</span>
                        </div>
                      </div>

                      {/* Gaming Stats Row */}
                      <div className="flex justify-between items-center mb-8 gap-2">
                        <div className="flex items-center gap-1 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 px-3 py-2 rounded-full border border-yellow-500/30">
                          <BoltIcon className="w-4 h-4 text-yellow-400" />
                          <span className="text-yellow-300 font-bold text-xs">{course.earnedXP}/{course.totalXP} XP</span>
                        </div>
                        <div className="flex items-center gap-1 bg-gradient-to-r from-purple-500/20 to-pink-500/20 px-3 py-2 rounded-full border border-purple-500/30">
                          <TrophyIcon className="w-4 h-4 text-purple-400" />
                          <span className="text-purple-300 font-bold text-xs">{userProgress.badges.length} 🏆</span>
                        </div>
                        {userProgress.streak > 0 && (
                          <div className="flex items-center gap-1 bg-gradient-to-r from-red-500/20 to-orange-500/20 px-3 py-2 rounded-full border border-red-500/30">
                            <FireIcon className="w-4 h-4 text-red-400" />
                            <span className="text-red-300 font-bold text-xs">{userProgress.streak}🔥</span>
                          </div>
                        )}
                      </div>

                      {/* Epic CTA Button */}
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="w-full relative overflow-hidden"
                        onClick={(e) => {
                          e.preventDefault()
                          if (!userProgress.currentCourses.includes(course.id)) {
                            enrollInCourse(course.id)
                          }
                        }}
                      >
                        <div className={`w-full bg-gradient-to-r ${getCourseColor(course.difficulty)} p-4 rounded-2xl text-center font-black text-white text-lg shadow-2xl border-4 border-white/20 relative overflow-hidden group`}>
                          {/* Button Animation Effect */}
                          <motion.div
                            animate={{ x: [-100, 100] }}
                            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                            className="absolute inset-0 bg-white/20 w-16 skew-x-12 opacity-0 group-hover:opacity-100"
                          />
                          
                          <div className="flex items-center justify-center gap-3 relative z-10">
                            {userProgress.currentCourses.includes(course.id) ? (
                              <>
                                <RocketLaunchIcon className="w-6 h-6" />
                                <span>⚡ CONTINUAR QUEST ⚡</span>
                              </>
                            ) : (
                              <>
                                <PlayIcon className="w-6 h-6" />
                                <span>🚀 INICIAR AVENTURA 🚀</span>
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

        {/* Epic Achievement Notification */}
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, x: 400, scale: 0.5 }}
            animate={{ 
              opacity: 1, 
              x: 0, 
              scale: 1,
              rotate: [0, -2, 2, 0]
            }}
            transition={{ 
              delay: 3,
              duration: 0.8,
              type: "spring",
              bounce: 0.4
            }}
            className="fixed bottom-8 right-8 z-50"
          >
            {/* Glow Effect */}
            <div className="absolute -inset-2 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-3xl opacity-75 blur-lg animate-pulse" />
            
            <div className="relative bg-gradient-to-br from-yellow-500 via-orange-500 to-red-600 p-1 rounded-3xl shadow-2xl border-4 border-yellow-300">
              <div className="bg-slate-900/95 backdrop-blur-sm rounded-3xl p-6 border border-yellow-400/30">
                <div className="flex items-center gap-4">
                  {/* Animated Trophy */}
                  <motion.div
                    animate={{ 
                      rotate: [0, 10, -10, 0],
                      scale: [1, 1.2, 1]
                    }}
                    transition={{ 
                      duration: 2, 
                      repeat: Infinity,
                      repeatDelay: 1
                    }}
                    className="relative"
                  >
                    <div className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center border-4 border-white shadow-xl">
                      <TrophyIcon className="w-8 h-8 text-white" />
                    </div>
                    
                    {/* Sparkles around trophy */}
                    {[...Array(6)].map((_, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0 }}
                        animate={{ 
                          opacity: [0, 1, 0],
                          scale: [0, 1, 0],
                          rotate: i * 60
                        }}
                        transition={{ 
                          duration: 1.5,
                          repeat: Infinity,
                          delay: i * 0.2,
                          repeatDelay: 2
                        }}
                        className="absolute w-2 h-2 bg-yellow-300 rounded-full"
                        style={{
                          top: '50%',
                          left: '50%',
                          transform: `translate(-50%, -50%) translateY(-25px) rotate(${i * 60}deg)`
                        }}
                      />
                    ))}
                  </motion.div>

                  <div>
                    <motion.p 
                      className="text-yellow-300 font-black text-lg mb-1"
                      animate={{ opacity: [1, 0.7, 1] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      🎉 CONQUISTA ÉPICA! 🎉
                    </motion.p>
                    <p className="text-white font-bold text-sm mb-1">
                      ⚡ EXPLORADOR SUPREMO ⚡
                    </p>
                    <p className="text-yellow-200 text-xs opacity-90">
                      Você descobriu a Academia dos Legends!
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <BoltIcon className="w-4 h-4 text-yellow-400" />
                      <span className="text-yellow-300 font-bold text-xs">+500 XP</span>
                      <SparklesIcon className="w-4 h-4 text-purple-400" />
                      <span className="text-purple-300 font-bold text-xs">Nova Badge</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}

export default Courses
