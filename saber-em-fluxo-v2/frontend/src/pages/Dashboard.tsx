import React, { useMemo } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import {
  ChartBarIcon,
  BookOpenIcon,
  ChatBubbleBottomCenterTextIcon,
  AcademicCapIcon,
  FireIcon,
  TrophyIcon,
  ClockIcon,
  UserGroupIcon,
  ArrowRightIcon,
  PlayIcon
} from '@heroicons/react/24/outline'
import { useAuthStore } from '../stores/authStore'
import { useGame } from '../contexts/GameContext'

const Dashboard: React.FC = () => {
  const { user } = useAuthStore()
  const { courses, userProgress } = useGame()
  const navigate = useNavigate()

  // Cálculos baseados em dados reais
  const dashboardData = useMemo(() => {
    // Cursos do usuário
    const userCourses = courses.filter(c => userProgress.currentCourses.includes(c.id))
    const completedCourses = courses.filter(c => userProgress.completedCourses.includes(c.id))
    
    // Calcular tempo total de estudo estimado
    const totalStudyTime = userCourses.reduce((total, course) => {
      const completedLessons = course.lessons.filter(l => l.completed).length
      return total + (completedLessons * 25) // 25 min média por lição
    }, 0)
    
    // Próxima lição recomendada
    const nextLesson = (() => {
      for (const course of userCourses) {
        const incompleteLesson = course.lessons.find(l => !l.completed && !l.locked)
        if (incompleteLesson) {
          return { course, lesson: incompleteLesson }
        }
      }
      return null
    })()
    
    // Progresso XP para próximo nível
    const xpProgress = (userProgress.totalXP / userProgress.nextLevelXP) * 100
    
    // XP ganhos hoje (simulado baseado no último progresso)
    const todayXP = Math.min(200, Math.floor(userProgress.totalXP * 0.1))
    
    return {
      completedCoursesCount: completedCourses.length,
      totalStudyHours: Math.floor(totalStudyTime / 60),
      currentStreak: userProgress.streak,
      userLevel: userProgress.level,
      totalXP: userProgress.totalXP,
      nextLevelXP: userProgress.nextLevelXP,
      xpProgress,
      todayXP,
      userCourses,
      completedCourses,
      nextLesson,
      badges: userProgress.badges
    }
  }, [courses, userProgress])

  // Handlers para ações
  const handleContinueStudying = () => {
    if (dashboardData.nextLesson) {
      navigate(`/course/${dashboardData.nextLesson.course.id}/lesson/${dashboardData.nextLesson.lesson.id}`)
    } else if (dashboardData.userCourses.length > 0) {
      navigate(`/course/${dashboardData.userCourses[0].id}`)
    } else {
      navigate('/courses')
    }
  }

  const handleViewProgress = () => {
    navigate('/courses')
  }

  const handleOpenChat = () => {
    navigate('/chat')
  }

  // Stats baseados em dados reais
  const stats = [
    {
      name: 'Cursos Concluídos',
      value: dashboardData.completedCoursesCount.toString(),
      icon: AcademicCapIcon,
      color: 'bg-green-500',
      change: dashboardData.completedCoursesCount > 0 ? `${dashboardData.completedCoursesCount} completo${dashboardData.completedCoursesCount > 1 ? 's' : ''}` : 'Comece seu primeiro',
      emoji: '🎓'
    },
    {
      name: 'Horas de Estudo',
      value: `${dashboardData.totalStudyHours}h`,
      icon: ClockIcon,
      color: 'bg-blue-500',
      change: `+${Math.floor(dashboardData.todayXP / 10)}h esta semana`,
      emoji: '⏱️'
    },
    {
      name: 'Streak Atual',
      value: `${dashboardData.currentStreak} dias`,
      icon: FireIcon,
      color: 'bg-orange-500',
      change: dashboardData.currentStreak > 5 ? 'Você está em fogo!' : 'Continue assim!',
      emoji: '🔥'
    },
    {
      name: 'Nível Atual',
      value: dashboardData.userLevel.toString(),
      icon: TrophyIcon,
      color: 'bg-purple-500',
      change: `${dashboardData.totalXP}/${dashboardData.nextLevelXP} XP`,
      emoji: '🏆'
    },
  ]

  // Atividades recentes baseadas no progresso real
  const recentActivities = [
    ...dashboardData.completedCourses.slice(-2).map(course => ({
      type: 'course_completed',
      title: `Completou ${course.title}`,
      time: 'Recentemente',
      icon: '🎉',
    })),
    {
      type: 'xp_gained',
      title: `Ganhou ${dashboardData.todayXP} XP hoje`,
      time: 'Hoje',
      icon: '⭐',
    },
    {
      type: 'streak',
      title: `Manteve streak de ${dashboardData.currentStreak} dias`,
      time: 'Ontem',
      icon: '🔥',
    },
  ].slice(0, 4)

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
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-8 shadow-2xl">
            <motion.h1 
              className="text-5xl font-black mb-4 bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600 bg-clip-text text-transparent text-center"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              👋 Olá, {user?.firstName || 'Estudante'}!
            </motion.h1>
            <motion.p 
              className="text-purple-200 text-2xl mb-6 font-bold text-center"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              Nível {dashboardData.userLevel} • {dashboardData.totalXP} XP • Streak de {dashboardData.currentStreak} dias 🔥
            </motion.p>
            
            {/* Barra de progresso XP */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="bg-black/30 rounded-full h-6 mb-4 border-2 border-yellow-400/50 shadow-inner relative overflow-hidden"
            >
              <motion.div 
                className="h-full bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 rounded-full shadow-lg relative"
                initial={{ width: 0 }}
                animate={{ width: `${dashboardData.xpProgress}%` }}
                transition={{ delay: 1, duration: 1, ease: "easeOut" }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30 animate-pulse"></div>
              </motion.div>
            </motion.div>
            <p className="text-white text-lg font-bold text-center">
              {dashboardData.totalXP}/{dashboardData.nextLevelXP} XP para o próximo nível 
              {dashboardData.todayXP > 0 && (
                <span className="text-yellow-300 font-black bg-gradient-to-r from-orange-500 to-red-500 px-3 py-2 rounded-full ml-3 border-2 border-yellow-400">
                  +{dashboardData.todayXP} XP hoje ⚡
                </span>
              )}
            </p>
          </div>
        </motion.div>

        {/* Stats Grid - Estilo Gaming */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6 hover:transform hover:-translate-y-2 transition-all duration-300 hover:shadow-2xl hover:border-purple-400/50"
            >
              <div className="flex items-center">
                <div className={`p-4 rounded-xl ${stat.color} text-white mr-4 shadow-lg relative overflow-hidden`}>
                  <span className="text-3xl drop-shadow-sm relative z-10">{stat.emoji}</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-20 animate-pulse"></div>
                </div>
                <div className="flex-1">
                  <h3 className="text-3xl font-black text-white mb-1">{stat.value}</h3>
                  <p className="text-purple-200 text-base font-bold mb-1">{stat.name}</p>
                  <p className="text-green-400 text-sm font-bold bg-green-900/30 px-2 py-1 rounded-md inline-block border border-green-400/30">
                    {stat.change}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Continue Estudando - Seção destacada estilo gaming */}
        {dashboardData.nextLesson && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="mb-8"
          >
            <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 rounded-2xl p-8 text-white shadow-2xl border-4 border-yellow-400/50 relative overflow-hidden">
              {/* Efeitos de fundo gaming */}
              <div className="absolute inset-0 bg-black/20"></div>
              <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-400/10 rounded-full -mr-16 -mt-16"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-purple-400/20 rounded-full -ml-12 -mb-12"></div>
              
              <div className="relative z-10 flex items-center justify-between">
                <div className="flex-1">
                  <h2 className="text-4xl font-black mb-3 flex items-center bg-gradient-to-r from-yellow-300 to-orange-400 bg-clip-text text-transparent">
                    <BookOpenIcon className="w-12 h-12 mr-4 text-yellow-400 drop-shadow-lg" />
                    🚀 CONTINUE SUA QUEST! 🚀
                  </h2>
                  <p className="text-white text-xl mb-4 font-bold bg-black/30 px-4 py-2 rounded-xl inline-block border border-yellow-400/30">
                    {dashboardData.nextLesson.course.title} • Lição {dashboardData.nextLesson.lesson.order}
                  </p>
                  <h3 className="text-3xl font-bold mb-4 text-yellow-300 drop-shadow-lg">
                    {dashboardData.nextLesson.lesson.title}
                  </h3>
                  <div className="flex items-center text-white mb-6 text-xl font-bold">
                    <ClockIcon className="w-6 h-6 mr-3 text-blue-300" />
                    <span className="bg-blue-900/50 px-3 py-1 rounded-lg mr-4 border border-blue-400/30">
                      {dashboardData.nextLesson.lesson.duration} min
                    </span>
                    <span className="bg-gradient-to-r from-yellow-500 to-orange-500 text-black px-4 py-2 rounded-lg font-black border-2 border-yellow-300">
                      💎 {dashboardData.nextLesson.lesson.xp} XP
                    </span>
                  </div>
                  <button
                    onClick={handleContinueStudying}
                    className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-400 hover:to-blue-400 text-white px-10 py-4 rounded-2xl font-black text-xl flex items-center transition-all duration-200 transform hover:scale-110 shadow-2xl border-4 border-white/30"
                  >
                    <PlayIcon className="w-8 h-8 mr-4" />
                    ⚡ JOGAR AGORA ⚡
                    <ArrowRightIcon className="w-8 h-8 ml-4" />
                  </button>
                </div>
                <div className="ml-8 text-9xl drop-shadow-2xl animate-bounce">
                  {dashboardData.nextLesson.lesson.type === 'quiz' ? '🎯' : 
                   dashboardData.nextLesson.lesson.type === 'video' ? '📹' :
                   dashboardData.nextLesson.lesson.type === 'challenge' ? '⚡' : '📖'}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Cursos em Andamento */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.6 }}
            className="lg:col-span-2"
          >
            <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-8 shadow-2xl">
              <h2 className="text-3xl font-black text-white mb-8 flex items-center">
                <span className="mr-4 text-5xl">🎮</span>
                SEUS JOGOS ATIVOS
              </h2>
              
              {dashboardData.userCourses.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {dashboardData.userCourses.map((course, index) => (
                    <motion.div
                      key={course.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 1 + index * 0.1, duration: 0.4 }}
                      onClick={() => navigate(`/course/${course.id}`)}
                      className="bg-gradient-to-br from-purple-900/80 to-pink-900/80 border-2 border-purple-400/50 rounded-2xl p-6 hover:shadow-2xl transition-all duration-200 cursor-pointer transform hover:scale-105 hover:border-yellow-400/70 backdrop-blur-sm"
                    >
                      <div className="flex items-center mb-4">
                        <div className="text-6xl mr-4 drop-shadow-lg animate-pulse">{course.thumbnail}</div>
                        <div className="flex-1">
                          <h3 className="font-black text-white text-xl leading-tight mb-2">
                            {course.title}
                          </h3>
                          <p className="text-purple-200 text-sm font-bold">
                            🎓 {course.instructor}
                          </p>
                        </div>
                      </div>
                      
                      <div className="mb-4">
                        <div className="flex justify-between text-base text-white mb-2 font-bold">
                          <span>⚡ PROGRESSO</span>
                          <span className="text-yellow-300">{course.progress}%</span>
                        </div>
                        <div className="w-full bg-black/40 rounded-full h-4 shadow-inner border border-purple-400/30">
                          <motion.div
                            className="bg-gradient-to-r from-green-400 via-blue-500 to-purple-500 h-4 rounded-full shadow-lg relative overflow-hidden"
                            initial={{ width: 0 }}
                            animate={{ width: `${course.progress}%` }}
                            transition={{ delay: 1.5 + index * 0.1, duration: 0.8 }}
                          >
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30 animate-pulse"></div>
                          </motion.div>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center bg-black/30 rounded-xl p-3 border border-purple-400/20">
                        <div className="text-center">
                          <div className="text-lg font-black text-green-400">
                            {course.completedLessons}/{course.totalLessons}
                          </div>
                          <div className="text-xs text-purple-200 font-bold">FASES</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-black text-yellow-400">
                            {course.earnedXP}/{course.totalXP}
                          </div>
                          <div className="text-xs text-purple-200 font-bold">PONTOS</div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="text-8xl mb-6 animate-bounce">🎮</div>
                  <p className="text-purple-200 mb-6 text-xl font-bold">
                    Nenhum jogo ativo ainda!
                  </p>
                  <button
                    onClick={() => navigate('/courses')}
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white px-10 py-4 rounded-2xl font-black text-xl transition-all duration-200 transform hover:scale-105 shadow-2xl border-2 border-yellow-400/50"
                  >
                    🚀 EXPLORAR ARCADE 🚀
                  </button>
                </div>
              )}
            </div>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="lg:col-span-1"
          >
            <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-8 shadow-2xl">
              <h2 className="text-3xl font-black text-white mb-6 flex items-center">
                <span className="mr-4 text-4xl">⚡</span>
                COMANDOS RÁPIDOS
              </h2>
              <div className="space-y-4">
                <button 
                  onClick={handleContinueStudying}
                  className="w-full flex items-center justify-center space-x-3 py-4 px-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white rounded-2xl font-black text-lg transition-all duration-200 transform hover:scale-105 shadow-xl border-2 border-blue-400/50"
                >
                  <BookOpenIcon className="w-7 h-7" />
                  <span>🎮 CONTINUAR JOGO</span>
                </button>
                <button 
                  onClick={handleOpenChat}
                  className="w-full flex items-center justify-center space-x-3 py-4 px-6 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white rounded-2xl font-black text-lg transition-all duration-200 transform hover:scale-105 shadow-xl border-2 border-green-400/50"
                >
                  <ChatBubbleBottomCenterTextIcon className="w-7 h-7" />
                  <span>💬 CHAT ASSIST</span>
                </button>
                <button 
                  onClick={handleViewProgress}
                  className="w-full flex items-center justify-center space-x-3 py-4 px-6 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white rounded-2xl font-black text-lg transition-all duration-200 transform hover:scale-105 shadow-xl border-2 border-purple-400/50"
                >
                  <ChartBarIcon className="w-7 h-7" />
                  <span>📊 ESTATÍSTICAS</span>
                </button>
              </div>
              
              {/* Badges Section */}
              {dashboardData.badges.length > 0 && (
                <div className="mt-8 border-t pt-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                    <span className="mr-3 text-2xl">🏆</span>
                    Suas Conquistas
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    {dashboardData.badges.map((badge, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 1.2 + index * 0.1, duration: 0.3 }}
                        className="text-4xl bg-gradient-to-br from-yellow-100 to-yellow-200 rounded-2xl p-4 border-3 border-yellow-300 shadow-lg transform hover:scale-110 transition-all duration-200"
                        title="Conquista desbloqueada"
                      >
                        {badge}
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="lg:col-span-1"
          >
            <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-8 shadow-2xl">
              <h2 className="text-3xl font-black text-white mb-6 flex items-center">
                <span className="mr-4 text-4xl">�</span>
                FEED DE ATIVIDADE
              </h2>
              <div className="space-y-4">
                {recentActivities.map((activity, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.7 + index * 0.1, duration: 0.4 }}
                    className="flex items-center space-x-4 p-4 bg-gradient-to-r from-purple-900/50 to-pink-900/50 rounded-xl hover:from-purple-800/70 hover:to-pink-800/70 transition-all duration-200 border border-purple-400/30 backdrop-blur-sm"
                  >
                    <div className="text-5xl drop-shadow-lg animate-pulse">{activity.icon}</div>
                    <div className="flex-1">
                      <p className="font-black text-white text-lg leading-tight">{activity.title}</p>
                      <p className="text-purple-200 text-base font-bold">{activity.time}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

        {/* Dashboard de Conquistas */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.6 }}
          className="lg:col-span-1"
        >
            <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-8 shadow-2xl">
              <h2 className="text-3xl font-black text-white mb-6 flex items-center">
                <span className="mr-4 text-4xl">🎯</span>
                MISSÃO DO MÊS
              </h2>
              
              <div className="text-center mb-6">
                <div className="text-7xl mb-4 animate-bounce">🏆</div>
                <h3 className="font-black text-2xl text-yellow-300 mb-3">
                  Completar 5 Jogos
                </h3>
                <p className="text-lg text-purple-200 mb-4 font-bold">
                  Progress: {dashboardData.completedCoursesCount}/5 jogos
                </p>
                <div className="w-full bg-black/40 rounded-full h-5 mb-3 shadow-inner border border-yellow-400/50">
                  <motion.div
                    className="bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 h-5 rounded-full shadow-lg relative overflow-hidden"
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min((dashboardData.completedCoursesCount / 5) * 100, 100)}%` }}
                    transition={{ delay: 1.5, duration: 0.8 }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30 animate-pulse"></div>
                  </motion.div>
                </div>
                <p className="text-base text-white font-bold">
                  {Math.min((dashboardData.completedCoursesCount / 5) * 100, 100).toFixed(0)}% COMPLETO
                </p>
              </div>

              {/* Streak Atual */}
              <div className="border-t border-purple-400/30 pt-6">
                <h3 className="font-black text-white mb-3 flex items-center text-xl">
                  <span className="mr-3 text-3xl">🔥</span>
                  COMBO STREAK
                </h3>
                <div className="text-center bg-gradient-to-r from-orange-600/30 to-red-600/30 rounded-2xl p-6 border-2 border-orange-400/50">
                  <div className="text-5xl font-black text-orange-300 mb-2 animate-pulse">
                    {dashboardData.currentStreak}
                  </div>
                  <p className="text-lg text-white font-bold">
                    {dashboardData.currentStreak === 1 ? 'DIA EM SEQUÊNCIA' : 'DIAS EM SEQUÊNCIA'}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
