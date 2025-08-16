import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  CameraIcon, 
  PencilIcon, 
  CheckIcon, 
  XMarkIcon,
  EnvelopeIcon,
  StarIcon,
  BoltIcon,
  TrophyIcon,
  SparklesIcon
} from '@heroicons/react/24/outline'
import { useAuthStore } from '../stores/authStore'

const Profile: React.FC = () => {
  const { user, updateProfile, isLoading } = useAuthStore()
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    bio: user?.bio || ''
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSaveProfile = async () => {
    const success = await updateProfile(formData)
    if (success) {
      setIsEditing(false)
    }
  }

  const handleCancelEdit = () => {
    setFormData({
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      bio: user?.bio || ''
    })
    setIsEditing(false)
  }

  const stats = [
    { label: 'CURSOS DOMINADOS', value: '12', icon: '🎓', color: 'from-green-400 to-emerald-500', glow: 'shadow-green-500/25' },
    { label: 'HORAS DE COMBATE', value: '156h', icon: '⚔️', color: 'from-blue-400 to-cyan-500', glow: 'shadow-blue-500/25' },
    { label: 'TROFÉUS COLETADOS', value: '8', icon: '🏆', color: 'from-yellow-400 to-orange-500', glow: 'shadow-yellow-500/25' },
    { label: 'STREAK LENDÁRIO', value: '15 dias', icon: '🔥', color: 'from-red-400 to-pink-500', glow: 'shadow-red-500/25' }
  ]

  const achievements = [
    { 
      title: 'PRIMEIRO SANGUE', 
      description: 'Completou seu primeiro curso com maestria', 
      icon: '�', 
      date: '2024-01-15',
      rarity: 'COMUM',
      rarityColor: 'from-gray-400 to-gray-500'
    },
    { 
      title: 'CHAMA ETERNA', 
      description: 'Streak de 7 dias - dedicação inabalável', 
      icon: '🔥', 
      date: '2024-02-20',
      rarity: 'RARO',
      rarityColor: 'from-blue-400 to-purple-500'
    },
    { 
      title: 'MESTRE REACT', 
      description: 'Dominou todos os segredos do React', 
      icon: '⚛️', 
      date: '2024-03-10',
      rarity: 'ÉPICO',
      rarityColor: 'from-purple-400 to-pink-500'
    },
    { 
      title: 'GUARDIAN DA COMUNIDADE', 
      description: 'Guiou outros guerreiros na jornada', 
      icon: '🤝', 
      date: '2024-04-05',
      rarity: 'LENDÁRIO',
      rarityColor: 'from-yellow-400 to-orange-500'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900">
      
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-pink-500/10 rounded-full blur-3xl animate-pulse delay-500" />
      </div>

      <div className="relative pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <h1 className="text-5xl font-bold text-white mb-4">
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                PERFIL DO JOGADOR
              </span>
            </h1>
            <p className="text-purple-300 text-lg">
              Estatísticas e conquistas da sua jornada épica
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Profile Card */}
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-black/40 backdrop-blur-lg rounded-3xl border border-purple-500/30 p-8 relative overflow-hidden"
              >
                {/* Animated Border */}
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-blue-500/20 opacity-75 animate-pulse" />
                <div className="absolute inset-[1px] rounded-3xl bg-black/40 backdrop-blur-lg" />
                
                <div className="relative z-10">
                  {/* Player Avatar & Info */}
                  <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8 mb-8">
                    {/* Epic Avatar */}
                    <div className="relative group">
                      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 blur animate-pulse" />
                      <div className="relative w-40 h-40 bg-gradient-to-br from-purple-600 via-pink-600 to-blue-600 rounded-full flex items-center justify-center text-white text-5xl font-bold shadow-2xl group-hover:scale-105 transition-all duration-300 border-4 border-purple-400/50">
                        {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
                        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-purple-400/20 to-transparent" />
                      </div>
                      <button className="absolute bottom-0 right-0 w-14 h-14 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center shadow-xl hover:scale-110 transition-all duration-300 border-2 border-purple-400/50">
                        <CameraIcon className="w-6 h-6 text-white" />
                      </button>
                      
                      {/* Level Badge */}
                      <div className="absolute -top-2 -right-2 bg-gradient-to-r from-yellow-400 to-orange-500 px-3 py-1 rounded-full text-black font-bold text-sm shadow-lg">
                        LVL 42
                      </div>
                    </div>

                    {/* Player Info */}
                    <div className="flex-1 text-center md:text-left">
                      <div className="flex flex-col md:flex-row items-center md:items-start space-y-2 md:space-y-0 md:space-x-4 mb-4">
                        <h2 className="text-4xl font-bold text-white">
                          {isEditing ? (
                            <div className="flex space-x-2">
                              <input
                                type="text"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleInputChange}
                                className="bg-purple-900/50 text-white px-4 py-2 rounded-lg border border-purple-500/30 focus:border-purple-400 focus:outline-none w-32"
                                placeholder="Nome"
                              />
                              <input
                                type="text"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleInputChange}
                                className="bg-purple-900/50 text-white px-4 py-2 rounded-lg border border-purple-500/30 focus:border-purple-400 focus:outline-none w-32"
                                placeholder="Sobrenome"
                              />
                            </div>
                          ) : (
                            `${user?.firstName} ${user?.lastName}`
                          )}
                        </h2>
                        
                        <div className="flex space-x-2">
                          <span className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-sm rounded-full font-semibold uppercase tracking-wide border border-purple-400/50">
                            {user?.role === 'student' ? 'GUERREIRO' : user?.role === 'instructor' ? 'MENTOR' : 'ADMIN'}
                          </span>
                          <span className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-sm rounded-full font-semibold uppercase tracking-wide border border-green-400/50 flex items-center">
                            <div className="w-2 h-2 bg-green-300 rounded-full mr-2 animate-pulse" />
                            ONLINE
                          </span>
                        </div>
                      </div>
                      
                      <div className="mb-6">
                        {isEditing ? (
                          <textarea
                            name="bio"
                            value={formData.bio}
                            onChange={handleInputChange}
                            className="w-full bg-purple-900/50 text-white px-4 py-3 rounded-lg border border-purple-500/30 focus:border-purple-400 focus:outline-none resize-none"
                            placeholder="Conte sua história épica..."
                            rows={3}
                          />
                        ) : (
                          <p className="text-purple-300 text-lg leading-relaxed">
                            {user?.bio || 'Um guerreiro lendário em busca de conhecimento e poder! ⚔️✨'}
                          </p>
                        )}
                      </div>

                      <div className="flex flex-wrap justify-center md:justify-start gap-6 text-purple-300 mb-6">
                        <div className="flex items-center space-x-2">
                          <EnvelopeIcon className="w-5 h-5 text-purple-400" />
                          <span>{user?.email}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <StarIcon className="w-5 h-5 text-yellow-400" />
                          <span>Aventureiro desde {new Date(user?.createdAt || '').toLocaleDateString('pt-BR')}</span>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex flex-wrap justify-center md:justify-start gap-3">
                        {!isEditing ? (
                          <>
                            <button
                              onClick={() => setIsEditing(true)}
                              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-300 shadow-lg hover:shadow-purple-500/25 flex items-center space-x-2"
                            >
                              <PencilIcon className="w-5 h-5" />
                              <span>EDITAR PERFIL</span>
                            </button>
                            <button className="px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-cyan-700 transition-all duration-300 shadow-lg hover:shadow-blue-500/25 flex items-center space-x-2">
                              <SparklesIcon className="w-5 h-5" />
                              <span>PERSONALIZAR</span>
                            </button>
                          </>
                        ) : (
                          <div className="flex space-x-3">
                            <button
                              onClick={handleSaveProfile}
                              disabled={isLoading}
                              className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-semibold hover:from-green-700 hover:to-emerald-700 disabled:opacity-50 transition-all duration-300 shadow-lg hover:shadow-green-500/25 flex items-center space-x-2"
                            >
                              <CheckIcon className="w-5 h-5" />
                              <span>{isLoading ? 'SALVANDO...' : 'SALVAR'}</span>
                            </button>
                            <button
                              onClick={handleCancelEdit}
                              className="px-6 py-3 bg-gradient-to-r from-gray-600 to-slate-600 text-white rounded-xl font-semibold hover:from-gray-700 hover:to-slate-700 transition-all duration-300 shadow-lg flex items-center space-x-2"
                            >
                              <XMarkIcon className="w-5 h-5" />
                              <span>CANCELAR</span>
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Stats Panel */}
            <div>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-black/40 backdrop-blur-lg rounded-3xl border border-purple-500/30 p-6 mb-8"
              >
                <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
                  <BoltIcon className="w-6 h-6 text-yellow-400 mr-2" />
                  ESTATÍSTICAS DE PODER
                </h3>
                <div className="space-y-4">
                  {stats.map((stat, index) => (
                    <motion.div
                      key={stat.label}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 + index * 0.1 }}
                      className={`bg-gradient-to-r ${stat.color} p-4 rounded-xl shadow-lg ${stat.glow} hover:scale-105 transition-all duration-300`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-white font-bold text-sm opacity-90">{stat.label}</div>
                          <div className="text-white text-2xl font-bold">{stat.value}</div>
                        </div>
                        <div className="text-3xl">{stat.icon}</div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>

          {/* Achievements */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-12"
          >
            <div className="bg-black/40 backdrop-blur-lg rounded-3xl border border-purple-500/30 p-8">
              <h3 className="text-3xl font-bold text-white mb-8 flex items-center justify-center">
                <TrophyIcon className="w-8 h-8 text-yellow-400 mr-3" />
                HALL DOS TROFÉUS LENDÁRIOS
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {achievements.map((achievement, index) => (
                  <motion.div
                    key={achievement.title}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.6 + index * 0.1 }}
                    className="bg-gradient-to-r from-black/60 to-purple-900/30 rounded-2xl p-6 border border-purple-500/30 hover:border-purple-400/50 hover:scale-105 transition-all duration-300 group"
                  >
                    <div className="flex items-start space-x-4">
                      <div className="text-4xl group-hover:scale-110 transition-transform duration-300">
                        {achievement.icon}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h4 className="text-white font-bold text-lg">{achievement.title}</h4>
                          <span className={`px-3 py-1 bg-gradient-to-r ${achievement.rarityColor} text-white text-xs rounded-full font-bold uppercase tracking-wider`}>
                            {achievement.rarity}
                          </span>
                        </div>
                        <p className="text-purple-300 mb-3">{achievement.description}</p>
                        <div className="text-purple-400 text-sm">
                          Conquistado em {new Date(achievement.date).toLocaleDateString('pt-BR')}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default Profile
