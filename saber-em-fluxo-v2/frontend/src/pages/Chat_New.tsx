import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuthStore } from '../stores/authStore'
import { useChat } from '../contexts/ChatContext'
import {
  PaperAirplaneIcon,
  FaceSmileIcon,
  UserGroupIcon,
  SparklesIcon,
  PencilIcon,
  TrashIcon,
  EllipsisVerticalIcon
} from '@heroicons/react/24/outline'
import Navbar from '../components/layout/Navbar'

const Chat: React.FC = () => {
  const { user } = useAuthStore()
  const { 
    messages, 
    users, 
    isConnected, 
    isTyping, 
    sendMessage, 
    editMessage, 
    deleteMessage, 
    setTyping 
  } = useChat()
  
  const [newMessage, setNewMessage] = useState('')
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null)
  const [editText, setEditText] = useState('')
  const [showUsersList, setShowUsersList] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const typingTimeoutRef = useRef<NodeJS.Timeout>()

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = () => {
    if (!newMessage.trim()) return

    sendMessage(newMessage.trim())
    setNewMessage('')
    setShowEmojiPicker(false)
    
    // Parar de digitar
    setTyping(false)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleTyping = (value: string) => {
    setNewMessage(value)
    
    // Notificar que está digitando
    if (value.trim()) {
      setTyping(true)
      
      // Limpar timeout anterior
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current)
      }
      
      // Parar de digitar após 2 segundos de inatividade
      typingTimeoutRef.current = setTimeout(() => {
        setTyping(false)
      }, 2000)
    } else {
      setTyping(false)
    }
  }

  const handleEditMessage = (messageId: string) => {
    const message = messages.find(m => m.id === messageId)
    if (message) {
      setEditingMessageId(messageId)
      setEditText(message.message)
    }
  }

  const handleSaveEdit = () => {
    if (editingMessageId && editText.trim()) {
      editMessage(editingMessageId, editText.trim())
      setEditingMessageId(null)
      setEditText('')
    }
  }

  const handleCancelEdit = () => {
    setEditingMessageId(null)
    setEditText('')
  }

  const handleDeleteMessage = (messageId: string) => {
    if (window.confirm('Tem certeza que deseja deletar esta mensagem?')) {
      deleteMessage(messageId)
    }
  }

  const addEmoji = (emoji: string) => {
    setNewMessage(prev => prev + emoji)
    setShowEmojiPicker(false)
    inputRef.current?.focus()
  }

  const emojis = ['😀', '😂', '❤️', '🎮', '🚀', '⭐', '🔥', '💡', '🎯', '✨', '👍', '🎊']

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('pt-BR', {
      hour: '2-digit',
      minute: '2-digit'
    }).format(date)
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 flex items-center justify-center">
        <div className="text-white text-xl">Por favor, faça login para acessar o chat</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900">
      <Navbar />
      
      <div className="pt-20 px-4 pb-4">
        <div className="max-w-6xl mx-auto">
          {/* Header do Chat */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-6"
          >
            <h1 className="text-4xl font-bold text-white mb-2">
              CENTRAL DE COMANDO
            </h1>
            <p className="text-purple-300">
              Conecte-se com outros jogadores • Status: {isConnected ? '🟢 Online' : '🔴 Offline'}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Lista de Usuários - Mobile Collapsible */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-black/40 backdrop-blur-lg rounded-2xl border border-purple-500/30 p-4"
              >
                <button
                  onClick={() => setShowUsersList(!showUsersList)}
                  className="w-full flex items-center justify-between text-white font-semibold mb-4 lg:cursor-default"
                >
                  <div className="flex items-center gap-2">
                    <UserGroupIcon className="w-5 h-5 text-purple-400" />
                    <span>JOGADORES ONLINE</span>
                  </div>
                  <span className="lg:hidden">
                    {showUsersList ? '▼' : '▶'}
                  </span>
                </button>
                
                <div className={`space-y-2 ${showUsersList ? 'block' : 'hidden lg:block'}`}>
                  {users.map(user => (
                    <div
                      key={user.id}
                      className="flex items-center gap-3 p-2 rounded-lg bg-purple-500/10 hover:bg-purple-500/20 transition-colors"
                    >
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-sm font-semibold">
                        {user.avatar}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-white text-sm font-medium truncate">
                          {user.username}
                        </div>
                        <div className="flex items-center gap-1">
                          <div className={`w-2 h-2 rounded-full ${user.isOnline ? 'bg-green-400' : 'bg-gray-400'}`} />
                          <span className="text-xs text-purple-300">
                            {user.isOnline ? 'Online' : 'Offline'}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {users.length === 0 && (
                    <div className="text-center text-purple-300 text-sm py-4">
                      Nenhum jogador online
                    </div>
                  )}
                </div>
              </motion.div>
            </div>

            {/* Área de Chat */}
            <div className="lg:col-span-3">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-black/40 backdrop-blur-lg rounded-2xl border border-purple-500/30 h-[600px] flex flex-col overflow-hidden"
              >
                {/* Mensagens */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
                  <AnimatePresence>
                    {messages.map((message) => (
                      <motion.div
                        key={message.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className={`flex gap-3 ${
                          message.userId === user?.id ? 'flex-row-reverse' : 'flex-row'
                        }`}
                      >
                        {/* Avatar */}
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-sm font-semibold flex-shrink-0">
                          {message.avatar}
                        </div>

                        {/* Mensagem */}
                        <div className={`max-w-xs sm:max-w-md ${
                          message.userId === user?.id ? 'items-end' : 'items-start'
                        } flex flex-col`}>
                          <div className="text-xs text-purple-300 mb-1">
                            {message.username} • {formatTime(message.timestamp)}
                            {message.edited && <span className="ml-1 text-purple-400">(editada)</span>}
                          </div>
                          
                          {editingMessageId === message.id ? (
                            <div className="w-full">
                              <input
                                type="text"
                                value={editText}
                                onChange={(e) => setEditText(e.target.value)}
                                onKeyPress={(e) => {
                                  if (e.key === 'Enter') handleSaveEdit()
                                  if (e.key === 'Escape') handleCancelEdit()
                                }}
                                className="w-full bg-purple-900/50 text-white px-3 py-1 rounded-lg border border-purple-500/30 focus:border-purple-400 focus:outline-none text-sm"
                                autoFocus
                              />
                              <div className="flex gap-2 mt-1">
                                <button
                                  onClick={handleSaveEdit}
                                  className="text-xs text-green-400 hover:text-green-300"
                                >
                                  Salvar
                                </button>
                                <button
                                  onClick={handleCancelEdit}
                                  className="text-xs text-red-400 hover:text-red-300"
                                >
                                  Cancelar
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div className="group relative">
                              <div
                                className={`px-4 py-2 rounded-2xl max-w-full break-words ${
                                  message.type === 'system'
                                    ? 'bg-purple-600/30 text-purple-200 text-center italic'
                                    : message.userId === user?.id
                                    ? 'bg-purple-600 text-white'
                                    : 'bg-gray-700/50 text-white'
                                } ${
                                  message.type === 'emoji' ? 'text-2xl' : 'text-sm'
                                }`}
                              >
                                {message.message}
                              </div>

                              {/* Menu de opções para mensagens próprias */}
                              {message.userId === user?.id && message.type !== 'system' && (
                                <div className="absolute top-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <div className="flex gap-1 bg-gray-800 rounded-lg p-1 shadow-lg">
                                    <button
                                      onClick={() => handleEditMessage(message.id)}
                                      className="p-1 text-gray-400 hover:text-purple-400 transition-colors"
                                      title="Editar"
                                    >
                                      <PencilIcon className="w-3 h-3" />
                                    </button>
                                    <button
                                      onClick={() => handleDeleteMessage(message.id)}
                                      className="p-1 text-gray-400 hover:text-red-400 transition-colors"
                                      title="Deletar"
                                    >
                                      <TrashIcon className="w-3 h-3" />
                                    </button>
                                  </div>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>

                  {/* Indicador de digitação */}
                  {isTyping.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex items-center gap-2 text-purple-300 text-sm"
                    >
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                        <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                        <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                      <span>
                        {isTyping.length === 1 ? 'Alguém está' : `${isTyping.length} pessoas estão`} digitando...
                      </span>
                    </motion.div>
                  )}

                  <div ref={messagesEndRef} />
                </div>

                {/* Área de Input */}
                <div className="border-t border-purple-500/30 p-4">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 relative">
                      <input
                        ref={inputRef}
                        type="text"
                        value={newMessage}
                        onChange={(e) => handleTyping(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Digite sua mensagem..."
                        className="w-full bg-purple-900/30 text-white placeholder-purple-300 px-4 py-3 rounded-2xl border border-purple-500/30 focus:border-purple-400 focus:outline-none pr-12"
                        disabled={!isConnected}
                      />
                      
                      {/* Picker de emoji */}
                      <button
                        onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-purple-400 hover:text-purple-300 transition-colors"
                      >
                        <FaceSmileIcon className="w-5 h-5" />
                      </button>

                      {/* Painel de emojis */}
                      <AnimatePresence>
                        {showEmojiPicker && (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            className="absolute bottom-full right-0 mb-2 bg-gray-800 rounded-xl p-3 shadow-xl border border-purple-500/30 grid grid-cols-6 gap-2 min-w-max"
                          >
                            {emojis.map(emoji => (
                              <button
                                key={emoji}
                                onClick={() => addEmoji(emoji)}
                                className="text-xl hover:scale-110 transition-transform p-1 rounded hover:bg-purple-500/20"
                              >
                                {emoji}
                              </button>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    <button
                      onClick={handleSendMessage}
                      disabled={!newMessage.trim() || !isConnected}
                      className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white p-3 rounded-2xl transition-all duration-200 hover:shadow-lg hover:shadow-purple-500/25 group"
                    >
                      <PaperAirplaneIcon className="w-5 h-5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </button>
                  </div>

                  {!isConnected && (
                    <div className="text-center text-red-400 text-sm mt-2">
                      Desconectado do servidor. Tentando reconectar...
                    </div>
                  )}
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(147, 51, 234, 0.5);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(147, 51, 234, 0.7);
        }
      `}</style>
    </div>
  )
}

export default Chat
