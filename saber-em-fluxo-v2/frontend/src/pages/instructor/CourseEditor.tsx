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
    thumbnail: '📚',
    category: '',
    difficulty: 'comum' as Course['difficulty']
  })

  const [moduleForm, setModuleForm] = useState({
    title: '',
    description: '',
    order: 1
  })

  const [lessonForm, setLessonForm] = useState({
    title: '',
    type: 'video' as Lesson['type'],
    duration: 10,
    xp: 100,
    content: '',
    videoUrl: '',
    textContent: '',
    order: 1
  })

  useEffect(() => {
    if (courseId && courseId !== 'new') {
      const foundCourse = getCourseById(courseId)
      if (foundCourse) {
        setCourse(foundCourse)
        setCourseForm({
          title: foundCourse.title,
          description: foundCourse.description,
          thumbnail: foundCourse.thumbnail,
          category: foundCourse.category,
          difficulty: foundCourse.difficulty
        })
      }
    } else if (courseId === 'new') {
      // Creating new course
      const newCourse = createCourse({
        title: 'Novo Curso',
        description: 'Descrição do curso...',
        thumbnail: '📚',
        category: 'Geral',
        difficulty: 'comum'
      })
      setCourse(newCourse)
      navigate(`/instructor/course/${newCourse.id}/edit`, { replace: true })
    }
  }, [courseId])

  const handleSaveCourse = () => {
    if (course) {
      updateCourse(course.id, courseForm)
      setCourse({ ...course, ...courseForm })
      setEditingCourse(false)
    }
  }

  const handleAddModule = () => {
    if (course) {
      addModule(course.id, {
        ...moduleForm,
        order: course.modules.length + 1
      })
      setModuleForm({ title: '', description: '', order: 1 })
      setShowModuleForm(false)
      // Refresh course
      const updatedCourse = getCourseById(course.id)
      if (updatedCourse) setCourse(updatedCourse)
    }
  }

  const handleAddLesson = (moduleId: string) => {
    if (course) {
      const module = course.modules.find(m => m.id === moduleId)
      addLesson(course.id, moduleId, {
        ...lessonForm,
        order: module ? module.lessons.length + 1 : 1
      })
      setLessonForm({
        title: '',
        type: 'video',
        duration: 10,
        xp: 100,
        content: '',
        videoUrl: '',
        textContent: '',
        order: 1
      })
      setShowLessonForm(null)
      // Refresh course
      const updatedCourse = getCourseById(course.id)
      if (updatedCourse) setCourse(updatedCourse)
    }
  }

  const handlePublishCourse = () => {
    if (course && !course.published) {
      publishCourse(course.id)
      setCourse({ ...course, published: true })
    }
  }

  const getLessonIcon = (type: Lesson['type']) => {
    switch (type) {
      case 'video':
        return <VideoCameraIcon className="w-5 h-5" />
      case 'text':
        return <DocumentTextIcon className="w-5 h-5" />
      case 'quiz':
        return <ClipboardDocumentListIcon className="w-5 h-5" />
      case 'challenge':
        return <BoltIcon className="w-5 h-5" />
      case 'boss':
        return <span className="text-lg">👹</span>
      default:
        return <PlayIcon className="w-5 h-5" />
    }
  }

  const getDifficultyColor = (difficulty: Course['difficulty']) => {
    switch (difficulty) {
      case 'comum':
        return 'from-gray-500 to-gray-600'
      case 'raro':
        return 'from-blue-500 to-cyan-500'
      case 'épico':
        return 'from-purple-500 to-pink-500'
      case 'lendário':
        return 'from-yellow-500 to-orange-500'
    }
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-center">
          <SparklesIcon className="w-16 h-16 mx-auto mb-4 text-purple-400 animate-spin" />
          <h2 className="text-2xl font-bold">Carregando Oficina...</h2>
        </div>
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-4 pb-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div className="flex items-center gap-4">
            <motion.button
              onClick={() => navigate('/instructor')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 bg-purple-600/20 rounded-lg text-purple-300 hover:bg-purple-600/30 border border-purple-500/30"
            >
              <ArrowLeftIcon className="w-6 h-6" />
            </motion.button>
            
            <div>
              <h1 className="text-3xl font-black text-white flex items-center gap-3">
                <span className="text-4xl">⚡</span>
                OFICINA DE DESAFIOS
              </h1>
              <p className="text-purple-200">Construa experiências de aprendizado épicas</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <motion.button
              onClick={() => navigate(`/courses/${course.id}`)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600/20 text-blue-300 rounded-lg hover:bg-blue-600/30 border border-blue-500/30"
            >
              <EyeIcon className="w-5 h-5" />
              Preview
            </motion.button>
            
            {!course.published && (
              <motion.button
                onClick={handlePublishCourse}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg font-bold shadow-lg border-2 border-green-300"
              >
                <CheckIcon className="w-5 h-5" />
                PUBLICAR CURSO
              </motion.button>
            )}
            
            {course.published && (
              <div className="flex items-center gap-2 px-4 py-2 bg-green-500/20 text-green-300 rounded-lg border border-green-500/30">
                <CheckIcon className="w-5 h-5" />
                Publicado
              </div>
            )}
          </div>
        </motion.div>

        {/* Course Details */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-6 mb-8"
        >
          {editingCourse ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-white font-bold mb-2">Título do Curso</label>
                  <input
                    type="text"
                    value={courseForm.title}
                    onChange={(e) => setCourseForm(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full bg-slate-800 border-2 border-purple-400 rounded-lg px-4 py-3 text-white font-bold placeholder-purple-300 focus:outline-none focus:border-yellow-400 transition-colors"
                    placeholder="Nome épico do seu curso..."
                  />
                </div>
                <div>
                  <label className="block text-white font-bold mb-2">Categoria</label>
                  <select
                    value={courseForm.category}
                    onChange={(e) => setCourseForm(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full bg-slate-800 border-2 border-purple-400 rounded-lg px-4 py-3 text-white font-bold focus:outline-none focus:border-yellow-400 transition-colors"
                  >
                    <option value="Frontend">Frontend</option>
                    <option value="Backend">Backend</option>
                    <option value="Fullstack">Fullstack</option>
                    <option value="Mobile">Mobile</option>
                    <option value="Data Science">Data Science</option>
                    <option value="DevOps">DevOps</option>
                    <option value="Design">Design</option>
                    <option value="Geral">Geral</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-white font-bold mb-2">Emoji/Ícone</label>
                  <input
                    type="text"
                    value={courseForm.thumbnail}
                    onChange={(e) => setCourseForm(prev => ({ ...prev, thumbnail: e.target.value }))}
                    className="w-full bg-slate-800 border-2 border-purple-400 rounded-lg px-4 py-3 text-white font-bold text-center text-2xl focus:outline-none focus:border-yellow-400 transition-colors"
                    maxLength={2}
                  />
                </div>
                <div>
                  <label className="block text-white font-bold mb-2">Dificuldade</label>
                  <select
                    value={courseForm.difficulty}
                    onChange={(e) => setCourseForm(prev => ({ ...prev, difficulty: e.target.value as Course['difficulty'] }))}
                    className="w-full bg-slate-800 border-2 border-purple-400 rounded-lg px-4 py-3 text-white font-bold focus:outline-none focus:border-yellow-400 transition-colors"
                  >
                    <option value="comum">COMUM</option>
                    <option value="raro">RARO</option>
                    <option value="épico">ÉPICO</option>
                    <option value="lendário">LENDÁRIO</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-white font-bold mb-2">Descrição</label>
                <textarea
                  value={courseForm.description}
                  onChange={(e) => setCourseForm(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full bg-slate-800 border-2 border-purple-400 rounded-lg px-4 py-3 text-white font-bold placeholder-purple-300 focus:outline-none focus:border-yellow-400 transition-colors resize-none"
                  rows={3}
                  placeholder="Descreva a jornada épica que os estudantes viverão..."
                />
              </div>

              <div className="flex gap-3">
                <motion.button
                  onClick={handleSaveCourse}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-lg font-bold"
                >
                  <CheckIcon className="w-5 h-5" />
                  Salvar
                </motion.button>
                <motion.button
                  onClick={() => setEditingCourse(false)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-2 px-6 py-2 bg-gray-600 text-white rounded-lg font-bold"
                >
                  <XMarkIcon className="w-5 h-5" />
                  Cancelar
                </motion.button>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={`text-6xl p-4 rounded-2xl bg-gradient-to-br ${getDifficultyColor(course.difficulty)}`}>
                  {course.thumbnail}
                </div>
                <div>
                  <h2 className="text-2xl font-black text-white">{course.title}</h2>
                  <p className="text-purple-200 mb-2">{course.description}</p>
                  <div className="flex items-center gap-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase bg-gradient-to-r ${getDifficultyColor(course.difficulty)} text-white`}>
                      {course.difficulty}
                    </span>
                    <span className="text-purple-300 text-sm">{course.category}</span>
                    <span className="text-purple-300 text-sm">{course.modules.length} módulos</span>
                  </div>
                </div>
              </div>
              <motion.button
                onClick={() => setEditingCourse(true)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-3 bg-purple-600/20 rounded-lg text-purple-300 hover:bg-purple-600/30 border border-purple-500/30"
              >
                <PencilIcon className="w-6 h-6" />
              </motion.button>
            </div>
          )}
        </motion.div>

        {/* Modules Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-6"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-black text-white flex items-center gap-2">
              <AcademicCapIcon className="w-8 h-8 text-yellow-400" />
              MÓDULOS DO CURSO
            </h3>
            <motion.button
              onClick={() => setShowModuleForm(true)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg font-bold border-2 border-green-300"
            >
              <PlusIcon className="w-5 h-5" />
              Novo Módulo
            </motion.button>
          </div>

          {/* Add Module Form */}
          <AnimatePresence>
            {showModuleForm && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-green-500/10 backdrop-blur-lg rounded-xl border border-green-500/30 p-6"
              >
                <h4 className="text-xl font-bold text-green-300 mb-4">➕ Criar Novo Módulo</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-white font-bold mb-2">Título do Módulo</label>
                    <input
                      type="text"
                      value={moduleForm.title}
                      onChange={(e) => setModuleForm(prev => ({ ...prev, title: e.target.value }))}
                      className="w-full bg-slate-800 border-2 border-green-400 rounded-lg px-4 py-3 text-white font-bold placeholder-green-300 focus:outline-none focus:border-yellow-400 transition-colors"
                      placeholder="Nome do módulo..."
                    />
                  </div>
                  <div>
                    <label className="block text-white font-bold mb-2">Ordem</label>
                    <input
                      type="number"
                      value={moduleForm.order}
                      onChange={(e) => setModuleForm(prev => ({ ...prev, order: Number(e.target.value) }))}
                      className="w-full bg-slate-800 border-2 border-green-400 rounded-lg px-4 py-3 text-white font-bold focus:outline-none focus:border-yellow-400 transition-colors"
                      min="1"
                    />
                  </div>
                </div>
                <div className="mb-4">
                  <label className="block text-white font-bold mb-2">Descrição</label>
                  <textarea
                    value={moduleForm.description}
                    onChange={(e) => setModuleForm(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full bg-slate-800 border-2 border-green-400 rounded-lg px-4 py-3 text-white font-bold placeholder-green-300 focus:outline-none focus:border-yellow-400 transition-colors resize-none"
                    rows={2}
                    placeholder="Descrição do módulo..."
                  />
                </div>
                <div className="flex gap-3">
                  <motion.button
                    onClick={handleAddModule}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-lg font-bold"
                  >
                    <CheckIcon className="w-5 h-5" />
                    Criar Módulo
                  </motion.button>
                  <motion.button
                    onClick={() => setShowModuleForm(false)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-2 px-6 py-2 bg-gray-600 text-white rounded-lg font-bold"
                  >
                    <XMarkIcon className="w-5 h-5" />
                    Cancelar
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Modules List */}
          <div className="space-y-4">
            {course.modules.map((module, moduleIndex) => (
              <motion.div
                key={module.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: moduleIndex * 0.1 }}
                className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h4 className="text-xl font-bold text-white">
                      {module.order}. {module.title}
                    </h4>
                    <p className="text-purple-200">{module.description}</p>
                    <p className="text-sm text-purple-300 mt-1">
                      {module.lessons.length} aulas
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <motion.button
                      onClick={() => setShowLessonForm(module.id)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="p-2 bg-blue-600/20 rounded-lg text-blue-300 hover:bg-blue-600/30 border border-blue-500/30"
                    >
                      <PlusIcon className="w-5 h-5" />
                    </motion.button>
                    <motion.button
                      onClick={() => deleteModule(course.id, module.id)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="p-2 bg-red-600/20 rounded-lg text-red-300 hover:bg-red-600/30 border border-red-500/30"
                    >
                      <TrashIcon className="w-5 h-5" />
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
                      className="bg-blue-500/10 backdrop-blur-lg rounded-lg border border-blue-500/30 p-4 mb-4"
                    >
                      <h5 className="text-lg font-bold text-blue-300 mb-3">➕ Nova Aula</h5>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
                        <div>
                          <label className="block text-white font-bold mb-1 text-sm">Título</label>
                          <input
                            type="text"
                            value={lessonForm.title}
                            onChange={(e) => setLessonForm(prev => ({ ...prev, title: e.target.value }))}
                            className="w-full bg-slate-800 border-2 border-blue-400 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-yellow-400 transition-colors"
                            placeholder="Nome da aula..."
                          />
                        </div>
                        <div>
                          <label className="block text-white font-bold mb-1 text-sm">Tipo</label>
                          <select
                            value={lessonForm.type}
                            onChange={(e) => setLessonForm(prev => ({ ...prev, type: e.target.value as Lesson['type'] }))}
                            className="w-full bg-slate-800 border-2 border-blue-400 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-yellow-400 transition-colors"
                          >
                            <option value="video">📹 Vídeo</option>
                            <option value="text">📄 Texto</option>
                            <option value="quiz">❓ Quiz</option>
                            <option value="challenge">⚡ Desafio</option>
                            <option value="boss">👹 Boss Battle</option>
                            <option value="assignment">📝 Tarefa</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-white font-bold mb-1 text-sm">Duração (min)</label>
                          <input
                            type="number"
                            value={lessonForm.duration}
                            onChange={(e) => setLessonForm(prev => ({ ...prev, duration: Number(e.target.value) }))}
                            className="w-full bg-slate-800 border-2 border-blue-400 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-yellow-400 transition-colors"
                            min="1"
                          />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                        <div>
                          <label className="block text-white font-bold mb-1 text-sm">XP Reward</label>
                          <input
                            type="number"
                            value={lessonForm.xp}
                            onChange={(e) => setLessonForm(prev => ({ ...prev, xp: Number(e.target.value) }))}
                            className="w-full bg-slate-800 border-2 border-blue-400 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-yellow-400 transition-colors"
                            min="10"
                            step="10"
                          />
                        </div>
                        {lessonForm.type === 'video' && (
                          <div>
                            <label className="block text-white font-bold mb-1 text-sm">URL do Vídeo</label>
                            <input
                              type="url"
                              value={lessonForm.videoUrl}
                              onChange={(e) => setLessonForm(prev => ({ ...prev, videoUrl: e.target.value }))}
                              className="w-full bg-slate-800 border-2 border-blue-400 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-yellow-400 transition-colors"
                              placeholder="https://..."
                            />
                          </div>
                        )}
                      </div>

                      <div className="mb-3">
                        <label className="block text-white font-bold mb-1 text-sm">Conteúdo</label>
                        <textarea
                          value={lessonForm.content}
                          onChange={(e) => setLessonForm(prev => ({ ...prev, content: e.target.value }))}
                          className="w-full bg-slate-800 border-2 border-blue-400 rounded-lg px-3 py-2 text-white text-sm resize-none focus:outline-none focus:border-yellow-400 transition-colors"
                          rows={3}
                          placeholder="Conteúdo da aula, instruções, código, etc..."
                        />
                      </div>

                      <div className="flex gap-2">
                        <motion.button
                          onClick={() => handleAddLesson(module.id)}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="flex items-center gap-1 px-4 py-2 bg-blue-600 text-white rounded-lg font-bold text-sm"
                        >
                          <CheckIcon className="w-4 h-4" />
                          Criar
                        </motion.button>
                        <motion.button
                          onClick={() => setShowLessonForm(null)}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="flex items-center gap-1 px-4 py-2 bg-gray-600 text-white rounded-lg font-bold text-sm"
                        >
                          <XMarkIcon className="w-4 h-4" />
                          Cancelar
                        </motion.button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Lessons List */}
                <div className="space-y-2">
                  {module.lessons.map((lesson, lessonIndex) => (
                    <motion.div
                      key={lesson.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: lessonIndex * 0.05 }}
                      className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg border border-slate-700"
                    >
                      <div className="flex items-center gap-3">
                        <div className="text-purple-400">
                          {getLessonIcon(lesson.type)}
                        </div>
                        <div>
                          <h6 className="text-white font-semibold">{lesson.title}</h6>
                          <div className="flex items-center gap-4 text-sm text-purple-300">
                            <span>{lesson.duration} min</span>
                            <span>{lesson.xp} XP</span>
                            <span className="capitalize">{lesson.type}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <motion.button
                          onClick={() => deleteLesson(course.id, module.id, lesson.id)}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="p-1 bg-red-600/20 rounded text-red-300 hover:bg-red-600/30"
                        >
                          <TrashIcon className="w-4 h-4" />
                        </motion.button>
                      </div>
                    </motion.div>
                  ))}

                  {module.lessons.length === 0 && (
                    <div className="text-center py-8 text-purple-400">
                      <AcademicCapIcon className="w-12 h-12 mx-auto mb-2 opacity-50" />
                      <p>Nenhuma aula criada ainda</p>
                      <p className="text-sm">Clique no botão + para adicionar a primeira aula</p>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}

            {course.modules.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-16 text-purple-400"
              >
                <SparklesIcon className="w-20 h-20 mx-auto mb-4 opacity-50" />
                <h4 className="text-2xl font-bold mb-2">Comece Sua Jornada Criativa!</h4>
                <p className="text-lg mb-6">Crie o primeiro módulo para dar vida ao seu curso</p>
                <motion.button
                  onClick={() => setShowModuleForm(true)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-2 mx-auto px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-bold text-lg border-2 border-purple-300 shadow-lg"
                >
                  <PlusIcon className="w-6 h-6" />
                  CRIAR PRIMEIRO MÓDULO
                </motion.button>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
          </div>
        </motion.div>

        {/* Lessons Workshop */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white/5 backdrop-blur-lg rounded-2xl border-2 border-white/20 p-8"
        >
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-black text-white flex items-center gap-3">
              <WrenchScrewdriverIcon className="w-8 h-8 text-orange-400" />
              ARSENAL DE DESAFIOS ({course.lessons.length})
            </h2>
            
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowLessonForm(true)}
              className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-3 rounded-xl font-black shadow-lg border-2 border-green-300"
            >
              <div className="flex items-center gap-2">
                <PlusIcon className="w-5 h-5" />
                NOVO DESAFIO
              </div>
            </motion.button>
          </div>

          {/* Lesson Creation Form */}
          {showLessonForm && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-gradient-to-br from-slate-800 to-purple-800 rounded-2xl p-6 mb-8 border-2 border-purple-400"
            >
              <h3 className="text-xl font-black text-white mb-4 flex items-center gap-2">
                <SparklesIcon className="w-6 h-6 text-yellow-400" />
                FORJANDO NOVO DESAFIO
              </h3>
              
              <form onSubmit={handleAddLesson}>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-bold text-purple-200 mb-2">
                      Nome do Desafio
                    </label>
                    <input
                      type="text"
                      value={newLesson.title}
                      onChange={(e) => setNewLesson(prev => ({ ...prev, title: e.target.value }))}
                      className="w-full bg-slate-700 border-2 border-gray-600 rounded-lg px-3 py-2 text-white font-bold focus:outline-none focus:border-yellow-400"
                      placeholder="Ex: Batalha dos Arrays"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-bold text-purple-200 mb-2">
                      Tipo de Missão
                    </label>
                    <select
                      value={newLesson.type}
                      onChange={(e) => setNewLesson(prev => ({ ...prev, type: e.target.value as Lesson['type'] }))}
                      className="w-full bg-slate-700 border-2 border-gray-600 rounded-lg px-3 py-2 text-white font-bold focus:outline-none focus:border-yellow-400"
                    >
                      <option value="text">📜 Pergaminho</option>
                      <option value="video">🎬 Visão Mística</option>
                      <option value="challenge">⚡ Desafio</option>
                      <option value="boss">👹 Boss Battle</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-purple-200 mb-2">
                      Recompensa XP
                    </label>
                    <input
                      type="number"
                      min="50"
                      max="1000"
                      step="50"
                      value={newLesson.xp}
                      onChange={(e) => setNewLesson(prev => ({ ...prev, xp: parseInt(e.target.value) }))}
                      className="w-full bg-slate-700 border-2 border-gray-600 rounded-lg px-3 py-2 text-white font-bold focus:outline-none focus:border-yellow-400"
                    />
                  </div>
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-bold text-purple-200 mb-2">
                    {newLesson.type === 'video' ? 'Portal Mágico (URL)' : 'Conteúdo do Desafio'}
                  </label>
                  {newLesson.type === 'video' ? (
                    <input
                      type="url"
                      value={newLesson.content}
                      onChange={(e) => setNewLesson(prev => ({ ...prev, content: e.target.value }))}
                      className="w-full bg-slate-700 border-2 border-gray-600 rounded-lg px-3 py-2 text-white font-bold focus:outline-none focus:border-yellow-400"
                      placeholder="https://exemplo.com/video-epico.mp4"
                      required
                    />
                  ) : (
                    <textarea
                      value={newLesson.content}
                      onChange={(e) => setNewLesson(prev => ({ ...prev, content: e.target.value }))}
                      className="w-full bg-slate-700 border-2 border-gray-600 rounded-lg px-3 py-2 text-white font-bold focus:outline-none focus:border-yellow-400 resize-none"
                      rows={4}
                      placeholder="Descreva a missão épica que o herói deve completar..."
                      required
                    />
                  )}
                </div>
                
                <div className="flex items-center gap-4 mb-6">
                  <div>
                    <label className="block text-sm font-bold text-purple-200 mb-2">
                      Duração (min)
                    </label>
                    <input
                      type="number"
                      min="5"
                      value={newLesson.duration}
                      onChange={(e) => setNewLesson(prev => ({ ...prev, duration: parseInt(e.target.value) }))}
                      className="w-20 bg-slate-700 border-2 border-gray-600 rounded-lg px-3 py-2 text-white font-bold focus:outline-none focus:border-yellow-400"
                    />
                  </div>

                  <div className="flex items-center gap-2 mt-6">
                    <input
                      type="checkbox"
                      id="unlocked"
                      checked={newLesson.unlocked}
                      onChange={(e) => setNewLesson(prev => ({ ...prev, unlocked: e.target.checked }))}
                      className="w-5 h-5 text-green-600 bg-slate-700 border-2 border-gray-600 rounded focus:ring-green-500"
                    />
                    <label htmlFor="unlocked" className="text-sm font-bold text-purple-200">
                      🔓 Desbloqueado no início
                    </label>
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="submit"
                    className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-2 rounded-lg font-black border-2 border-green-300"
                  >
                    ⚔️ FORJAR DESAFIO
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="button"
                    onClick={() => {
                      setShowLessonForm(false)
                      setNewLesson({
                        title: '',
                        type: 'text',
                        content: '',
                        duration: 10,
                        xp: 100,
                        unlocked: false
                      })
                    }}
                    className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-6 py-2 rounded-lg font-black border-2 border-red-300"
                  >
                    ❌ CANCELAR
                  </motion.button>
                </div>
              </form>
            </motion.div>
          )}

          {/* Lessons List */}
          <div className="space-y-4">
            {course.lessons.map((lesson, index) => (
              <motion.div
                key={lesson.id}
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * index }}
                whileHover={{ scale: 1.02, x: 10 }}
                className="relative"
              >
                <div className={`bg-gradient-to-r ${getLessonBg(lesson.type, index)} p-1 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300`}>
                  <div className="bg-slate-900/90 backdrop-blur-sm rounded-xl p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center text-xl font-black text-white border-2 border-white/30">
                          {index + 1}
                        </div>
                        
                        <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center border-2 border-white/30">
                          {getLessonIcon(lesson.type)}
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-1">
                            <h3 className="font-black text-white text-lg">
                              {lesson.type === 'boss' && '👑 '}{lesson.title}
                            </h3>
                            <span className="px-2 py-1 bg-yellow-500/20 text-yellow-300 text-xs font-black rounded-full border border-yellow-400">
                              +{lesson.xp} XP
                            </span>
                            {lesson.unlocked ? (
                              <span className="px-2 py-1 bg-green-500/20 text-green-300 text-xs font-black rounded-full border border-green-400">
                                🔓 LIVRE
                              </span>
                            ) : (
                              <span className="px-2 py-1 bg-red-500/20 text-red-300 text-xs font-black rounded-full border border-red-400">
                                🔒 BLOQUEADO
                              </span>
                            )}
                          </div>
                          <p className="text-purple-200 text-sm">
                            {lesson.type === 'video' ? '🎬 Visão Mística' : 
                             lesson.type === 'text' ? '📜 Pergaminho' :
                             lesson.type === 'challenge' ? '⚡ Desafio' : '👹 Boss Battle'} • {lesson.duration} min
                          </p>
                        </div>
                      </div>
                      
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleDeleteLesson(lesson.id)}
                        className="p-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors border border-red-400"
                      >
                        <TrashIcon className="w-5 h-5" />
                      </motion.button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {course.lessons.length === 0 && (
            <div className="text-center py-16">
              <div className="text-8xl mb-6">⚔️</div>
              <h3 className="text-2xl font-black text-white mb-4">Arsenal Vazio!</h3>
              <p className="text-purple-200 mb-8 text-lg">Forje seus primeiros desafios épicos!</p>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowLessonForm(true)}
                className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-8 py-4 rounded-xl font-black text-lg shadow-2xl border-4 border-green-300"
              >
                <div className="flex items-center gap-3">
                  <RocketLaunchIcon className="w-6 h-6" />
                  COMEÇAR FORJA
                </div>
              </motion.button>
            </div>
          )}
        </motion.div>

        {/* Save Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="flex justify-end gap-4 mt-8"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-gradient-to-r from-gray-600 to-gray-700 text-white px-8 py-3 rounded-xl font-black border-2 border-gray-500 shadow-lg"
          >
            ❌ DESCARTAR
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-xl font-black border-2 border-blue-400 shadow-lg"
          >
            💾 SALVAR RASCUNHO
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-8 py-3 rounded-xl font-black border-2 border-green-400 shadow-lg"
          >
            <div className="flex items-center gap-2">
              <TrophyIcon className="w-5 h-5" />
              PUBLICAR LENDA
            </div>
          </motion.button>
        </motion.div>
      </div>
    </div>
  )
}

export default CourseEditor
