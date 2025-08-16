import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useGame } from '../../contexts/GameContext'
import {
  PlusIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  AcademicCapIcon,
  ChartBarIcon,
  UserGroupIcon,
  TrophyIcon,
  SparklesIcon,
  RocketLaunchIcon,
  FireIcon,
  BoltIcon
} from '@heroicons/react/24/outline'

const InstructorDashboard: React.FC = () => {
  const navigate = useNavigate()
  const { courses, userProgress, createCourse, deleteCourse } = useGame()
  const [searchTerm, setSearchTerm] = useState('')

  const instructorCourses = courses.filter(course => 
    course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.category.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleCreateCourse = () => {
    navigate('/instructor/course/new/edit')
  }

  const handleEditCourse = (courseId: string) => {
    navigate(`/instructor/course/${courseId}/edit`)
  }

  const handlePreviewCourse = (courseId: string) => {
    navigate(`/courses/${courseId}`)
  }

  const handleDeleteCourse = (courseId: string) => {
    if (window.confirm('Tem certeza que deseja deletar este curso?')) {
      deleteCourse(courseId)
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'comum':
        return 'from-gray-500 to-gray-600'
      case 'raro':
        return 'from-blue-500 to-cyan-500'
      case 'épico':
        return 'from-purple-500 to-pink-500'
      case 'lendário':
        return 'from-yellow-500 to-orange-500'
      default:
        return 'from-gray-500 to-gray-600'
    }
  }

  const totalStudents = userProgress.currentCourses ? userProgress.currentCourses.length : 0
  const totalCourses = courses.length
  const publishedCourses = courses.filter(c => c.published).length

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-8 pb-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-black text-white mb-4 flex items-center justify-center gap-4">
            <span className="text-6xl">🎮</span>
            CENTRAL DE COMANDO
          </h1>
          <p className="text-xl text-purple-200 font-bold">
            Forje experiências épicas de aprendizado
          </p>
          <div className="w-32 h-1 bg-gradient-to-r from-purple-500 to-pink-500 mx-auto mt-4 rounded-full"></div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
        >
          <div className="bg-gradient-to-br from-blue-600 to-cyan-600 rounded-2xl p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 font-bold">Total de Cursos</p>
                <p className="text-3xl font-black">{totalCourses}</p>
              </div>
              <AcademicCapIcon className="w-12 h-12 text-blue-200" />
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-green-600 to-emerald-600 rounded-2xl p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 font-bold">Publicados</p>
                <p className="text-3xl font-black">{publishedCourses}</p>
              </div>
              <RocketLaunchIcon className="w-12 h-12 text-green-200" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 font-bold">Estudantes</p>
                <p className="text-3xl font-black">{totalStudents}</p>
              </div>
              <UserGroupIcon className="w-12 h-12 text-purple-200" />
            </div>
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <h2 className="text-2xl font-black text-white flex items-center gap-2">
              <SparklesIcon className="w-8 h-8 text-yellow-400" />
              SEUS CURSOS ÉPICOS
            </h2>
            
            <div className="flex gap-3">
              <input
                type="text"
                placeholder="Buscar cursos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-slate-800 border-2 border-purple-400 rounded-lg px-4 py-2 text-white placeholder-purple-300 focus:outline-none focus:border-yellow-400 transition-colors"
              />
              <motion.button
                onClick={handleCreateCourse}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg font-bold border-2 border-green-300 shadow-lg"
              >
                <PlusIcon className="w-5 h-5" />
                CRIAR CURSO
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Courses Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {instructorCourses.map((course, index) => (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 + 0.3 }}
              className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-6 hover:bg-white/15 transition-all duration-300"
            >
              {/* Course Header */}
              <div className="flex items-start justify-between mb-4">
                <div className={`text-4xl p-3 rounded-xl bg-gradient-to-br ${getDifficultyColor(course.difficulty)}`}>
                  {course.thumbnail}
                </div>
                <div className="flex items-center gap-1">
                  <motion.button
                    onClick={() => handlePreviewCourse(course.id)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="p-2 bg-blue-600/20 rounded-lg text-blue-300 hover:bg-blue-600/30 border border-blue-500/30"
                  >
                    <EyeIcon className="w-4 h-4" />
                  </motion.button>
                  <motion.button
                    onClick={() => handleEditCourse(course.id)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="p-2 bg-purple-600/20 rounded-lg text-purple-300 hover:bg-purple-600/30 border border-purple-500/30"
                  >
                    <PencilIcon className="w-4 h-4" />
                  </motion.button>
                  <motion.button
                    onClick={() => handleDeleteCourse(course.id)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="p-2 bg-red-600/20 rounded-lg text-red-300 hover:bg-red-600/30 border border-red-500/30"
                  >
                    <TrashIcon className="w-4 h-4" />
                  </motion.button>
                </div>
              </div>

              {/* Course Info */}
              <div className="mb-4">
                <h3 className="text-xl font-black text-white mb-2">{course.title}</h3>
                <p className="text-purple-200 text-sm mb-3 line-clamp-2">{course.description}</p>
                
                <div className="flex items-center gap-2 mb-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-bold uppercase bg-gradient-to-r ${getDifficultyColor(course.difficulty)} text-white`}>
                    {course.difficulty}
                  </span>
                  <span className="text-purple-300 text-xs">{course.category}</span>
                </div>

                <div className="flex items-center justify-between text-sm text-purple-300">
                  <span>{course.modules.length} módulos</span>
                  <span>
                    {course.modules.reduce((total, module) => total + module.lessons.length, 0)} aulas
                  </span>
                </div>
              </div>

              {/* Status */}
              <div className="flex items-center justify-between">
                {course.published ? (
                  <div className="flex items-center gap-2 px-3 py-1 bg-green-500/20 text-green-300 rounded-lg border border-green-500/30">
                    <RocketLaunchIcon className="w-4 h-4" />
                    <span className="text-sm font-bold">Publicado</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 px-3 py-1 bg-yellow-500/20 text-yellow-300 rounded-lg border border-yellow-500/30">
                    <PencilIcon className="w-4 h-4" />
                    <span className="text-sm font-bold">Rascunho</span>
                  </div>
                )}

                <motion.button
                  onClick={() => handleEditCourse(course.id)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="text-purple-300 hover:text-white text-sm font-bold"
                >
                  Editar →
                </motion.button>
              </div>
            </motion.div>
          ))}

          {/* Create Course Card */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: instructorCourses.length * 0.1 + 0.3 }}
            className="bg-gradient-to-br from-purple-600/20 to-pink-600/20 backdrop-blur-lg rounded-2xl border-2 border-dashed border-purple-400/50 p-6 flex flex-col items-center justify-center min-h-[300px] hover:bg-purple-600/30 transition-all duration-300 cursor-pointer"
            onClick={handleCreateCourse}
          >
            <div className="text-6xl mb-4">✨</div>
            <h3 className="text-xl font-black text-white mb-2">Criar Novo Curso</h3>
            <p className="text-purple-200 text-sm text-center mb-4">
              Dê vida a uma nova aventura de aprendizado
            </p>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-bold border-2 border-purple-300"
            >
              <PlusIcon className="w-5 h-5" />
              COMEÇAR
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Empty State */}
        {instructorCourses.length === 0 && searchTerm === '' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-center py-16"
          >
            <div className="text-8xl mb-6">🎯</div>
            <h3 className="text-3xl font-black text-white mb-4">Sua Jornada Começa Aqui!</h3>
            <p className="text-lg text-purple-200 mb-8 max-w-2xl mx-auto">
              Transforme seu conhecimento em experiências interativas e gamificadas. 
              Crie seu primeiro curso e inspire milhares de estudantes!
            </p>
            <motion.button
              onClick={handleCreateCourse}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-3 mx-auto px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-2xl font-bold text-lg border-3 border-green-300 shadow-2xl"
            >
              <RocketLaunchIcon className="w-6 h-6" />
              CRIAR MEU PRIMEIRO CURSO
            </motion.button>
          </motion.div>
        )}

        {/* No Results */}
        {instructorCourses.length === 0 && searchTerm !== '' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-bold text-white mb-2">Nenhum curso encontrado</h3>
            <p className="text-purple-200">
              Tente buscar com outros termos ou crie um novo curso
            </p>
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default InstructorDashboard
