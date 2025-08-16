import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useGame } from '../contexts/GameContext'
import { ArrowLeft, Play, FileText, CheckCircle, XCircle, Award, Clock, Star } from 'lucide-react'

const LessonView: React.FC = () => {
  const { courseId, lessonId } = useParams()
  const navigate = useNavigate()
  const { courses, completLesson, userProgress, updateUserProgress } = useGame()
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

  const handleAnswerSelect = (answerIndex: number) => {
    if (showResult || quizCompleted) return
    setSelectedAnswer(answerIndex)
  }

  const handleSubmitAnswer = () => {
    if (selectedAnswer === null || !lesson.quizQuestions?.[0]) return
    
    const correctAnswer = lesson.quizQuestions[0].correctAnswer
    const correct = selectedAnswer === correctAnswer
    
    setIsCorrect(correct)
    setShowResult(true)
    
    if (correct && !lesson.completed) {
      // Award XP for correct answer
      setTimeout(() => {
        completLesson(courseId!, lessonId!)
        setQuizCompleted(true)
      }, 2000)
    }
  }

  const handleCompleteLesson = () => {
    if (!lesson.completed && lesson.type !== 'quiz') {
      completLesson(courseId!, lessonId!)
    }
  }

  const renderLessonContent = () => {
    switch (lesson.type) {
      case 'video':
        return (
          <div className="bg-white rounded-xl p-8 shadow-lg">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                <Play className="w-6 h-6 text-blue-600" />
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
            
            <div className="bg-gray-100 rounded-lg p-8 mb-6 text-center">
              <Play className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-4">Conteúdo da videoaula:</p>
              <div className="text-left bg-white p-6 rounded-lg shadow-sm">
                <p className="text-gray-800 leading-relaxed">{lesson.content}</p>
              </div>
            </div>
            
            {!lesson.completed && (
              <button
                onClick={handleCompleteLesson}
                className="w-full btn-primary py-4 text-lg"
              >
                Marcar como Concluído
              </button>
            )}
            
            {lesson.completed && (
              <div className="flex items-center justify-center py-4 text-green-600">
                <CheckCircle className="w-6 h-6 mr-2" />
                <span className="font-semibold">Lição Concluída!</span>
              </div>
            )}
          </div>
        )
        
      case 'text':
        return (
          <div className="bg-white rounded-xl p-8 shadow-lg">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4">
                <FileText className="w-6 h-6 text-green-600" />
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
            
            <div className="prose max-w-none mb-8">
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-4">Conteúdo da Lição</h3>
                <p className="text-gray-800 leading-relaxed">{lesson.content}</p>
                
                {lesson.textContent && (
                  <div className="mt-6 p-4 bg-blue-50 rounded-lg border-l-4 border-blue-400">
                    <h4 className="font-semibold text-blue-900 mb-2">Material de Estudo</h4>
                    <p className="text-blue-800">{lesson.textContent}</p>
                  </div>
                )}
              </div>
            </div>
            
            {!lesson.completed && (
              <button
                onClick={handleCompleteLesson}
                className="w-full btn-primary py-4 text-lg"
              >
                Marcar como Concluído
              </button>
            )}
            
            {lesson.completed && (
              <div className="flex items-center justify-center py-4 text-green-600">
                <CheckCircle className="w-6 h-6 mr-2" />
                <span className="font-semibold">Lição Concluída!</span>
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