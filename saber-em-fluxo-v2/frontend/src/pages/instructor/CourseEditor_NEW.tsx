import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useGame, Course, Module, Lesson } from '../../contexts/GameContext'
import {
  ArrowLeftIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  PlayIcon,
  DocumentTextIcon,
  AcademicCapIcon,
  BoltIcon,
  EyeIcon,
  CheckIcon,
  XMarkIcon,
  VideoCameraIcon,
  ClipboardDocumentListIcon
} from '@heroicons/react/24/outline'
import {
  SparklesIcon,
  FireIcon,
  TrophyIcon
} from '@heroicons/react/24/solid'

const CourseEditor: React.FC = () => {
  const { courseId } = useParams()
  const navigate = useNavigate()
  const { 
    getCourseById, 
    createCourse, 
    updateCourse, 
    addModule, 
    updateModule, 
    deleteModule, 
    addLesson, 
    updateLesson, 
    deleteLesson, 
    publishCourse 
  } = useGame()

  const [course, setCourse] = useState<Course | null>(null)
  const [editingCourse, setEditingCourse] = useState(false)
  const [editingModule, setEditingModule] = useState<string | null>(null)
  const [editingLesson, setEditingLesson] = useState<string | null>(null)
  const [showModuleForm, setShowModuleForm] = useState(false)
  const [showLessonForm, setShowLessonForm] = useState<string | null>(null)

  const [courseForm, setCourseForm] = useState({
    title: '',
    description: '',
    thumbnail: '',
    difficulty: 'beginner' as 'beginner' | 'intermediate' | 'advanced',
    category: '',
    estimatedDuration: '',
    xpReward: 100
  })

  const [moduleForm, setModuleForm] = useState({
    title: '',
    description: '',
    order: 1
  })

  const [lessonForm, setLessonForm] = useState({
    title: '',
    description: '',
    type: 'video' as 'video' | 'text' | 'quiz' | 'assignment' | 'challenge' | 'boss-battle',
    content: '',
    videoUrl: '',
    duration: 0,
    xpReward: 50,
    order: 1,
    questions: [] as any[]
  })

  useEffect(() => {
    if (courseId && courseId !== 'new') {
      const foundCourse = getCourseById(courseId)
      if (foundCourse) {
        setCourse(foundCourse)
        setCourseForm({
          title: foundCourse.title,
          description: foundCourse.description,
          thumbnail: foundCourse.thumbnail || '',
          difficulty: foundCourse.difficulty,
          category: foundCourse.category || '',
          estimatedDuration: foundCourse.estimatedDuration || '',
          xpReward: foundCourse.xpReward || 100
        })
      }
    } else if (courseId === 'new') {
      setCourse(null)
      setCourseForm({
        title: '',
        description: '',
        thumbnail: '',
        difficulty: 'beginner',
        category: '',
        estimatedDuration: '',
        xpReward: 100
      })
    }
  }, [courseId, getCourseById])

  const handleSaveCourse = async () => {
    if (course) {
      const updatedCourse = await updateCourse(course.id, courseForm)
      setCourse(updatedCourse)
    } else {
      const newCourse = await createCourse(courseForm)
      setCourse(newCourse)
      navigate(`/instructor/course-editor/${newCourse.id}`)
    }
    setEditingCourse(false)
  }

  const handleAddModule = async () => {
    if (!course) return
    
    const newModule = await addModule(course.id, {
      ...moduleForm,
      order: course.modules ? course.modules.length + 1 : 1
    })
    
    const updatedCourse = getCourseById(course.id)
    if (updatedCourse) setCourse(updatedCourse)
    
    setModuleForm({ title: '', description: '', order: 1 })
    setShowModuleForm(false)
  }

  const handleAddLesson = async (moduleId: string) => {
    if (!course) return
    
    const module = course.modules?.find(m => m.id === moduleId)
    const lessonData = {
      ...lessonForm,
      order: module?.lessons ? module.lessons.length + 1 : 1
    }
    
    await addLesson(moduleId, lessonData)
    const updatedCourse = getCourseById(course.id)
    if (updatedCourse) setCourse(updatedCourse)
    
    setLessonForm({
      title: '',
      description: '',
      type: 'video',
      content: '',
      videoUrl: '',
      duration: 0,
      xpReward: 50,
      order: 1,
      questions: []
    })
    setShowLessonForm(null)
  }

  const handlePublishCourse = async () => {
    if (!course) return
    
    await publishCourse(course.id)
    const updatedCourse = getCourseById(course.id)
    if (updatedCourse) setCourse(updatedCourse)
  }

  const getLessonTypeIcon = (type: string) => {
    switch (type) {
      case 'video':
        return <VideoCameraIcon className="w-5 h-5" />
      case 'text':
        return <DocumentTextIcon className="w-5 h-5" />
      case 'quiz':
        return <ClipboardDocumentListIcon className="w-5 h-5" />
      case 'assignment':
        return <AcademicCapIcon className="w-5 h-5" />
      case 'challenge':
        return <BoltIcon className="w-5 h-5" />
      case 'boss-battle':
        return <FireIcon className="w-6 h-6" />
      default:
        return <PlayIcon className="w-5 h-5" />
    }
  }

  const getLessonTypeColor = (type: string) => {
    switch (type) {
      case 'video':
        return 'from-blue-500 to-purple-600'
      case 'text':
        return 'from-green-500 to-teal-600'
      case 'quiz':
        return 'from-yellow-500 to-orange-600'
      case 'assignment':
        return 'from-pink-500 to-rose-600'
      case 'challenge':
        return 'from-indigo-500 to-purple-600'
      case 'boss-battle':
        return 'from-red-500 to-orange-600'
      default:
        return 'from-gray-500 to-gray-600'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-800 text-white">
      {/* Header */}
      <div className="bg-black/20 backdrop-blur-sm border-b border-purple-500/20">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/instructor')}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300"
              >
                <ArrowLeftIcon className="w-5 h-5" />
                Voltar
              </motion.button>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                  {course ? 'Editar Curso' : 'Criar Novo Curso'}
                </h1>
                {course && (
                  <p className="text-purple-300 text-sm">
                    Status: {course.isPublished ? 'Publicado' : 'Rascunho'}
                  </p>
                )}
              </div>
            </div>
            
            {course && (
              <div className="flex items-center gap-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate(`/course/${course.id}`)}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg hover:shadow-lg hover:shadow-green-500/25 transition-all duration-300"
                >
                  <EyeIcon className="w-5 h-5" />
                  Preview
                </motion.button>
                
                {!course.isPublished && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handlePublishCourse}
                    className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg hover:shadow-lg hover:shadow-yellow-500/25 transition-all duration-300 font-semibold"
                  >
                    <TrophyIcon className="w-5 h-5" />
                    PUBLICAR
                  </motion.button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Course Details Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-black/30 backdrop-blur-sm border border-purple-500/20 rounded-xl p-6 mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-purple-300">Detalhes do Curso</h2>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setEditingCourse(!editingCourse)}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg"
            >
              <PencilIcon className="w-4 h-4" />
              {editingCourse ? 'Cancelar' : 'Editar'}
            </motion.button>
          </div>

          {editingCourse ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-purple-300 mb-2">
                  Título do Curso
                </label>
                <input
                  type="text"
                  value={courseForm.title}
                  onChange={(e) => setCourseForm({ ...courseForm, title: e.target.value })}
                  className="w-full px-4 py-3 bg-black/40 border border-purple-500/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                  placeholder="Digite o título do curso"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-purple-300 mb-2">
                  Categoria
                </label>
                <input
                  type="text"
                  value={courseForm.category}
                  onChange={(e) => setCourseForm({ ...courseForm, category: e.target.value })}
                  className="w-full px-4 py-3 bg-black/40 border border-purple-500/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                  placeholder="Ex: Programação, Design, Marketing"
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-purple-300 mb-2">
                  Descrição
                </label>
                <textarea
                  value={courseForm.description}
                  onChange={(e) => setCourseForm({ ...courseForm, description: e.target.value })}
                  className="w-full px-4 py-3 bg-black/40 border border-purple-500/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 h-32 resize-none"
                  placeholder="Descreva o que os alunos aprenderão neste curso"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-purple-300 mb-2">
                  Dificuldade
                </label>
                <select
                  value={courseForm.difficulty}
                  onChange={(e) => setCourseForm({ ...courseForm, difficulty: e.target.value as any })}
                  className="w-full px-4 py-3 bg-black/40 border border-purple-500/30 rounded-lg text-white focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                >
                  <option value="beginner">Iniciante</option>
                  <option value="intermediate">Intermediário</option>
                  <option value="advanced">Avançado</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-purple-300 mb-2">
                  XP Recompensa
                </label>
                <input
                  type="number"
                  value={courseForm.xpReward}
                  onChange={(e) => setCourseForm({ ...courseForm, xpReward: parseInt(e.target.value) })}
                  className="w-full px-4 py-3 bg-black/40 border border-purple-500/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                  placeholder="100"
                />
              </div>
              
              <div className="md:col-span-2 flex gap-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSaveCourse}
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg font-semibold"
                >
                  <CheckIcon className="w-5 h-5" />
                  Salvar
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setEditingCourse(false)}
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-gray-600 to-gray-700 rounded-lg"
                >
                  <XMarkIcon className="w-5 h-5" />
                  Cancelar
                </motion.button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <h3 className="text-2xl font-bold text-white mb-2">
                  {course?.title || courseForm.title || 'Título do Curso'}
                </h3>
                <p className="text-gray-300">
                  {course?.description || courseForm.description || 'Descrição do curso'}
                </p>
              </div>
              
              <div className="flex flex-wrap gap-4 text-sm">
                <span className="px-3 py-1 bg-purple-600/30 rounded-full">
                  {course?.difficulty || courseForm.difficulty || 'Nível'}
                </span>
                <span className="px-3 py-1 bg-blue-600/30 rounded-full">
                  {course?.category || courseForm.category || 'Categoria'}
                </span>
                <span className="px-3 py-1 bg-yellow-600/30 rounded-full flex items-center gap-1">
                  <SparklesIcon className="w-4 h-4" />
                  {course?.xpReward || courseForm.xpReward} XP
                </span>
              </div>
            </div>
          )}
        </motion.div>

        {/* Modules Section */}
        {course && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-black/30 backdrop-blur-sm border border-purple-500/20 rounded-xl p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-purple-300">Módulos do Curso</h2>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowModuleForm(true)}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg"
              >
                <PlusIcon className="w-5 h-5" />
                Adicionar Módulo
              </motion.button>
            </div>

            {/* Add Module Form */}
            <AnimatePresence>
              {showModuleForm && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-black/40 border border-purple-500/30 rounded-lg p-4 mb-6"
                >
                  <h3 className="text-lg font-semibold text-white mb-4">Novo Módulo</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-purple-300 mb-2">
                        Título do Módulo
                      </label>
                      <input
                        type="text"
                        value={moduleForm.title}
                        onChange={(e) => setModuleForm({ ...moduleForm, title: e.target.value })}
                        className="w-full px-4 py-3 bg-black/40 border border-purple-500/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                        placeholder="Digite o título do módulo"
                      />
                    </div>
                    
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-purple-300 mb-2">
                        Descrição
                      </label>
                      <textarea
                        value={moduleForm.description}
                        onChange={(e) => setModuleForm({ ...moduleForm, description: e.target.value })}
                        className="w-full px-4 py-3 bg-black/40 border border-purple-500/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 h-24 resize-none"
                        placeholder="Descreva o conteúdo deste módulo"
                      />
                    </div>
                    
                    <div className="md:col-span-2 flex gap-4">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleAddModule}
                        className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg font-semibold"
                      >
                        <CheckIcon className="w-5 h-5" />
                        Criar Módulo
                      </motion.button>
                      
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setShowModuleForm(false)}
                        className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-gray-600 to-gray-700 rounded-lg"
                      >
                        <XMarkIcon className="w-5 h-5" />
                        Cancelar
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Modules List */}
            <div className="space-y-4">
              {course.modules?.map((module, moduleIndex) => (
                <motion.div
                  key={module.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: moduleIndex * 0.1 }}
                  className="bg-gradient-to-r from-purple-600/10 to-blue-600/10 border border-purple-500/30 rounded-lg p-4"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-sm font-bold">
                        {moduleIndex + 1}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-white">{module.title}</h3>
                        <p className="text-gray-300 text-sm">{module.description}</p>
                        <p className="text-purple-400 text-xs mt-1">
                          {module.lessons?.length || 0} aulas
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setShowLessonForm(module.id)}
                        className="p-2 bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg"
                        title="Adicionar Aula"
                      >
                        <PlusIcon className="w-4 h-4" />
                      </motion.button>
                    </div>
                  </div>

                  {/* Add Lesson Form */}
                  <AnimatePresence>
                    {showLessonForm === module.id && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="bg-black/40 border border-purple-500/30 rounded-lg p-4 mb-4"
                      >
                        <h4 className="text-md font-semibold text-white mb-3">Nova Aula</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-purple-300 mb-2">
                              Título da Aula
                            </label>
                            <input
                              type="text"
                              value={lessonForm.title}
                              onChange={(e) => setLessonForm({ ...lessonForm, title: e.target.value })}
                              className="w-full px-4 py-2 bg-black/40 border border-purple-500/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
                              placeholder="Digite o título da aula"
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-purple-300 mb-2">
                              Tipo de Conteúdo
                            </label>
                            <select
                              value={lessonForm.type}
                              onChange={(e) => setLessonForm({ ...lessonForm, type: e.target.value as any })}
                              className="w-full px-4 py-2 bg-black/40 border border-purple-500/30 rounded-lg text-white focus:outline-none focus:border-purple-500"
                            >
                              <option value="video">Vídeo</option>
                              <option value="text">Texto</option>
                              <option value="quiz">Quiz</option>
                              <option value="assignment">Tarefa</option>
                              <option value="challenge">Desafio</option>
                              <option value="boss-battle">Boss Battle</option>
                            </select>
                          </div>
                          
                          <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-purple-300 mb-2">
                              Descrição
                            </label>
                            <textarea
                              value={lessonForm.description}
                              onChange={(e) => setLessonForm({ ...lessonForm, description: e.target.value })}
                              className="w-full px-4 py-2 bg-black/40 border border-purple-500/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 h-20 resize-none"
                              placeholder="Descreva o conteúdo da aula"
                            />
                          </div>
                          
                          {lessonForm.type === 'video' && (
                            <div>
                              <label className="block text-sm font-medium text-purple-300 mb-2">
                                URL do Vídeo
                              </label>
                              <input
                                type="url"
                                value={lessonForm.videoUrl}
                                onChange={(e) => setLessonForm({ ...lessonForm, videoUrl: e.target.value })}
                                className="w-full px-4 py-2 bg-black/40 border border-purple-500/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
                                placeholder="https://youtube.com/watch?v=..."
                              />
                            </div>
                          )}
                          
                          {lessonForm.type === 'text' && (
                            <div className="md:col-span-2">
                              <label className="block text-sm font-medium text-purple-300 mb-2">
                                Conteúdo do Texto
                              </label>
                              <textarea
                                value={lessonForm.content}
                                onChange={(e) => setLessonForm({ ...lessonForm, content: e.target.value })}
                                className="w-full px-4 py-2 bg-black/40 border border-purple-500/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 h-32 resize-none"
                                placeholder="Digite o conteúdo da aula..."
                              />
                            </div>
                          )}
                          
                          <div>
                            <label className="block text-sm font-medium text-purple-300 mb-2">
                              XP Recompensa
                            </label>
                            <input
                              type="number"
                              value={lessonForm.xpReward}
                              onChange={(e) => setLessonForm({ ...lessonForm, xpReward: parseInt(e.target.value) })}
                              className="w-full px-4 py-2 bg-black/40 border border-purple-500/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
                              placeholder="50"
                            />
                          </div>
                          
                          <div className="md:col-span-2 flex gap-3">
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => handleAddLesson(module.id)}
                              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg text-sm font-semibold"
                            >
                              <CheckIcon className="w-4 h-4" />
                              Criar Aula
                            </motion.button>
                            
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => setShowLessonForm(null)}
                              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-gray-600 to-gray-700 rounded-lg text-sm"
                            >
                              <XMarkIcon className="w-4 h-4" />
                              Cancelar
                            </motion.button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Lessons List */}
                  {module.lessons && module.lessons.length > 0 && (
                    <div className="space-y-2 mt-4">
                      <h4 className="text-sm font-medium text-purple-300 mb-3">Aulas:</h4>
                      {module.lessons.map((lesson, lessonIndex) => (
                        <motion.div
                          key={lesson.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: lessonIndex * 0.05 }}
                          className="flex items-center justify-between bg-black/20 border border-purple-500/20 rounded-lg p-3"
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 bg-gradient-to-r ${getLessonTypeColor(lesson.type)} rounded-lg flex items-center justify-center`}>
                              {getLessonTypeIcon(lesson.type)}
                            </div>
                            <div>
                              <h5 className="text-white font-medium text-sm">{lesson.title}</h5>
                              <p className="text-gray-400 text-xs">{lesson.description}</p>
                              <div className="flex items-center gap-2 mt-1">
                                <span className="text-xs px-2 py-1 bg-purple-600/30 rounded-full">
                                  {lesson.type}
                                </span>
                                <span className="text-xs text-yellow-400 flex items-center gap-1">
                                  <SparklesIcon className="w-3 h-3" />
                                  {lesson.xpReward} XP
                                </span>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </motion.div>
              ))}
            </div>

            {!course.modules || course.modules.length === 0 && (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <AcademicCapIcon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Nenhum módulo criado ainda</h3>
                <p className="text-gray-400 mb-4">Comece adicionando o primeiro módulo ao seu curso</p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowModuleForm(true)}
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg font-semibold mx-auto"
                >
                  <PlusIcon className="w-5 h-5" />
                  Criar Primeiro Módulo
                </motion.button>
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default CourseEditor
