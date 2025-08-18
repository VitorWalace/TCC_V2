import React, { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  ArrowLeftIcon,
  PlayIcon,
  CheckCircleIcon,
  ClockIcon,
  BookOpenIcon,
  TrophyIcon,
  StarIcon,
  DocumentTextIcon,
  QuestionMarkCircleIcon
} from '@heroicons/react/24/outline'
import { useGame } from '../contexts/GameContext'

interface Lesson {
  id: number
  title: string
  description: string
  videoUrl?: string
  content?: string
  duration: number
  type: 'video' | 'reading' | 'quiz' | 'challenge' | 'assignment'
  points: number
  xp: number
  quizQuestions?: Array<{
    id: number
    question: string
    options: string[]
    correct: number
  }>
}

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
