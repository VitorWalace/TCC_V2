import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useGame, Course } from '../../contexts/GameContext'
import {
  ArrowLeftIcon,
  PlusIcon,
  EyeIcon,
  VideoCameraIcon,
  DocumentTextIcon,
  AcademicCapIcon,
  ClipboardDocumentListIcon,
  TrashIcon,
  PencilIcon,
  PlayIcon,
  SparklesIcon
} from '@heroicons/react/24/outline'
import { TrophyIcon, FireIcon } from '@heroicons/react/24/solid'

const CourseEditorNew: React.FC = () => {
  const { courseId } = useParams()
  const navigate = useNavigate()
  const { getCourseById, createCourse, updateCourse, addModule, addLesson, publishCourse } = useGame()

  const [course, setCourse] = useState<Course | null>(null)
  const [editingCourse, setEditingCourse] = useState(false)
  const [showModuleForm, setShowModuleForm] = useState(false)
  const [showLessonForm, setShowLessonForm] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const [courseForm, setCourseForm] = useState({
    title: '',
    description: '',
    difficulty: 'beginner' as 'beginner' | 'intermediate' | 'advanced',
    category: '',
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
    type: 'video' as 'video' | 'text' | 'quiz' | 'assignment',
    content: '',
    videoUrl: '',
    xpReward: 50,
    order: 1,
    questions: [] as any[]
  })

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)

    if (courseId && courseId !== 'new') {
      const foundCourse = getCourseById(courseId)
      if (foundCourse) {
        setCourse(foundCourse)
        setCourseForm({
          title: foundCourse.title,
          description: foundCourse.description,
          difficulty: foundCourse.difficulty,
          category: foundCourse.category || '',
          xpReward: foundCourse.xpReward || 100
        })
      }
    }

    return () => clearTimeout(timer)
  }, [courseId, getCourseById])

  const handleSaveCourse = async () => {
    try {
      if (course) {
        const updatedCourse = await updateCourse(course.id, courseForm)
        setCourse(updatedCourse)
      } else {
        const newCourse = await createCourse(courseForm)
        setCourse(newCourse)
        navigate(`/instructor/course-editor/${newCourse.id}`)
      }
      setEditingCourse(false)
    } catch (error) {
      console.error('Error saving course:', error)
    }
  }

  const handleAddModule = async () => {
    if (!course) return
    try {
      await addModule(course.id, { 
        ...moduleForm, 
        order: (course.modules?.length || 0) + 1 
      })
      const updatedCourse = getCourseById(course.id)
      if (updatedCourse) setCourse(updatedCourse)
      setModuleForm({ title: '', description: '', order: 1 })
      setShowModuleForm(false)
    } catch (error) {
      console.error('Error adding module:', error)
    }
  }

  const handleAddLesson = async (moduleId: string) => {
    if (!course) return
    try {
      const module = course.modules?.find(m => m.id === moduleId)
      await addLesson(moduleId, { 
        ...lessonForm, 
        order: (module?.lessons?.length || 0) + 1 
      })
      const updatedCourse = getCourseById(course.id)
      if (updatedCourse) setCourse(updatedCourse)
      setLessonForm({
        title: '', 
        description: '', 
        type: 'video', 
        content: '', 
        videoUrl: '',
        xpReward: 50, 
        order: 1, 
        questions: []
      })
      setShowLessonForm(null)
    } catch (error) {
      console.error('Error adding lesson:', error)
    }
  }

  const handlePublishCourse = async () => {
    if (!course) return
    try {
      await publishCourse(course.id)
      const updatedCourse = getCourseById(course.id)
      if (updatedCourse) setCourse(updatedCourse)
    } catch (error) {
      console.error('Error publishing course:', error)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <SparklesIcon className="w-16 h-16 mx-auto mb-4 text-purple-400 animate-spin" />
          <h2 className="text-2xl font-bold">Carregando Oficina...</h2>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      {/* Header */}
      <motion.div 
        className="bg-black/20 backdrop-blur-sm border-b border-purple-500/20"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 100 }}
      >
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <motion.button
                onClick={() => navigate('/instructor')}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg hover:from-purple-500 hover:to-blue-500 transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <ArrowLeftIcon className="w-5 h-5" />
                Voltar
              </motion.button>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  {course ? '🎮 Oficina Gamer' : '⚡ Nova Oficina'}
                </h1>
                <p className="text-purple-300 text-sm">
                  {course ? 'Edite sua aventura épica!' : 'Crie uma jornada incrível!'}
                </p>
              </div>
            </div>

            {course && (
              <div className="flex items-center gap-3">
                <motion.button
                  onClick={() => navigate(`/course/${course.id}`)}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg hover:from-green-500 hover:to-emerald-500 transition-all duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <EyeIcon className="w-5 h-5" />
                  Preview
                </motion.button>
                
                {!course.isPublished && (
                  <motion.button
                    onClick={handlePublishCourse}
                    className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500 rounded-lg font-bold text-black shadow-lg hover:shadow-xl transition-all duration-300"
                    whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(251, 191, 36, 0.5)" }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <TrophyIcon className="w-6 h-6" />
                    PUBLICAR AGORA!
                  </motion.button>
                )}
              </div>
            )}
          </div>
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Course Details Section */}
        <motion.div 
          className="bg-black/30 backdrop-blur-sm border border-purple-500/20 rounded-2xl p-8 mb-8 shadow-xl"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl flex items-center justify-center">
                <AcademicCapIcon className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-purple-300">Detalhes da Oficina</h2>
            </div>
            <motion.button
              onClick={() => setEditingCourse(!editingCourse)}
              className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
                editingCourse 
                  ? 'bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-500 hover:to-pink-500' 
                  : 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <PencilIcon className="w-5 h-5 inline mr-2" />
              {editingCourse ? 'Cancelar' : 'Editar'}
            </motion.button>
          </div>

          <AnimatePresence mode="wait">
            {editingCourse ? (
              <motion.div 
                className="space-y-6"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 50 }}
                transition={{ duration: 0.3 }}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-purple-300 mb-2">
                      🎯 Título da Oficina
                    </label>
                    <input
                      type="text"
                      value={courseForm.title}
                      onChange={(e) => setCourseForm({ ...courseForm, title: e.target.value })}
                      className="w-full px-4 py-3 bg-black/40 border border-purple-500/30 rounded-lg text-white placeholder-gray-400 focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 transition-all"
                      placeholder="Ex: JavaScript para Iniciantes"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-purple-300 mb-2">
                      📂 Categoria
                    </label>
                    <input
                      type="text"
                      value={courseForm.category}
                      onChange={(e) => setCourseForm({ ...courseForm, category: e.target.value })}
                      className="w-full px-4 py-3 bg-black/40 border border-purple-500/30 rounded-lg text-white placeholder-gray-400 focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 transition-all"
                      placeholder="Ex: Programação"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-purple-300 mb-2">
                    📝 Descrição Épica
                  </label>
                  <textarea
                    value={courseForm.description}
                    onChange={(e) => setCourseForm({ ...courseForm, description: e.target.value })}
                    className="w-full px-4 py-4 bg-black/40 border border-purple-500/30 rounded-lg text-white placeholder-gray-400 focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 transition-all h-32 resize-none"
                    placeholder="Descreva sua oficina de forma envolvente e inspiradora..."
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-purple-300 mb-2">
                      ⚡ Nível de Dificuldade
                    </label>
                    <select
                      value={courseForm.difficulty}
                      onChange={(e) => setCourseForm({ ...courseForm, difficulty: e.target.value as any })}
                      className="w-full px-4 py-3 bg-black/40 border border-purple-500/30 rounded-lg text-white focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 transition-all"
                    >
                      <option value="beginner">🟢 Iniciante</option>
                      <option value="intermediate">🟡 Intermediário</option>
                      <option value="advanced">🔴 Avançado</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-purple-300 mb-2">
                      💎 XP de Recompensa
                    </label>
                    <input
                      type="number"
                      value={courseForm.xpReward}
                      onChange={(e) => setCourseForm({ ...courseForm, xpReward: parseInt(e.target.value) })}
                      className="w-full px-4 py-3 bg-black/40 border border-purple-500/30 rounded-lg text-white focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 transition-all"
                      min="50"
                      step="50"
                    />
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <motion.button
                    onClick={handleSaveCourse}
                    className="px-8 py-3 bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg text-white font-semibold hover:from-green-500 hover:to-emerald-500 transition-all duration-300"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    💾 Salvar Alterações
                  </motion.button>
                  <motion.button
                    onClick={() => setEditingCourse(false)}
                    className="px-8 py-3 bg-gray-600 rounded-lg text-white font-semibold hover:bg-gray-500 transition-all duration-300"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    ❌ Cancelar
                  </motion.button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 50 }}
                transition={{ duration: 0.3 }}
              >
                <div className="mb-6">
                  <h3 className="text-3xl font-bold text-white mb-3 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                    {course?.title || courseForm.title || '🎯 Título da Oficina'}
                  </h3>
                  <p className="text-gray-300 text-lg leading-relaxed mb-4">
                    {course?.description || courseForm.description || 'Descrição incrível da sua oficina...'}
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      courseForm.difficulty === 'beginner' ? 'bg-green-500/20 text-green-400' :
                      courseForm.difficulty === 'intermediate' ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-red-500/20 text-red-400'
                    }`}>
                      {courseForm.difficulty === 'beginner' ? '🟢 Iniciante' :
                       courseForm.difficulty === 'intermediate' ? '🟡 Intermediário' : '🔴 Avançado'}
                    </span>
                    {courseForm.category && (
                      <span className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-full text-sm font-semibold">
                        📂 {courseForm.category}
                      </span>
                    )}
                    <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm font-semibold">
                      💎 {courseForm.xpReward} XP
                    </span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Modules Section */}
        {course && (
          <motion.div 
            className="bg-black/30 backdrop-blur-sm border border-purple-500/20 rounded-2xl p-8 shadow-xl"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-xl flex items-center justify-center">
                  <AcademicCapIcon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-cyan-300">
                    Módulos de Batalha ({course.modules?.length || 0})
                  </h2>
                  <p className="text-gray-400 text-sm">Organize suas lições em módulos épicos!</p>
                </div>
              </div>
              <motion.button
                onClick={() => setShowModuleForm(true)}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg text-white font-semibold hover:from-green-500 hover:to-emerald-500 transition-all duration-300 shadow-lg"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <PlusIcon className="w-5 h-5" />
                ⚡ Novo Módulo
              </motion.button>
            </div>

            {/* Add Module Form */}
            <AnimatePresence>
              {showModuleForm && (
                <motion.div 
                  className="bg-black/40 border border-cyan-500/30 rounded-xl p-6 mb-8"
                  initial={{ opacity: 0, scale: 0.95, y: -20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <h3 className="text-xl text-white mb-6 flex items-center gap-2">
                    <SparklesIcon className="w-6 h-6 text-cyan-400" />
                    🚀 Criar Novo Módulo Épico
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-cyan-300 mb-2">
                        📚 Nome do Módulo
                      </label>
                      <input
                        type="text"
                        value={moduleForm.title}
                        onChange={(e) => setModuleForm({ ...moduleForm, title: e.target.value })}
                        className="w-full px-4 py-3 bg-black/40 border border-cyan-500/30 rounded-lg text-white placeholder-gray-400 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all"
                        placeholder="Ex: Fundamentos do JavaScript"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-cyan-300 mb-2">
                        📝 Descrição do Módulo
                      </label>
                      <textarea
                        value={moduleForm.description}
                        onChange={(e) => setModuleForm({ ...moduleForm, description: e.target.value })}
                        className="w-full px-4 py-3 bg-black/40 border border-cyan-500/30 rounded-lg text-white placeholder-gray-400 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all h-24 resize-none"
                        placeholder="Descreva o que os alunos aprenderão neste módulo..."
                      />
                    </div>
                    <div className="flex gap-4 pt-2">
                      <motion.button 
                        onClick={handleAddModule} 
                        className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg text-white font-semibold hover:from-green-500 hover:to-emerald-500 transition-all duration-300"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        🎯 Criar Módulo
                      </motion.button>
                      <motion.button 
                        onClick={() => setShowModuleForm(false)} 
                        className="px-6 py-3 bg-gray-600 rounded-lg text-white font-semibold hover:bg-gray-500 transition-all duration-300"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        ❌ Cancelar
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Modules List */}
            <div className="space-y-6">
              {course.modules?.map((module, index) => (
                <motion.div 
                  key={module.id} 
                  className="bg-gradient-to-r from-purple-600/10 via-blue-600/10 to-cyan-600/10 border border-purple-500/30 rounded-xl p-6 hover:border-purple-400/50 transition-all duration-300"
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center font-bold text-white">
                        {index + 1}
                      </div>
                      <div>
                        <h3 className="text-xl text-white font-bold mb-2">📚 {module.title}</h3>
                        <p className="text-gray-300 mb-3 leading-relaxed">{module.description}</p>
                        <div className="flex items-center gap-4 text-sm">
                          <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full font-semibold">
                            🎯 {module.lessons?.length || 0} aulas
                          </span>
                          <span className="text-purple-400">Módulo {module.order}</span>
                        </div>
                      </div>
                    </div>
                    <motion.button
                      onClick={() => setShowLessonForm(module.id)}
                      className="px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg text-white text-sm font-semibold hover:from-green-500 hover:to-emerald-500 transition-all duration-300"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <PlusIcon className="w-4 h-4 inline mr-1" />
                      ⚡ Nova Aula
                    </motion.button>
                  </div>

                  {/* Add Lesson Form */}
                  <AnimatePresence>
                    {showLessonForm === module.id && (
                      <motion.div 
                        className="bg-black/40 border border-green-500/30 rounded-lg p-6 mb-6"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <h4 className="text-lg text-white mb-4 flex items-center gap-2">
                          <PlayIcon className="w-5 h-5 text-green-400" />
                          🎬 Nova Aula Épica
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div>
                            <label className="block text-sm font-semibold text-green-300 mb-2">
                              🎯 Título da Aula
                            </label>
                            <input
                              type="text"
                              value={lessonForm.title}
                              onChange={(e) => setLessonForm({ ...lessonForm, title: e.target.value })}
                              className="w-full px-4 py-2 bg-black/40 border border-green-500/30 rounded-lg text-white placeholder-gray-400 focus:border-green-400 focus:ring-2 focus:ring-green-400/20 transition-all"
                              placeholder="Ex: Variáveis em JavaScript"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-semibold text-green-300 mb-2">
                              🎮 Tipo de Conteúdo
                            </label>
                            <select
                              value={lessonForm.type}
                              onChange={(e) => setLessonForm({ ...lessonForm, type: e.target.value as any })}
                              className="w-full px-4 py-2 bg-black/40 border border-green-500/30 rounded-lg text-white focus:border-green-400 focus:ring-2 focus:ring-green-400/20 transition-all"
                            >
                              <option value="video">🎬 Vídeo</option>
                              <option value="text">📝 Texto/Artigo</option>
                              <option value="quiz">🧩 Quiz</option>
                              <option value="assignment">📋 Tarefa</option>
                            </select>
                          </div>
                        </div>

                        <div className="mb-4">
                          <label className="block text-sm font-semibold text-green-300 mb-2">
                            📝 Descrição da Aula
                          </label>
                          <textarea
                            value={lessonForm.description}
                            onChange={(e) => setLessonForm({ ...lessonForm, description: e.target.value })}
                            className="w-full px-4 py-2 bg-black/40 border border-green-500/30 rounded-lg text-white placeholder-gray-400 focus:border-green-400 focus:ring-2 focus:ring-green-400/20 transition-all h-20 resize-none"
                            placeholder="Descreva o que será ensinado nesta aula..."
                          />
                        </div>

                        {lessonForm.type === 'video' && (
                          <div className="mb-4">
                            <label className="block text-sm font-semibold text-green-300 mb-2">
                              🎬 URL do Vídeo
                            </label>
                            <input
                              type="url"
                              value={lessonForm.videoUrl}
                              onChange={(e) => setLessonForm({ ...lessonForm, videoUrl: e.target.value })}
                              className="w-full px-4 py-2 bg-black/40 border border-green-500/30 rounded-lg text-white placeholder-gray-400 focus:border-green-400 focus:ring-2 focus:ring-green-400/20 transition-all"
                              placeholder="https://youtube.com/watch?v=..."
                            />
                          </div>
                        )}

                        {lessonForm.type === 'text' && (
                          <div className="mb-4">
                            <label className="block text-sm font-semibold text-green-300 mb-2">
                              📄 Conteúdo da Aula
                            </label>
                            <textarea
                              value={lessonForm.content}
                              onChange={(e) => setLessonForm({ ...lessonForm, content: e.target.value })}
                              className="w-full px-4 py-2 bg-black/40 border border-green-500/30 rounded-lg text-white placeholder-gray-400 focus:border-green-400 focus:ring-2 focus:ring-green-400/20 transition-all h-32 resize-none"
                              placeholder="Digite o conteúdo completo da aula aqui..."
                            />
                          </div>
                        )}

                        <div className="flex gap-3">
                          <motion.button
                            onClick={() => handleAddLesson(module.id)}
                            className="px-6 py-2 bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg text-white text-sm font-semibold hover:from-green-500 hover:to-emerald-500 transition-all duration-300"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            🎯 Criar Aula
                          </motion.button>
                          <motion.button
                            onClick={() => setShowLessonForm(null)}
                            className="px-6 py-2 bg-gray-600 rounded-lg text-white text-sm font-semibold hover:bg-gray-500 transition-all duration-300"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            ❌ Cancelar
                          </motion.button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Lessons List */}
                  {module.lessons && module.lessons.length > 0 && (
                    <div>
                      <h4 className="text-sm text-purple-300 mb-4 font-semibold flex items-center gap-2">
                        <PlayIcon className="w-4 h-4" />
                        🎯 Aulas do Módulo:
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {module.lessons.map((lesson, lessonIndex) => (
                          <motion.div 
                            key={lesson.id} 
                            className="bg-black/20 border border-purple-500/20 rounded-lg p-4 hover:border-purple-400/40 hover:bg-black/30 transition-all duration-300"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: lessonIndex * 0.05 }}
                            whileHover={{ scale: 1.02 }}
                          >
                            <div className="flex items-start gap-3">
                              <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" style={{
                                background: lesson.type === 'video' ? 'linear-gradient(135deg, #ef4444, #dc2626)' :
                                          lesson.type === 'text' ? 'linear-gradient(135deg, #06b6d4, #0891b2)' :
                                          lesson.type === 'quiz' ? 'linear-gradient(135deg, #f59e0b, #d97706)' :
                                          'linear-gradient(135deg, #10b981, #059669)'
                              }}>
                                {lesson.type === 'video' && <VideoCameraIcon className="w-5 h-5 text-white" />}
                                {lesson.type === 'text' && <DocumentTextIcon className="w-5 h-5 text-white" />}
                                {lesson.type === 'quiz' && <ClipboardDocumentListIcon className="w-5 h-5 text-white" />}
                                {lesson.type === 'assignment' && <AcademicCapIcon className="w-5 h-5 text-white" />}
                              </div>
                              <div className="flex-1 min-w-0">
                                <h5 className="text-white font-semibold text-sm mb-1 leading-tight">
                                  {lesson.title}
                                </h5>
                                <p className="text-gray-400 text-xs mb-2 line-clamp-2 leading-relaxed">
                                  {lesson.description}
                                </p>
                                <div className="flex items-center justify-between">
                                  <span className="text-xs px-2 py-1 rounded-full font-medium" style={{
                                    backgroundColor: lesson.type === 'video' ? 'rgba(239, 68, 68, 0.2)' :
                                                   lesson.type === 'text' ? 'rgba(6, 182, 212, 0.2)' :
                                                   lesson.type === 'quiz' ? 'rgba(245, 158, 11, 0.2)' :
                                                   'rgba(16, 185, 129, 0.2)',
                                    color: lesson.type === 'video' ? '#fca5a5' :
                                          lesson.type === 'text' ? '#67e8f9' :
                                          lesson.type === 'quiz' ? '#fcd34d' :
                                          '#6ee7b7'
                                  }}>
                                    {lesson.type === 'video' && '🎬 Vídeo'}
                                    {lesson.type === 'text' && '📝 Texto'}
                                    {lesson.type === 'quiz' && '🧩 Quiz'}
                                    {lesson.type === 'assignment' && '📋 Tarefa'}
                                  </span>
                                  <span className="text-xs text-purple-400 font-medium">
                                    💎 {lesson.xpReward}XP
                                  </span>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  )}

                  {(!module.lessons || module.lessons.length === 0) && (
                    <div className="text-center py-8 border-2 border-dashed border-purple-500/30 rounded-lg">
                      <AcademicCapIcon className="w-12 h-12 text-purple-400 mx-auto mb-3" />
                      <p className="text-gray-400 mb-4">Este módulo ainda não possui aulas</p>
                      <motion.button
                        onClick={() => setShowLessonForm(module.id)}
                        className="px-4 py-2 bg-green-600 rounded-lg text-white text-sm hover:bg-green-500 transition-colors"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        ➕ Adicionar Primeira Aula
                      </motion.button>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>

            {/* Empty State */}
            {(!course.modules || course.modules.length === 0) && (
              <motion.div 
                className="text-center py-16 border-2 border-dashed border-purple-500/30 rounded-xl"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
              >
                <div className="w-20 h-20 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <AcademicCapIcon className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl text-white mb-3 font-bold">🚀 Hora de Criar Magia!</h3>
                <p className="text-gray-400 mb-6 max-w-md mx-auto">
                  Sua oficina está esperando por módulos incríveis! Comece criando o primeiro módulo e transforme conhecimento em aventura.
                </p>
                <motion.button
                  onClick={() => setShowModuleForm(true)}
                  className="px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl text-white font-bold text-lg hover:from-green-500 hover:to-emerald-500 transition-all duration-300 shadow-lg"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  ⚡ Criar Primeiro Módulo
                </motion.button>
              </motion.div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default CourseEditorNew
