import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuthStore } from '../stores/authStore'
import { useChat } from '../contexts/ChatContext'
import {
  PaperAirplaneIcon,
  FaceSmileIcon,
  PhotoIcon,
  UserGroupIcon,
  SparklesIcon,
  CommandLineIcon,
  BoltIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline'

interface Message {
  id: string
  user: string
  message: string
  timestamp: Date
  type: 'text' | 'system'
  avatar?: string
}

const Chat: React.FC = () => {
  const { user } = useAuthStore()
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      user: 'Sistema de Combate',
      message: '🎮 Bem-vindos à CENTRAL DE COMANDO! Todos os guerreiros digitais estão conectados! ⚔️',
      timestamp: new Date(Date.now() - 300000),
      type: 'system'
    },
    {
      id: '2',
      user: 'Ana "CodeWarrior" Silva',
      message: 'Salve, galera! Alguém pode me ajudar com React Hooks? 🛡️',
      timestamp: new Date(Date.now() - 240000),
      type: 'text',
      avatar: 'AS'
    },
    {
      id: '3',
      user: 'Carlos "DevMaster" Mendes',
      message: 'Claro! Sou especialista nessa magia! Qual sua dúvida específica? ⚛️',
      timestamp: new Date(Date.now() - 180000),
      type: 'text',
      avatar: 'CM'
    },
    {
      id: '4',
      user: 'Ana "CodeWarrior" Silva',
      message: 'Como usar useEffect para invocar as APIs dos reinos distantes? 🏰',
      timestamp: new Date(Date.now() - 120000),
      type: 'text',
      avatar: 'AS'
    }
  ])
  const [newMessage, setNewMessage] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim()) return

    const message: Message = {
      id: Date.now().toString(),
      user: `${user?.firstName} ${user?.lastName}`,
      message: newMessage,
      timestamp: new Date(),
      type: 'text',
      avatar: `${user?.firstName?.charAt(0)}${user?.lastName?.charAt(0)}`
    }

    setMessages(prev => [...prev, message])
    setNewMessage('')

    // Simular resposta de outro usuário
    setTimeout(() => {
      setIsTyping(true)
      setTimeout(() => {
        setIsTyping(false)
        const responses = [
          'Excelente estratégia de combate! ⚔️',
          'Essa quest é épica! Vou investigar também! 🔍',
          'Eu também preciso dominar essa magia! 🪄',
          'Vou compartilhar meu conhecimento sobre isso! 📚',
          'Que batalha interessante! Alguém mais tem experiência? ⚡'
        ]
        const response: Message = {
          id: (Date.now() + 1).toString(),
          user: 'Pedro "CodeMage" Costa',
          message: responses[Math.floor(Math.random() * responses.length)],
          timestamp: new Date(),
          type: 'text',
          avatar: 'PC'
        }
        setMessages(prev => [...prev, response])
      }, 2000)
    }, 1000)
  }

  const formatTime = (timestamp: Date) => {
    return timestamp.toLocaleTimeString('pt-BR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    })
  }

  const onlineUsers = [
    { name: 'Ana "CodeWarrior" Silva', avatar: 'AS', status: 'online', level: 42, class: 'WARRIOR' },
    { name: 'Carlos "DevMaster" Mendes', avatar: 'CM', status: 'online', level: 58, class: 'MAGE' },
    { name: 'Pedro "CodeMage" Costa', avatar: 'PC', status: 'away', level: 35, class: 'MAGE' },
    { name: 'Maria "BugHunter" Santos', avatar: 'MS', status: 'online', level: 47, class: 'ARCHER' },
    { name: 'João "FullStack" Oliveira', avatar: 'JO', status: 'offline', level: 63, class: 'PALADIN' }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-purple-900 to-black relative overflow-hidden">
      {/* Animated Gaming Background */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-20 left-20 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse" />
        <div className="absolute top-40 right-20 w-72 h-72 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-2000" />
        <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-4000" />
      </div>

      <div className="relative z-10 h-screen flex">
        {/* Gaming Sidebar - Guild Members */}
        <motion.div
          initial={{ x: -300 }}
          animate={{ x: 0 }}
          transition={{ duration: 0.6 }}
          className="hidden md:block w-80 bg-black/40 backdrop-blur-lg border-r border-purple-500/30 m-4 mr-0 rounded-3xl"
        >
          <div className="p-6 border-b border-purple-500/30">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent flex items-center">
              <UserGroupIcon className="w-6 h-6 mr-3 text-purple-400" />
              GUILD MEMBERS
            </h2>
            <div className="flex items-center mt-2">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse mr-2" />
              <span className="text-purple-300 text-sm font-semibold">
                {onlineUsers.filter(u => u.status === 'online').length} GUERREIROS ATIVOS
              </span>
            </div>
          </div>
          <div className="p-6 space-y-4 overflow-y-auto max-h-[calc(100vh-200px)]">
            {onlineUsers.map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.4 }}
                className="bg-purple-900/30 p-4 rounded-2xl border border-purple-500/20 hover:border-purple-400/50 transition-all duration-300 hover:scale-105"
              >
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <div className={`w-12 h-12 bg-gradient-to-br ${
                      member.class === 'WARRIOR' ? 'from-red-500 to-orange-500' :
                      member.class === 'MAGE' ? 'from-purple-500 to-pink-500' :
                      member.class === 'ARCHER' ? 'from-green-500 to-emerald-500' :
                      'from-yellow-500 to-orange-500'
                    } rounded-full flex items-center justify-center text-white font-bold text-sm border-2 border-white/30`}>
                      {member.avatar}
                    </div>
                    <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-black ${
                      member.status === 'online' ? 'bg-green-400 animate-pulse' :
                      member.status === 'away' ? 'bg-yellow-400' : 'bg-gray-400'
                    }`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <p className="text-white font-bold text-sm truncate">
                        {member.name.split(' ')[0]}
                      </p>
                      <span className={`px-2 py-1 bg-gradient-to-r ${
                        member.class === 'WARRIOR' ? 'from-red-600 to-red-500' :
                        member.class === 'MAGE' ? 'from-purple-600 to-purple-500' :
                        member.class === 'ARCHER' ? 'from-green-600 to-green-500' :
                        'from-yellow-600 to-yellow-500'
                      } text-white text-xs rounded-full font-bold uppercase tracking-wider`}>
                        {member.class}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-purple-300 text-xs">LVL {member.level}</span>
                      <span className={`text-xs uppercase font-semibold ${
                        member.status === 'online' ? 'text-green-400' :
                        member.status === 'away' ? 'text-yellow-400' : 'text-gray-400'
                      }`}>
                        {member.status}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Chat Principal - Command Center */}
        <div className="flex-1 flex flex-col">
          {/* Header Épico do Chat */}
          <motion.div
            initial={{ y: -50 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-black/40 backdrop-blur-lg border-b border-purple-500/30 m-4 mb-0 p-6 rounded-t-3xl"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-14 h-14 bg-gradient-to-br from-purple-500 via-pink-500 to-cyan-500 rounded-full flex items-center justify-center border-4 border-white/20 animate-pulse">
                  <CommandLineIcon className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
                    ⚡ CENTRAL DE COMANDO
                  </h1>
                  <div className="flex items-center space-x-4 mt-1">
                    <div className="flex items-center space-x-2">
                      <BoltIcon className="w-4 h-4 text-yellow-400" />
                      <span className="text-purple-300 text-sm font-semibold">
                        {onlineUsers.filter(u => u.status === 'online').length} GUERREIROS EM COMBATE
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <ShieldCheckIcon className="w-4 h-4 text-green-400" />
                      <span className="text-green-300 text-sm font-semibold">
                        CONEXÃO SEGURA
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex space-x-3">
                <button className="p-3 bg-purple-600/30 hover:bg-purple-600/50 text-purple-300 hover:text-white rounded-xl transition-all duration-300 hover:scale-110 border border-purple-500/30">
                  <PhotoIcon className="w-5 h-5" />
                </button>
                <button className="p-3 bg-pink-600/30 hover:bg-pink-600/50 text-pink-300 hover:text-white rounded-xl transition-all duration-300 hover:scale-110 border border-pink-500/30">
                  <FaceSmileIcon className="w-5 h-5" />
                </button>
                <button className="p-3 bg-cyan-600/30 hover:bg-cyan-600/50 text-cyan-300 hover:text-white rounded-xl transition-all duration-300 hover:scale-110 border border-cyan-500/30">
                  <SparklesIcon className="w-5 h-5" />
                </button>
              </div>
            </div>
          </motion.div>

          {/* Arena de Mensagens */}
          <div className="flex-1 overflow-y-auto p-4 pt-0">
            <div className="bg-black/40 backdrop-blur-lg rounded-none border-l border-r border-purple-500/30 p-6 h-full">
              <div className="space-y-6">
                <AnimatePresence>
                  {messages.map((message) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 20, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ duration: 0.4, ease: "easeOut" }}
                      className={`flex items-start space-x-4 ${
                        message.type === 'system' ? 'justify-center' : ''
                      }`}
                    >
                      {message.type === 'system' ? (
                        <div className="text-center max-w-2xl">
                          <div className="bg-gradient-to-r from-purple-600/20 via-pink-600/20 to-cyan-600/20 backdrop-blur-sm px-6 py-3 rounded-2xl border border-purple-500/30">
                            <p className="text-purple-300 font-semibold text-sm">
                              {message.message}
                            </p>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 via-pink-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0 border-2 border-white/30 shadow-lg">
                            {message.avatar}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-3 mb-2">
                              <p className="text-white font-bold text-sm">
                                {message.user}
                              </p>
                              <span className="px-2 py-1 bg-gradient-to-r from-purple-600/50 to-pink-600/50 text-white text-xs rounded-full">
                                {formatTime(message.timestamp)}
                              </span>
                            </div>
                            <div className="bg-gradient-to-r from-purple-900/40 to-pink-900/40 backdrop-blur-sm p-4 rounded-2xl border border-purple-500/30 shadow-lg hover:shadow-purple-500/20 transition-all duration-300">
                              <p className="text-purple-100 leading-relaxed">{message.message}</p>
                            </div>
                          </div>
                        </>
                      )}
                    </motion.div>
                  ))}
                </AnimatePresence>

                {/* Indicador Épico de Digitação */}
                <AnimatePresence>
                  {isTyping && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="flex items-start space-x-4"
                    >
                      <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center text-white font-bold text-sm border-2 border-white/30 shadow-lg animate-pulse">
                        PC
                      </div>
                      <div className="bg-gradient-to-r from-green-900/40 to-emerald-900/40 backdrop-blur-sm p-4 rounded-2xl border border-green-500/30">
                        <div className="flex items-center space-x-2">
                          <span className="text-green-300 text-sm font-semibold">Guerreiro digitando uma magia...</span>
                          <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce" />
                            <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                            <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div ref={messagesEndRef} />
              </div>
            </div>
          </div>

          {/* Input de Comando Épico */}
          <motion.div
            initial={{ y: 50 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-black/40 backdrop-blur-lg border-t border-purple-500/30 m-4 mt-0 p-6 rounded-b-3xl"
          >
            <form onSubmit={handleSendMessage} className="flex space-x-4">
              <div className="flex-1 relative">
                <input
                  ref={inputRef}
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Digite seu comando épico..."
                  className="w-full px-6 py-4 bg-purple-900/30 border border-purple-500/30 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent text-white placeholder-purple-300 backdrop-blur-sm"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-2xl pointer-events-none" />
              </div>
              <motion.button
                type="submit"
                disabled={!newMessage.trim()}
                className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-2xl hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 font-semibold shadow-lg hover:shadow-purple-500/25 flex items-center space-x-2 border border-purple-400/30"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <PaperAirplaneIcon className="w-5 h-5" />
                <span>ENVIAR</span>
              </motion.button>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default Chat
