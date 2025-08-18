import React, { useState, useContext, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { ArrowLeftIcon, PlayIcon, CheckCircleIcon } from '@heroicons/react/24/outline'
import { motion } from 'framer-motion'
import { GameContext } from '../contexts/GameContext'

interface Lesson {
  id: string
  title: string
  type: 'video' | 'text' | 'quiz' | 'challenge' | 'assignment'
  content?: string
  video_url?: string
  completed?: boolean
}

const LessonView: React.FC = () => {
  const { courseId, lessonId } = useParams<{ courseId: string; lessonId: string }>()
  const navigate = useNavigate()
  const { addXP } = useContext(GameContext)
  const [lesson, setLesson] = useState<Lesson | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simular busca de dados da lição
    const fetchLesson = async () => {
      try {
        setLoading(true)
        // Aqui seria a chamada real para a API
        const mockLesson: Lesson = {
          id: lessonId || '1',
          title: 'Lição de Exemplo',
          type: 'text',
          content: 'Conteúdo da lição aqui...',
          completed: false
        }
        setLesson(mockLesson)
      } catch (error) {
        console.error('Erro ao carregar lição:', error)
      } finally {
        setLoading(false)
      }
    }

    if (courseId && lessonId) {
      fetchLesson()
    }
  }, [courseId, lessonId])

  const handleCompleteLesson = () => {
    if (lesson && !lesson.completed) {
      setLesson({ ...lesson, completed: true })
      addXP(10)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (!lesson) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Lição não encontrada</h1>
          <Link
            to={`/courses/${courseId}`}
            className="text-blue-600 hover:text-blue-800 flex items-center justify-center"
          >
            <ArrowLeftIcon className="h-4 w-4 mr-2" />
            Voltar ao curso
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            to={`/courses/${courseId}`}
            className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4"
          >
            <ArrowLeftIcon className="h-4 w-4 mr-2" />
            Voltar ao curso
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">{lesson.title}</h1>
        </div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-md p-8"
        >
          {lesson.type === 'video' && lesson.video_url && (
            <div className="mb-6">
              <video
                controls
                className="w-full rounded-lg"
                poster="/api/placeholder/800/450"
              >
                <source src={lesson.video_url} type="video/mp4" />
                Seu navegador não suporta o elemento de vídeo.
              </video>
            </div>
          )}

          {lesson.type === 'text' && lesson.content && (
            <div className="prose max-w-none mb-6">
              <div dangerouslySetInnerHTML={{ __html: lesson.content }} />
            </div>
          )}

          {/* Complete Lesson Button */}
          {!lesson.completed && (
            <div className="flex justify-end mt-8">
              <button
                onClick={handleCompleteLesson}
                className="inline-flex items-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <CheckCircleIcon className="h-5 w-5 mr-2" />
                Marcar como Concluída
              </button>
            </div>
          )}

          {lesson.completed && (
            <div className="flex items-center justify-center mt-8 text-green-600">
              <CheckCircleIcon className="h-6 w-6 mr-2" />
              <span className="text-lg font-semibold">Lição Concluída!</span>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}

export default LessonView

const LessonView: React.FC = () => {
  const { courseId, lessonId } = useParams()
  const navigate = useNavigate()
  const { courses, completLesson } = useGame()
  const [lesson, setLesson] = useState<Lesson | null>(null)
  const [isCompleted, setIsCompleted] = useState(false)
  const [showCompletionEffect, setShowCompletionEffect] = useState(false)

  useEffect(() => {
    const course = courses.find(c => c.id === parseInt(courseId || '0'))
    if (course) {
      const foundLesson = course.lessons.find(l => l.id === parseInt(lessonId || '0'))
      if (foundLesson) {
        setLesson(foundLesson as Lesson)
        setIsCompleted(foundLesson.completed || false)
      }
    }
  }, [courseId, lessonId, courses])

  const handleCompleteLesson = () => {
    if (lesson && !isCompleted) {
      completLesson(parseInt(courseId || '0'), lesson.id)
      setIsCompleted(true)
      setShowCompletionEffect(true)
      setTimeout(() => setShowCompletionEffect(false), 3000)
    }
  }

  const getLessonIcon = (type: string) => {
    switch (type) {
      case 'video':
        return <PlayIcon className="w-6 h-6" />
      case 'reading':
        return <BookOpenIcon className="w-6 h-6" />
      case 'quiz':
        return <QuestionMarkCircleIcon className="w-6 h-6" />
      case 'challenge':
        return <TrophyIcon className="w-6 h-6" />
      case 'assignment':
        return <DocumentTextIcon className="w-6 h-6" />
      default:
        return <BookOpenIcon className="w-6 h-6" />
    }
  }

  const renderLessonContent = () => {
    if (!lesson) return null

    switch (lesson.type) {
      case 'video':
        return (
          <div className="space-y-6">
            <div className="relative bg-black rounded-xl overflow-hidden aspect-video">
              {lesson.videoUrl ? (
                <video
                  controls
                  className="w-full h-full"
                  poster="/api/placeholder/800/450"
                >
                  <source src={lesson.videoUrl} type="video/mp4" />
                  Seu navegador não suporta o elemento de vídeo.
                </video>
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-900">
                  <div className="text-center">
                    <PlayIcon className="w-16 h-16 text-white mx-auto mb-4 opacity-50" />
                    <p className="text-white opacity-75">Vídeo em breve</p>
                  </div>
                </div>
              )}
            </div>
            {lesson.content && (
              <div className="prose max-w-none">
                <div dangerouslySetInnerHTML={{ __html: lesson.content }} />
              </div>
            )}
          </div>
        )

      case 'reading':
        return (
          <div className="prose max-w-none">
            <div className="bg-white rounded-xl p-8 shadow-lg">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                  <BookOpenIcon className="w-6 h-6 text-blue-600" />
                </div>
                <h1 className="text-3xl font-bold text-gray-900">{lesson.title}</h1>
              </div>
              {lesson.content ? (
                <div dangerouslySetInnerHTML={{ __html: lesson.content }} />
              ) : (
                <p className="text-gray-600">Conteúdo será disponibilizado em breve.</p>
              )}
            </div>
          </div>
        )

      case 'quiz':
        return (
          <div className="bg-white rounded-xl p-8 shadow-lg">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mr-4">
                <QuestionMarkCircleIcon className="w-6 h-6 text-purple-600" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900">{lesson.title}</h1>
            </div>
            <p className="text-gray-600 mb-8">{lesson.description}</p>
            {lesson.quizQuestions?.length ? (
              <div className="space-y-6">
                {lesson.quizQuestions.map((question, index) => (
                  <div key={question.id} className="border rounded-lg p-6">
                    <h3 className="font-semibold mb-4">
                      {index + 1}. {question.question}
                    </h3>
                    <div className="space-y-3">
                      {question.options.map((option, optIndex) => (
                        <label key={optIndex} className="flex items-center space-x-3 cursor-pointer">
                          <input
                            type="radio"
                            name={`question-${question.id}`}
                            className="text-purple-600"
                          />
                          <span>{option}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">Quiz será disponibilizado em breve.</p>
            )}
          </div>
        )

      default:
        return (
          <div className="bg-white rounded-xl p-8 shadow-lg">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mr-4">
                {getLessonIcon(lesson.type)}
              </div>
              <h1 className="text-3xl font-bold text-gray-900">{lesson.title}</h1>
            </div>
            <p className="text-gray-600">{lesson.description}</p>
          </div>
        )
    }
  }

  if (!lesson) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando aula...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
      {/* Header Navigation */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Link
                to={`/courses/${courseId}`}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeftIcon className="w-5 h-5" />
                <span>Voltar ao Curso</span>
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <ClockIcon className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-600">{lesson.duration} min</span>
              </div>
              <div className="flex items-center space-x-2">
                <StarIcon className="w-4 h-4 text-yellow-500" />
                <span className="text-sm text-gray-600">{lesson.xp} XP</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          {/* Lesson Content */}
          <div className="xl:col-span-3">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {renderLessonContent()}
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="xl:col-span-1">
            <div className="space-y-4">
              {/* Progress Card */}
              <motion.div
                className="bg-white rounded-xl p-4 shadow-lg border-l-4 border-purple-500"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-gray-900">Progresso</h3>
                  <div className="flex items-center space-x-1">
                    {isCompleted ? (
                      <CheckCircleIcon className="w-5 h-5 text-green-500" />
                    ) : (
                      <div className="w-5 h-5 rounded-full border-2 border-gray-300"></div>
                    )}
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Status:</span>
                    <span className={isCompleted ? 'text-green-600 font-medium' : 'text-gray-500'}>
                      {isCompleted ? 'Concluída' : 'Em andamento'}
                    </span>
                  </div>
                </div>
              </motion.div>

              {/* Action Card */}
              <motion.div
                className="bg-gradient-to-r from-purple-500 to-blue-600 rounded-xl p-4 text-white shadow-lg"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <div className="flex items-center mb-3">
                  <TrophyIcon className="w-6 h-6 mr-2" />
                  <h3 className="font-semibold">Recompensas</h3>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>XP:</span>
                    <span className="font-bold">+{lesson.xp}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Pontos:</span>
                    <span className="font-bold">+{lesson.points}</span>
                  </div>
                </div>
                {!isCompleted && (
                  <button
                    onClick={handleCompleteLesson}
                    className="w-full mt-4 bg-white text-purple-600 px-4 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors"
                  >
                    Concluir Aula
                  </button>
                )}
              </motion.div>

              {/* Lesson Info */}
              <motion.div
                className="bg-white rounded-xl p-4 shadow-lg"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <h3 className="font-semibold text-gray-900 mb-3">Informações</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center">
                    {getLessonIcon(lesson.type)}
                    <span className="ml-2 text-gray-600 capitalize">{lesson.type}</span>
                  </div>
                  <div className="flex items-center">
                    <ClockIcon className="w-5 h-5 text-gray-400" />
                    <span className="ml-2 text-gray-600">{lesson.duration} minutos</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* Completion Effect */}
      {showCompletionEffect && (
        <motion.div
          className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-green-500 text-white px-8 py-4 rounded-xl shadow-2xl"
            initial={{ scale: 0, rotate: -10 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 150, damping: 15 }}
          >
            <div className="flex items-center space-x-3">
              <CheckCircleIcon className="w-8 h-8" />
              <div>
                <p className="font-bold text-lg">Aula Concluída! 🎉</p>
                <p className="text-green-100">+{lesson.xp} XP | +{lesson.points} pontos</p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  )
}

export default LessonView

const LessonView: React.FC = () => {
  const { courseId, lessonId } = useParams()
  const navigate = useNavigate()
  const { courses, completLesson, userProgress } = useGame()
  
  const course = courses.find(c => c.id === courseId)
  const lesson = course?.lessons.find(l => l.id === lessonId)
  
  if (!course || !lesson) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-center">
          <h2 className="text-2xl font-bold mb-4">Lição não encontrada</h2>
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

  const handleCompleteLesson = () => {
    completLesson(course.id, lesson.id)
  }

  return (
          <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative">
            {/* Epic Background Effects */}
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiM5OTMzZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDE0SDUwQzUwIDI0IDQyIDM2IDMwIDM2UzEwIDI0IDEwIDE0SDE0QzE0IDIwIDIwIDI2IDMwIDI2UzQ2IDIwIDQ2IDE0SDM2WiIvPjwvZz48L2c+PC9zdmc+')] opacity-20" />
            
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
                    <ArrowLeftIcon className="w-6 h-6 mr-3 group-hover:animate-bounce" />
                    <span className="text-lg">⚔️ VOLTAR AO CURSO</span>
                  </motion.button>
                  
                  {/* Epic Stats Bar */}
                  <div className="flex items-center space-x-6">
                    <motion.div 
                      whileHover={{ scale: 1.1 }}
                      className="flex items-center bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-2 rounded-full border-2 border-yellow-400 shadow-lg"
                    >
                      <ClockIcon className="w-5 h-5 mr-2" />
                      <span className="font-black text-lg">{lesson.duration} min</span>
                    </motion.div>
                    <motion.div 
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      className="flex items-center bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-4 py-2 rounded-full border-2 border-yellow-300 shadow-lg"
                    >
                      <TrophyIcon className="w-5 h-5 mr-2" />
                      <span className="font-black text-lg">{lesson.xp} XP</span>
                    </motion.div>
                  </div>
                </div>
              </div>
            </div>

            <div className="min-h-screen">
              <div className="max-w-full mx-auto px-2 sm:px-4 py-4">
                <div className="grid grid-cols-1 xl:grid-cols-4 gap-4">
                  
                  {/* Epic Main Content Column */}
                  <div className="xl:col-span-3 space-y-6">
                  
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
                                <PlayIcon className="w-20 h-20 mx-auto mb-6 text-purple-400" />
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
                          transition={{ duration: 2, repeat: Infinity }}
                          className="bg-gradient-to-r from-yellow-400 to-orange-500 px-4 py-2 rounded-full border-2 border-white shadow-lg"
                        >
                          <span className="text-white font-black text-sm">⭐ QUEST ATIVA</span>
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
                              <BookOpenIcon className="w-5 h-5 mr-2" />
                              <span className="font-bold">{course.title}</span>
                            </motion.div>
                            <motion.div 
                              whileHover={{ scale: 1.1 }}
                              className="flex items-center bg-green-500/20 px-4 py-2 rounded-full border border-green-500/30"
                            >
                              <UsersIcon className="w-5 h-5 mr-2" />
                              <span className="font-bold">{course.instructor}</span>
                            </motion.div>
                            <motion.div 
                              whileHover={{ scale: 1.1 }}
                              className="flex items-center bg-purple-500/20 px-4 py-2 rounded-full border border-purple-500/30"
                            >
                              <EyeIcon className="w-5 h-5 mr-2" />
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
                                <StarIcon 
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
                          className="bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 rounded-2xl p-4 border-2 border-blue-400/30 relative overflow-hidden"
                        >
                          {/* Animated background effect */}
                          <motion.div
                            animate={{ 
                              backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"]
                            }}
                            transition={{ duration: 8, repeat: Infinity }}
                            className="absolute inset-0 bg-gradient-to-r from-blue-400/5 via-purple-400/5 to-pink-400/5 bg-[length:200%_200%]"
                          />
                          
                          <h3 className="text-xl font-black text-transparent bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text mb-3 flex items-center relative z-10">
                            <DocumentTextIcon className="w-6 h-6 mr-2 text-cyan-400" />
                            🎯 MISSÃO ÉPICA
                          </h3>
                          <p className="text-cyan-200 leading-relaxed text-base font-medium relative z-10">{lesson.content}</p>
                        </motion.div>
                      </div>
                    </div>
                  </motion.div>
                </div>

                {/* Epic Gaming Sidebar */}
                <div className="space-y-4">
                  
                  {/* Epic Progress Card */}
                  <motion.div
                    initial={{ opacity: 0, x: 20, scale: 0.9 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    transition={{ duration: 0.6, delay: 0.4, type: "spring", bounce: 0.4 }}
                    className="relative overflow-hidden"
                  >
                    {/* Glow Effect Background */}
                    <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 rounded-3xl opacity-75 blur-sm animate-pulse" />
                    
                    <div className="relative bg-gradient-to-br from-slate-900/95 to-purple-900/95 backdrop-blur-sm rounded-3xl p-4 shadow-2xl border border-purple-500/30">
                      {/* Epic Header */}
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-black text-lg text-transparent bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 bg-clip-text flex items-center">
                          <TrophyIcon className="w-6 h-6 mr-2 text-yellow-400 animate-bounce" />
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

                      {/* Epic Progress Bar */}
                      <div className="mb-4">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-purple-200 font-bold text-sm">🎯 PROGRESSO DA QUEST</span>
                          <span className="text-yellow-400 font-black text-xl">{course.progress}%</span>
                        </div>
                        <div className="relative w-full bg-slate-800 rounded-full h-4 overflow-hidden border-2 border-purple-500/30">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${course.progress}%` }}
                            transition={{ duration: 2, ease: "easeOut" }}
                            className="bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 h-full rounded-full flex items-center justify-end pr-2 relative overflow-hidden"
                          >
                            {/* Animated shine effect */}
                            <motion.div
                              animate={{ x: [-100, 100] }}
                              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                              className="absolute inset-0 bg-white/20 w-8 skew-x-12"
                            />
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{ duration: 2, repeat: Infinity }}
                            >
                              ⭐
                            </motion.div>
                          </motion.div>
                        </div>
                      </div>
                      
                      {/* Epic Stats Grid */}
                      <div className="grid grid-cols-2 gap-3">
                        <motion.div 
                          whileHover={{ scale: 1.1, rotate: 5 }}
                          className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 p-3 rounded-2xl border-2 border-yellow-500/30 text-center relative overflow-hidden"
                        >
                          <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/10 to-orange-400/10 animate-pulse" />
                          <div className="relative z-10">
                            <div className="text-2xl font-black text-yellow-400 mb-1">{course.earnedXP}</div>
                            <div className="text-xs text-yellow-300 uppercase tracking-wider font-bold">⚡ XP POWER</div>
                          </div>
                        </motion.div>
                        
                        <motion.div 
                          whileHover={{ scale: 1.1, rotate: -5 }}
                          className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 p-3 rounded-2xl border-2 border-purple-500/30 text-center relative overflow-hidden"
                        >
                          <div className="absolute inset-0 bg-gradient-to-r from-purple-400/10 to-pink-400/10 animate-pulse" />
                          <div className="relative z-10">
                            <div className="text-2xl font-black text-purple-400 mb-1">{course.completedLessons}</div>
                            <div className="text-xs text-purple-300 uppercase tracking-wider font-bold">🎯 CONQUISTAS</div>
                          </div>
                        </motion.div>
                      </div>
                    </div>
                  </motion.div>

                  {/* Epic Action Card */}
                  <motion.div
                    initial={{ opacity: 0, x: 20, scale: 0.9 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    transition={{ duration: 0.6, delay: 0.6, type: "spring", bounce: 0.4 }}
                    className="relative"
                  >
                    {/* Lightning Border Effect */}
                    <motion.div
                      animate={{ 
                        boxShadow: [
                          "0 0 20px rgba(255, 255, 0, 0.5)",
                          "0 0 40px rgba(255, 0, 255, 0.7)", 
                          "0 0 20px rgba(0, 255, 255, 0.5)",
                          "0 0 40px rgba(255, 255, 0, 0.7)"
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
                          { icon: DocumentTextIcon, label: "Material de Apoio", color: "from-blue-400 to-cyan-400" },
                          { icon: BookOpenIcon, label: "Exercícios Práticos", color: "from-green-400 to-emerald-400" },
                          { icon: UsersIcon, label: "Fórum de Discussão", color: "from-purple-400 to-pink-400" }
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
    </div>
  )
}

export default LessonView
                    </div>
                  )}

                  {lesson.title.includes('Variáveis') && (
                    <div className="bg-yellow-50 p-6 rounded-lg border-l-4 border-yellow-500">
                      <h4 className="font-semibold text-yellow-900 mb-4">💡 Tipos de Dados em Python:</h4>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <h5 className="font-semibold text-yellow-800">Números:</h5>
                          <code className="block bg-gray-800 text-green-400 p-2 rounded text-sm mt-1">
                            idade = 25<br/>
                            preco = 19.99
                          </code>
                        </div>
                        <div>
                          <h5 className="font-semibold text-yellow-800">Strings:</h5>
                          <code className="block bg-gray-800 text-green-400 p-2 rounded text-sm mt-1">
                            nome = "João"<br/>
                            mensagem = 'Olá!'
                          </code>
                        </div>
                      </div>
                    </div>
                  )}

                  {lesson.title.includes('HTML') && (
                    <div className="bg-orange-50 p-6 rounded-lg border-l-4 border-orange-500">
                      <h4 className="font-semibold text-orange-900 mb-4">🌐 Estrutura Básica do HTML:</h4>
                      <div className="bg-white p-4 rounded border">
                        <pre className="text-sm text-gray-700">
{`<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Minha Página</title>
</head>
<body>
    <header>
        <h1>Título Principal</h1>
    </header>
    
    <main>
        <section>
            <h2>Seção de Conteúdo</h2>
            <p>Parágrafo com texto explicativo.</p>
        </section>
    </main>
    
    <footer>
        <p>&copy; 2025 Meu Site</p>
    </footer>
</body>
</html>`}
                        </pre>
                      </div>
                    </div>
                  )}

                  {lesson.title.includes('CSS') && (
                    <div className="bg-purple-50 p-6 rounded-lg border-l-4 border-purple-500">
                      <h4 className="font-semibold text-purple-900 mb-4">🎨 Exemplo de CSS:</h4>
                      <div className="bg-white p-4 rounded border">
                        <pre className="text-sm text-gray-700">
{`/* Seletor de elemento */
body {
    font-family: Arial, sans-serif;
    background-color: #f0f0f0;
    margin: 0;
    padding: 20px;
}

/* Seletor de classe */
.container {
    max-width: 800px;
    margin: 0 auto;
    background: white;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

/* Seletor de ID */
#titulo {
    color: #333;
    text-align: center;
    font-size: 2em;
}`}
                        </pre>
                      </div>
                    </div>
                  )}
                  
                </div>
              </div>

              {/* Material Adicional */}
              {lesson.textContent && (
                <div className="bg-indigo-50 p-6 rounded-lg border-l-4 border-indigo-400">
                  <h4 className="font-semibold text-indigo-900 mb-4 flex items-center">
                    <Star className="w-5 h-5 mr-2" />
                    Dicas Importantes
                  </h4>
                  <p className="text-indigo-800 leading-relaxed">{lesson.textContent}</p>
                </div>
              )}

              {/* Resumo da Lição */}
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-lg border border-green-200">
                <h4 className="font-semibold text-green-900 mb-4 flex items-center">
                  <Award className="w-5 h-5 mr-2" />
                  Resumo da Lição
                </h4>
                <ul className="text-green-800 space-y-2">
                  <li>• Conceitos fundamentais foram apresentados</li>
                  <li>• Exemplos práticos demonstram a aplicação</li>
                  <li>• Próxima lição: continuidade do aprendizado</li>
                  <li>• <strong>Ganhe {lesson.xp} XP</strong> ao completar esta lição!</li>
                </ul>
              </div>
            </div>
            
            {!lesson.completed && (
              <button
                onClick={handleCompleteLesson}
                className="w-full btn-primary py-4 text-lg flex items-center justify-center"
              >
                <CheckCircle className="w-5 h-5 mr-2" />
                Marcar como Concluído (+{lesson.xp} XP)
              </button>
            )}
            
            {lesson.completed && (
              <div className="flex items-center justify-center py-4 text-green-600 bg-green-50 rounded-lg">
                <CheckCircle className="w-6 h-6 mr-2" />
                <span className="font-semibold">Lição Concluída! +{lesson.xp} XP Ganhos</span>
              </div>
            )}
          </div>
        )
        
      case 'quiz':
        const question = lesson.quizQuestions?.[0]
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
            
            {!showResult && selectedAnswer !== null && (
              <button
                onClick={handleSubmitAnswer}
                className="w-full btn-primary py-4 text-lg"
              >
                Enviar Resposta
              </button>
            )}
            
            {showResult && (
              <div className="mt-6">
                <div className={`p-4 rounded-lg ${
                  isCorrect ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
                }`}>
                  <div className="flex items-center mb-2">
                    {isCorrect ? (
                      <CheckCircle className="w-6 h-6 text-green-600 mr-2" />
                    ) : (
                      <XCircle className="w-6 h-6 text-red-600 mr-2" />
                    )}
                    <h3 className={`font-semibold ${
                      isCorrect ? 'text-green-800' : 'text-red-800'
                    }`}>
                      {isCorrect ? 'Correto!' : 'Incorreto'}
                    </h3>
                  </div>
                  <p className={`${
                    isCorrect ? 'text-green-700' : 'text-red-700'
                  }`}>
                    {question.explanation}
                  </p>
                  
                  {isCorrect && !quizCompleted && (
                    <div className="mt-4 flex items-center text-green-700">
                      <Star className="w-5 h-5 mr-1" />
                      <span className="font-semibold">+{lesson.xp} XP ganhos!</span>
                    </div>
                  )}
                </div>
                
                {quizCompleted && (
                  <div className="mt-4 flex items-center justify-center py-4 text-green-600">
                    <CheckCircle className="w-6 h-6 mr-2" />
                    <span className="font-semibold">Quiz Concluído!</span>
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
              <div className="bg-white p-6 rounded-lg shadow-sm mb-4">
                <p className="text-gray-800 leading-relaxed mb-4">{lesson.content}</p>
                {lesson.assignmentDescription && (
                  <div className="p-4 bg-blue-50 rounded-lg border-l-4 border-blue-400">
                    <h4 className="font-semibold text-blue-900 mb-2">Descrição do Projeto</h4>
                    <p className="text-blue-800">{lesson.assignmentDescription}</p>
                  </div>
                )}
              </div>
            </div>
            
            {!lesson.completed && (
              <button
                onClick={handleCompleteLesson}
                className="w-full bg-gradient-to-r from-indigo-500 to-blue-500 hover:from-indigo-600 hover:to-blue-600 text-white py-4 text-lg font-semibold rounded-lg transition-all duration-200"
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