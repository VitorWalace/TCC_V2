import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useGame } from '../contexts/GameContext'
import { ArrowLeft, Play, FileText, CheckCircle, XCircle, Award, Clock, Star, BookOpen, Trophy, Users, Eye } from 'lucide-react'

const LessonView: React.FC = () => {
  const { courseId, lessonId } = useParams()
  const navigate = useNavigate()
  const { courses, completLesson, userProgress } = useGame()
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)
  const [quizCompleted, setQuizCompleted] = useState(false)
  
  const course = courses.find(c => c.id === courseId)
  const lesson = course?.lessons.find(l => l.id === lessonId)
  
  useEffect(() => {
    if (!course || !lesson) {
      navigate('/courses')
    }
  }, [course, lesson, navigate])

  if (!course || !lesson) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Lição não encontrada</h2>
          <button 
            onClick={() => navigate('/courses')}
            className="btn-primary"
          >
            Voltar aos Cursos
          </button>
        </div>
      </div>
    )
  }

  const handleCompleteLesson = () => {
    if (lesson.type === 'video' && lesson.id) {
      completLesson(course.id, lesson.id)
    }
  }

  const handleAnswerSelect = (answerIndex: number) => {
    if (showResult || quizCompleted) return
    setSelectedAnswer(answerIndex)
  }

  const handleSubmitAnswer = () => {
    if (selectedAnswer === null) return
    
    const question = lesson.quiz?.questions[0]
    if (question) {
      const correct = selectedAnswer === question.correctAnswer
      setIsCorrect(correct)
      setShowResult(true)
      
      if (correct) {
        setQuizCompleted(true)
        setTimeout(() => {
          completLesson(course.id, lesson.id)
        }, 2000)
      }
    }
  }

  const renderLessonContent = () => {
    switch (lesson.type) {
      case 'video':
        return (
          <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative">
            {/* Epic Background Effects */}
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiM5OTMzZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDE0SDUwQzUwIDI0IDQyIDM2IDMwIDM2UzEwIDI0IDEwIDE0aDM2ek0xNCA0NmgzNmMwIDEwLTggMjItMjAgMjJzLTIwLTEyLTIwLTIyeiIvPjwvZz48L2c+PC9zdmc+')]" />
            
            {/* Epic Gaming Header */}
            <div className="sticky top-0 z-50 bg-gradient-to-r from-slate-900/95 via-purple-900/95 to-slate-900/95 backdrop-blur-xl border-b-2 border-purple-500/30 shadow-2xl">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <div className="flex items-center justify-between">
                  {/* Epic Back Button */}
                  <motion.button
                    onClick={() => navigate(`/courses/${courseId}`)}
                    className="group flex items-center bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold px-6 py-3 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl border-2 border-white/20"
                    whileHover={{ x: -8, scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <ArrowLeft className="w-6 h-6 mr-3 group-hover:animate-bounce" />
                    <span className="text-lg">⚔️ VOLTAR AO CURSO</span>
                  </motion.button>
                  
                  {/* Epic Stats Bar */}
                  <div className="flex items-center space-x-6">
                    <motion.div 
                      whileHover={{ scale: 1.1 }}
                      className="flex items-center bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-2 rounded-full border-2 border-yellow-400 shadow-lg"
                    >
                      <Clock className="w-5 h-5 mr-2" />
                      <span className="font-black text-lg">{lesson.duration} min</span>
                    </motion.div>
                    <motion.div 
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      className="flex items-center bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-4 py-2 rounded-full border-2 border-yellow-300 shadow-lg"
                    >
                      <Trophy className="w-5 h-5 mr-2" />
                      <span className="font-black text-lg">{lesson.xp} XP</span>
                    </motion.div>
                  </div>
                </div>
              </div>
            </div>

            <div className="min-h-screen">
              <div className="max-w-full mx-auto px-2 sm:px-3 py-3">
                <div className="grid grid-cols-1 xl:grid-cols-4 gap-3">
                  
                  {/* Epic Main Content Column */}
                  <div className="xl:col-span-3 space-y-4">
                  
                  {/* Epic Video Player */}
                  <motion.div
                    initial={{ opacity: 0, y: 30, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.8, type: "spring", bounce: 0.3 }}
                    className="group relative"
                  >
                    {/* Epic Glowing Border */}
                    <div className="absolute -inset-2 bg-gradient-to-r from-purple-500 via-pink-500 via-blue-500 to-purple-500 rounded-3xl opacity-75 blur-lg group-hover:opacity-100 transition duration-500 animate-gradient-x" />
                    
                    <div className="relative aspect-video bg-gradient-to-br from-slate-900 to-purple-900 rounded-3xl overflow-hidden border-4 border-purple-500/30 shadow-2xl">
                      
                      <div className="relative aspect-video bg-black rounded-3xl overflow-hidden">
                        {lesson.videoUrl ? (
                          <iframe
                            src={lesson.videoUrl}
                            className="absolute inset-0 w-full h-full"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            title={lesson.title}
                          />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-slate-800 to-purple-800">
                            <div className="text-center text-white">
                              <motion.div
                                animate={{ scale: [1, 1.2, 1], rotate: [0, 360] }}
                                transition={{ duration: 2, repeat: Infinity }}
                              >
                                <Play className="w-20 h-20 mx-auto mb-6 text-purple-400" />
                              </motion.div>
                              <p className="text-2xl font-bold text-purple-200">🚀 Carregando Conteúdo Épico...</p>
                            </div>
                          </div>
                        )}
                      </div>
                      
                      {/* Epic Corner Badge */}
                      <div className="absolute top-4 right-4 z-20">
                        <motion.div
                          animate={{ rotate: [0, 5, -5, 0] }}
                          transition={{ duration: 3, repeat: Infinity }}
                          className="bg-gradient-to-r from-yellow-400 to-orange-500 text-slate-900 px-4 py-2 rounded-full font-black text-sm shadow-xl border-2 border-white"
                        >
                          <span className="text-white font-black text-sm">⚡ QUEST ATIVA</span>
                        </motion.div>
                      </div>
                    </div>
                  </motion.div>

                  {/* Epic Lesson Info Card */}
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="relative overflow-hidden"
                  >
                    {/* Epic background glow */}
                    <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 rounded-3xl opacity-75 blur-sm" />
                    
                    <div className="relative bg-gradient-to-br from-slate-900/95 to-blue-900/95 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-cyan-500/30">
                      {/* Epic Title Section */}
                      <div className="flex items-start justify-between mb-8">
                        <div className="flex-1">
                          <motion.h1 
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 }}
                            className="text-4xl lg:text-5xl font-black mb-6 leading-tight"
                          >
                            <span className="bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 bg-clip-text text-transparent">
                              ⚡ {lesson.title} ⚡
                            </span>
                          </motion.h1>
                          
                          {/* Epic Meta Info */}
                          <div className="flex flex-wrap items-center gap-6 text-purple-200">
                            <motion.div 
                              whileHover={{ scale: 1.1 }}
                              className="flex items-center bg-blue-500/20 px-4 py-2 rounded-full border border-blue-500/30"
                            >
                              <BookOpen className="w-5 h-5 mr-2" />
                              <span className="font-bold">{course.title}</span>
                            </motion.div>
                            <motion.div 
                              whileHover={{ scale: 1.1 }}
                              className="flex items-center bg-green-500/20 px-4 py-2 rounded-full border border-green-500/30"
                            >
                              <Users className="w-5 h-5 mr-2" />
                              <span className="font-bold">{course.instructor}</span>
                            </motion.div>
                            <motion.div 
                              whileHover={{ scale: 1.1 }}
                              className="flex items-center bg-purple-500/20 px-4 py-2 rounded-full border border-purple-500/30"
                            >
                              <Eye className="w-5 h-5 mr-2" />
                              <span className="font-bold">{course.students} guerreiros</span>
                            </motion.div>
                          </div>
                        </div>
                        
                        {/* Epic Rating Section */}
                        <div className="flex items-center space-x-2 ml-4">
                          <div className="flex items-center space-x-1">
                            {[...Array(5)].map((_, i) => (
                              <motion.div
                                key={i}
                                initial={{ opacity: 0, scale: 0 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.5 + i * 0.1 }}
                              >
                                <Star 
                                  className={`w-6 h-6 ${i < Math.floor(course.rating) ? 'text-yellow-400 fill-current' : 'text-gray-600'}`} 
                                />
                              </motion.div>
                            ))}
                            <span className="text-lg text-yellow-400 ml-2 font-bold">{course.rating}</span>
                          </div>
                        </div>
                      </div>

                      {/* Epic Description Section */}
                      <div className="prose prose-lg max-w-none">
                        <motion.div 
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.4 }}
                          className="text-purple-200 leading-relaxed mb-8 text-lg"
                        >
                          {lesson.description}
                        </motion.div>
                        
                        {/* Epic Content Section */}
                        <motion.div 
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.5 }}
                          className="bg-gradient-to-r from-purple-800/30 to-blue-800/30 rounded-2xl p-6 border border-purple-500/30"
                        >
                          <h3 className="text-2xl font-black text-cyan-300 mb-4 flex items-center">
                            <span className="text-3xl mr-3">📚</span>
                            CONHECIMENTO ÉPICO
                          </h3>
                          <p className="text-purple-100 leading-relaxed text-lg">{lesson.content}</p>
                        </motion.div>
                      </div>
                    </div>
                  </motion.div>
                </div>

                {/* Epic Sidebar */}
                <div className="xl:col-span-1 space-y-3">
                  
                  {/* Epic Progress Card */}
                  <motion.div
                    initial={{ opacity: 0, x: 20, scale: 0.9 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    transition={{ duration: 0.6, delay: 0.4, type: "spring", bounce: 0.4 }}
                    className="relative overflow-hidden"
                  >
                    {/* Epic border glow */}
                    <div className="absolute -inset-1 bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500 rounded-3xl opacity-75 blur-sm" />
                    
                    <div className="relative bg-gradient-to-br from-slate-900/95 to-purple-900/95 backdrop-blur-sm rounded-3xl p-4 shadow-2xl border border-purple-500/30">
                      {/* Epic Header */}
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-black text-lg text-transparent bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 bg-clip-text flex items-center">
                          <Trophy className="w-6 h-6 mr-2 text-yellow-400 animate-bounce" />
                          SEU PROGRESSO
                        </h3>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                          className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center border-2 border-white shadow-lg"
                        >
                          <span className="text-white font-black text-sm">⚡</span>
                        </motion.div>
                      </div>

                      {/* Epic Progress Stats */}
                      <div className="space-y-3">
                        <div className="grid grid-cols-2 gap-3">
                          <motion.div 
                            whileHover={{ scale: 1.05 }}
                            className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 rounded-xl p-3 text-center"
                          >
                            <div className="text-2xl font-black text-blue-300">
                              {userProgress.level}
                            </div>
                            <div className="text-xs text-blue-200 font-bold">Nível</div>
                          </motion.div>
                          
                          <motion.div 
                            whileHover={{ scale: 1.05 }}
                            className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-xl p-3 text-center"
                          >
                            <div className="text-2xl font-black text-green-300">
                              {userProgress.totalXP}
                            </div>
                            <div className="text-xs text-green-200 font-bold">Total XP</div>
                          </motion.div>
                        </div>
                      </div>

                      {/* Epic Progress Bar */}
                      <div className="mt-4">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-bold text-purple-300">⚡ PRÓXIMO NÍVEL</span>
                          <span className="text-sm font-bold text-yellow-400">{userProgress.totalXP}/{userProgress.nextLevelXP}</span>
                        </div>
                        <div className="relative h-4 bg-slate-800 rounded-full overflow-hidden border-2 border-purple-500/30">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${(userProgress.totalXP / userProgress.nextLevelXP) * 100}%` }}
                            transition={{ duration: 2, delay: 0.8 }}
                            className="h-full bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 relative"
                          >
                            <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent animate-pulse" />
                          </motion.div>
                        </div>
                      </div>
                    </div>
                  </motion.div>

                  {/* Epic Action Card */}
                  <motion.div
                    initial={{ opacity: 0, x: 20, scale: 0.9 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    transition={{ duration: 0.6, delay: 0.6, type: "spring", bounce: 0.4 }}
                    className="relative overflow-hidden"
                  >
                    {/* Epic border glow */}
                    <div className="absolute -inset-1 bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 rounded-2xl opacity-75 blur-sm animate-pulse" />
                    
                    <motion.div
                      animate={{ 
                        boxShadow: [
                          "0 0 20px rgba(34, 197, 94, 0.3)",
                          "0 0 40px rgba(34, 197, 94, 0.6)",
                          "0 0 20px rgba(34, 197, 94, 0.3)"
                        ]
                      }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="bg-gradient-to-br from-slate-900/95 to-purple-900/95 backdrop-blur-sm rounded-2xl p-4 shadow-xl border-3 border-yellow-400/50"
                    >
                      {!lesson.completed ? (
                        <motion.button
                          onClick={handleCompleteLesson}
                          className="w-full relative overflow-hidden bg-gradient-to-r from-green-500 via-emerald-500 to-green-600 hover:from-green-400 hover:via-emerald-400 hover:to-green-500 text-white font-black py-3 px-4 rounded-xl transition-all duration-300 flex items-center justify-center shadow-xl border-3 border-white/20 text-sm"
                          whileHover={{ scale: 1.05, y: -2 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          {/* Button animation effect */}
                          <motion.div
                            animate={{ x: [-100, 100] }}
                            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                            className="absolute inset-0 bg-white/20 w-16 skew-x-12 opacity-0 group-hover:opacity-100"
                          />
                          
                          <div className="flex items-center relative z-10">
                            <CheckCircle className="w-6 h-6 mr-2" />
                            <span>⚡ COMPLETAR QUEST ⚡</span>
                          </div>
                        </motion.button>
                      ) : (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: "spring", bounce: 0.6 }}
                          className="w-full bg-gradient-to-r from-green-400/20 via-emerald-400/20 to-green-400/20 border-3 border-green-400 text-green-300 font-black py-3 px-4 rounded-xl flex items-center justify-center relative overflow-hidden"
                        >
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 3, repeat: Infinity }}
                            className="absolute inset-0 bg-gradient-to-r from-green-400/10 to-transparent"
                          />
                          <div className="flex items-center relative z-10 text-sm">
                            <CheckCircle className="w-6 h-6 mr-2" />
                            <span>🏆 QUEST CONCLUÍDA! 🏆</span>
                          </div>
                        </motion.div>
                      )}
                      
                      {/* Epic XP Reward */}
                      <div className="mt-3 pt-3 border-t-2 border-gradient-to-r from-yellow-400/30 to-orange-400/30">
                        <div className="text-center relative">
                          <div className="text-xs text-purple-300 mb-1 font-bold">⭐ RECOMPENSA ÉPICA ⭐</div>
                          <motion.div 
                            animate={{ 
                              scale: [1, 1.2, 1],
                              textShadow: [
                                "0 0 10px rgba(255, 255, 0, 0.5)",
                                "0 0 30px rgba(255, 255, 0, 0.8)",
                                "0 0 10px rgba(255, 255, 0, 0.5)"
                              ]
                            }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="text-2xl font-black text-transparent bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 bg-clip-text flex items-center justify-center"
                          >
                            <Award className="w-6 h-6 mr-1 text-yellow-400" />
                            {lesson.xp} XP
                          </motion.div>
                        </div>
                      </div>
                    </motion.div>
                  </motion.div>

                  {/* Epic Resources Card */}
                  <motion.div
                    initial={{ opacity: 0, x: 20, scale: 0.9 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    transition={{ duration: 0.6, delay: 0.8, type: "spring", bounce: 0.4 }}
                    className="relative overflow-hidden"
                  >
                    {/* Cyberpunk border */}
                    <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 rounded-2xl opacity-75 blur-sm" />
                    
                    <div className="relative bg-gradient-to-br from-slate-900/95 to-blue-900/95 backdrop-blur-sm rounded-2xl p-4 shadow-xl border border-cyan-500/30">
                      <h3 className="font-black text-lg text-transparent bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text mb-3 flex items-center">
                        <span className="text-xl mr-2">🚀</span>
                        ARSENAL ÉPICO
                      </h3>
                      
                      <div className="space-y-2">
                        {[
                          { icon: FileText, label: "Material de Apoio", color: "from-blue-400 to-cyan-400" },
                          { icon: BookOpen, label: "Exercícios Práticos", color: "from-green-400 to-emerald-400" },
                          { icon: Users, label: "Fórum de Discussão", color: "from-purple-400 to-pink-400" }
                        ].map((resource, index) => (
                          <motion.div
                            key={index}
                            whileHover={{ scale: 1.05, x: 10 }}
                            whileTap={{ scale: 0.95 }}
                            className="flex items-center p-2 rounded-xl bg-gradient-to-r from-slate-800/50 to-slate-700/50 border-2 border-cyan-500/20 hover:border-cyan-400/50 cursor-pointer transition-all duration-300 group relative overflow-hidden"
                          >
                            {/* Hover effect */}
                            <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/10 to-blue-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            
                            <div className={`w-8 h-8 rounded-lg bg-gradient-to-r ${resource.color} flex items-center justify-center mr-3 relative z-10`}>
                              <resource.icon className="w-4 h-4 text-white" />
                            </div>
                            <span className="text-cyan-200 font-bold text-sm group-hover:text-white transition-colors relative z-10">
                              {resource.label}
                            </span>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                </div>
              </div>
            </div>
          </div>
        )
        
      case 'quiz':
        const question = lesson.quiz?.questions[0]
        if (!question) {
          return (
            <div className="bg-white rounded-xl p-8 shadow-lg text-center">
              <p className="text-gray-600">Quiz não disponível</p>
            </div>
          )
        }
        
        return (
          <div className="bg-white rounded-xl p-8 shadow-lg">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mr-4">
                <Award className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{lesson.title}</h1>
                <div className="flex items-center text-gray-600 mt-2">
                  <Clock className="w-4 h-4 mr-1" />
                  <span>{lesson.duration} minutos</span>
                  <span className="mx-2">•</span>
                  <span>{lesson.xp} XP</span>
                </div>
              </div>
            </div>
            
            <div className="mb-8">
              <h2 className="text-2xl font-semibold mb-6 text-gray-800">
                {question.question}
              </h2>
              
              <div className="space-y-4">
                {question.options.map((option, index) => (
                  <motion.button
                    key={index}
                    onClick={() => handleAnswerSelect(index)}
                    disabled={showResult}
                    className={`w-full p-4 text-left rounded-lg border-2 transition-all duration-200 ${
                      selectedAnswer === index
                        ? showResult
                          ? index === question.correctAnswer
                            ? 'border-green-500 bg-green-50 text-green-800'
                            : 'border-red-500 bg-red-50 text-red-800'
                          : 'border-blue-500 bg-blue-50 text-blue-800'
                        : showResult && index === question.correctAnswer
                        ? 'border-green-500 bg-green-50 text-green-800'
                        : 'border-gray-200 bg-gray-50 hover:border-blue-300 hover:bg-blue-50'
                    }`}
                    whileHover={{ scale: showResult ? 1 : 1.02 }}
                    whileTap={{ scale: showResult ? 1 : 0.98 }}
                  >
                    <div className="flex items-center">
                      <span className="w-8 h-8 rounded-full border-2 border-current flex items-center justify-center mr-3 text-sm font-semibold">
                        {String.fromCharCode(65 + index)}
                      </span>
                      <span className="font-medium">{option}</span>
                      {showResult && selectedAnswer === index && (
                        <div className="ml-auto">
                          {index === question.correctAnswer ? (
                            <CheckCircle className="w-6 h-6 text-green-600" />
                          ) : (
                            <XCircle className="w-6 h-6 text-red-600" />
                          )}
                        </div>
                      )}
                      {showResult && index === question.correctAnswer && selectedAnswer !== index && (
                        <div className="ml-auto">
                          <CheckCircle className="w-6 h-6 text-green-600" />
                        </div>
                      )}
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>
            
            {!showResult && !quizCompleted && (
              <button
                onClick={handleSubmitAnswer}
                disabled={selectedAnswer === null}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:from-gray-400 disabled:to-gray-500 text-white py-4 text-lg font-semibold rounded-lg transition-all duration-200 disabled:cursor-not-allowed"
              >
                Confirmar Resposta
              </button>
            )}
            
            {showResult && (
              <div className={`text-center py-6 rounded-lg ${isCorrect ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
                <div className="flex items-center justify-center mb-2">
                  {isCorrect ? (
                    <CheckCircle className="w-8 h-8 text-green-600 mr-2" />
                  ) : (
                    <XCircle className="w-8 h-8 text-red-600 mr-2" />
                  )}
                  <span className="text-xl font-bold">
                    {isCorrect ? 'Resposta Correta!' : 'Resposta Incorreta'}
                  </span>
                </div>
                {question.explanation && (
                  <p className="text-gray-700 mt-4">{question.explanation}</p>
                )}
                {isCorrect && (
                  <div className="mt-4">
                    <span className="inline-flex items-center bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-semibold">
                      <Award className="w-4 h-4 mr-1" />
                      +{lesson.xp} XP
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>
        )
        
      case 'challenge':
        return (
          <div className="bg-white rounded-xl p-8 shadow-lg">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mr-4">
                <Award className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{lesson.title}</h1>
                <div className="flex items-center text-gray-600 mt-2">
                  <Clock className="w-4 h-4 mr-1" />
                  <span>{lesson.duration} minutos</span>
                  <span className="mx-2">•</span>
                  <span>{lesson.xp} XP</span>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-orange-50 to-yellow-50 rounded-lg p-8 mb-6">
              <h2 className="text-2xl font-semibold mb-4 text-orange-800">Desafio Prático</h2>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <p className="text-gray-800 leading-relaxed">{lesson.content}</p>
              </div>
            </div>
            
            {!lesson.completed && (
              <button
                onClick={handleCompleteLesson}
                className="w-full bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white py-4 text-lg font-semibold rounded-lg transition-all duration-200"
              >
                Concluir Desafio
              </button>
            )}
            
            {lesson.completed && (
              <div className="flex items-center justify-center py-4 text-green-600">
                <CheckCircle className="w-6 h-6 mr-2" />
                <span className="font-semibold">Desafio Concluído!</span>
              </div>
            )}
          </div>
        )
        
      case 'assignment':
        return (
          <div className="bg-white rounded-xl p-8 shadow-lg">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mr-4">
                <FileText className="w-6 h-6 text-indigo-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{lesson.title}</h1>
                <div className="flex items-center text-gray-600 mt-2">
                  <Clock className="w-4 h-4 mr-1" />
                  <span>{lesson.duration} minutos</span>
                  <span className="mx-2">•</span>
                  <span>{lesson.xp} XP</span>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-lg p-8 mb-6">
              <h2 className="text-2xl font-semibold mb-4 text-indigo-800">Projeto Prático</h2>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <p className="text-gray-800 leading-relaxed">{lesson.content}</p>
              </div>
            </div>
            
            {!lesson.completed && (
              <button
                onClick={handleCompleteLesson}
                className="w-full bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white py-4 text-lg font-semibold rounded-lg transition-all duration-200"
              >
                Entregar Projeto
              </button>
            )}
            
            {lesson.completed && (
              <div className="flex items-center justify-center py-4 text-green-600">
                <CheckCircle className="w-6 h-6 mr-2" />
                <span className="font-semibold">Projeto Entregue!</span>
              </div>
            )}
          </div>
        )
        
      default:
        return (
          <div className="bg-white rounded-xl p-8 shadow-lg text-center">
            <p className="text-gray-600">Tipo de lição não suportado</p>
          </div>
        )
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header com navegação */}
        <div className="flex items-center mb-8">
          <button
            onClick={() => navigate(`/course/${courseId}`)}
            className="flex items-center text-gray-600 hover:text-gray-900 transition-colors duration-200 mr-4"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Voltar ao Curso
          </button>
          <div className="text-sm text-gray-500">
            {course.title} • Lição {lesson.order}
          </div>
        </div>
        
        {/* Barra de progresso do usuário */}
        <div className="bg-white rounded-xl p-4 shadow-lg mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold mr-3">
                {userProgress.level}
              </div>
              <div>
                <div className="font-semibold text-gray-900">Nível {userProgress.level}</div>
                <div className="text-sm text-gray-600">{userProgress.totalXP} / {userProgress.nextLevelXP} XP</div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {userProgress.badges.slice(-3).map((badge, index) => (
                <span key={index} className="text-2xl">{badge}</span>
              ))}
            </div>
          </div>
          <div className="mt-3">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(userProgress.totalXP / userProgress.nextLevelXP) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>
        
        {/* Conteúdo da lição */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {renderLessonContent()}
        </motion.div>
      </div>
    </div>
  )
}

export default LessonView
