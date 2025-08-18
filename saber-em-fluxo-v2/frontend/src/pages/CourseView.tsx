import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useGame, Lesson } from '../contexts/GameContext'
import { 
  ArrowLeftIcon, 
  PlayIcon, 
  CheckIcon, 
  LockClosedIcon,
  FireIcon,
  TrophyIcon,
  StarIcon,
  SparklesIcon,
  BoltIcon
} from '@heroicons/react/24/outline'


const CourseView: React.FC = () => {
  const { courseId } = useParams()
  const navigate = useNavigate()
  const { getCourseById, userProgress, completLesson } = useGame()
  
  const course = getCourseById(courseId || '')
  
  if (!course) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-center">
          <h1 className="text-2xl font-bold mb-4">Curso não encontrado</h1>
          <button 
            onClick={() => navigate('/courses')}
            className="bg-purple-600 hover:bg-purple-700 px-6 py-2 rounded-lg"
          >
            Voltar aos Cursos
          </button>
        </div>
      </div>
    )
  }

  const progressPercentage = (course.completedLessons / course.totalLessons) * 100
  const xpPercentage = (userProgress.totalXP / userProgress.nextLevelXP) * 100

  const handleLessonComplete = (lessonId: string) => {
    completLesson(course.id, lessonId)
  }

  const getLessonIcon = (lesson: any) => {
    if (lesson.completed) {
      return <CheckIcon className="w-6 h-6 text-white" />
    }
    if (lesson.locked) {
      return <LockClosedIcon className="w-6 h-6 text-gray-400" />
    }
    if (lesson.type === 'boss') {
      return <span className="text-2xl">👹</span>
    }
    if (lesson.type === 'challenge') {
      return <BoltIcon className="w-6 h-6 text-yellow-400" />
    }
    return <PlayIcon className="w-6 h-6 text-blue-400" />
  }

  const getLessonBg = (lesson: any, index: number) => {
    if (lesson.completed) {
      return lesson.type === 'boss'
        ? 'bg-gradient-to-r from-purple-600 to-pink-600' 
        : 'bg-gradient-to-r from-green-500 to-emerald-500'
    }
    if (lesson.locked) {
      return 'bg-gray-300'
    }
    if (lesson.boss) {
      return 'bg-gradient-to-r from-red-500 to-orange-500'
    }
    
    const colors = [
      'bg-gradient-to-r from-blue-500 to-cyan-500',
      'bg-gradient-to-r from-purple-500 to-indigo-500',
      'bg-gradient-to-r from-pink-500 to-rose-500',
      'bg-gradient-to-r from-yellow-500 to-orange-500',
      'bg-gradient-to-r from-teal-500 to-green-500'
    ]
    return colors[index % colors.length]
  }

  const handleLessonClick = (lesson: Lesson) => {
    if (!lesson.locked) {
      // Navegar para a página da lição para visualizar o conteúdo
      navigate(`/courses/${course.id}/lessons/${lesson.id}`)
    } else {
      console.log(`Lição bloqueada: ${lesson.title}`)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-yellow-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-500"></div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 pt-4 pb-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div className="flex items-center gap-4">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => navigate('/courses')}
              className="p-3 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 text-white hover:bg-white/20 transition-all"
            >
              <ArrowLeftIcon className="w-6 h-6" />
            </motion.button>
            
            <div>
              <h1 className="text-3xl font-black text-white bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                {course.title}
              </h1>
              <p className="text-purple-200 font-medium">Por {course.instructor}</p>
            </div>
          </div>

          {/* Player Stats */}
          <div className="flex items-center gap-6">
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="text-center"
            >
              <div className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-red-500 px-4 py-2 rounded-full">
                <FireIcon className="w-5 h-5 text-white" />
                <span className="text-white font-bold">{userProgress.streak}</span>
              </div>
              <span className="text-xs text-purple-200 block mt-1">Sequência</span>
            </motion.div>

            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="text-center"
            >
              <div className="flex items-center gap-2 bg-gradient-to-r from-yellow-500 to-amber-500 px-4 py-2 rounded-full">
                <StarIcon className="w-5 h-5 text-white fill-current" />
                <span className="text-white font-bold">Nível {userProgress.level}</span>
              </div>
              <span className="text-xs text-purple-200 block mt-1">{userProgress.totalXP}/{userProgress.nextLevelXP} XP</span>
            </motion.div>
          </div>
        </motion.div>

        {/* Progress Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-8 mb-8"
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <TrophyIcon className="w-8 h-8 text-yellow-400" />
              Progresso da Quest
            </h2>
            <div className="flex gap-2">
              {userProgress.badges.map((badge, index) => (
                <motion.div
                  key={index}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.1 * index }}
                  className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-2xl shadow-lg"
                >
                  {badge}
                </motion.div>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-purple-200 font-medium">Missões Completadas</span>
              <span className="text-white font-bold">{course.completedLessons}/{course.totalLessons}</span>
            </div>
            <div className="w-full bg-purple-900/50 rounded-full h-4 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progressPercentage}%` }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                className="h-full bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 rounded-full flex items-center justify-end pr-2"
              >
                <SparklesIcon className="w-3 h-3 text-white" />
              </motion.div>
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-purple-200 font-medium">Experiência</span>
              <span className="text-white font-bold">{course.earnedXP} XP</span>
            </div>
            <div className="w-full bg-purple-900/50 rounded-full h-3 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${xpPercentage}%` }}
                transition={{ duration: 1.5, ease: "easeOut", delay: 0.5 }}
                className="h-full bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full"
              />
            </div>
          </div>
        </motion.div>

        {/* Game Board - Lessons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 p-8"
        >
          <h2 className="text-2xl font-bold text-white mb-8 flex items-center gap-2">
            <span className="text-3xl">🎮</span>
            Tabuleiro de Missões
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {course.lessons.map((lesson, index) => (
              <motion.div
                key={lesson.id}
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * index }}
                whileHover={{ scale: lesson.locked ? 1 : 1.02 }}
                whileTap={{ scale: lesson.locked ? 1 : 0.98 }}
                onClick={() => handleLessonClick(lesson)}
                className={`relative overflow-hidden rounded-xl cursor-pointer transition-all duration-300 ${
                  lesson.locked 
                    ? 'cursor-not-allowed' 
                    : 'hover:shadow-2xl hover:shadow-purple-500/25'
                }`}
              >
                <div className={`${getLessonBg(lesson, index)} p-6 relative`}>
                  {/* Boss Battle Effect */}
                  {lesson.type === 'boss' && !lesson.locked && (
                    <motion.div
                      animate={{ 
                        boxShadow: [
                          '0 0 20px rgba(255, 0, 0, 0.5)',
                          '0 0 40px rgba(255, 0, 0, 0.8)',
                          '0 0 20px rgba(255, 0, 0, 0.5)'
                        ]
                      }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="absolute inset-0 rounded-xl"
                    />
                  )}

                  <div className="flex items-center justify-between relative z-10">
                    <div className="flex items-center gap-4">
                      <div className={`w-14 h-14 rounded-full flex items-center justify-center ${
                        lesson.completed ? 'bg-white/20' : 'bg-black/20'
                      } backdrop-blur-sm border-2 border-white/30`}>
                        {getLessonIcon(lesson)}
                      </div>
                      
                      <div>
                        <h3 className={`text-lg font-bold ${
                          lesson.type === 'boss' ? 'text-yellow-300' : 'text-white'
                        }`}>
                          {lesson.type === 'boss' && '👑 '}{lesson.title}
                        </h3>
                        <p className="text-white/80 text-sm">
                          {lesson.duration} min • {lesson.xp} XP
                          {lesson.type === 'challenge' && ' • Desafio'}
                        </p>
                      </div>
                    </div>

                    {lesson.completed && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                        className="w-8 h-8 bg-white rounded-full flex items-center justify-center"
                      >
                        <CheckIcon className="w-5 h-5 text-green-600" />
                      </motion.div>
                    )}

                    {lesson.locked && (
                      <div className="w-8 h-8 bg-black/20 rounded-full flex items-center justify-center">
                        <LockClosedIcon className="w-5 h-5 text-gray-400" />
                      </div>
                    )}
                  </div>

                  {/* XP Gain Animation Area */}
                  {lesson.completed && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="absolute top-2 right-2 bg-yellow-400 text-black px-2 py-1 rounded-full text-xs font-bold"
                    >
                      +{lesson.xp} XP
                    </motion.div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Achievement Celebration */}
        {course.completedLessons > 5 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.5 }}
            className="fixed bottom-8 right-8 bg-gradient-to-r from-yellow-400 to-orange-500 text-black p-4 rounded-xl shadow-2xl"
          >
            <div className="flex items-center gap-2">
              <TrophyIcon className="w-6 h-6" />
              <span className="font-bold">Parabéns! Nível {userProgress.level} desbloqueado! 🎉</span>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default CourseView
