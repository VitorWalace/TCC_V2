import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { useAuthStore } from '../stores/authStore'

export interface Message {
  id: string
  userId: string
  username: string
  avatar: string
  message: string
  timestamp: Date
  type: 'text' | 'system' | 'emoji'
  edited?: boolean
}

interface ChatContextType {
  messages: Message[]
  users: User[]
  isConnected: boolean
  isTyping: string[]
  sendMessage: (message: string, type?: 'text' | 'emoji') => void
  editMessage: (messageId: string, newText: string) => void
  deleteMessage: (messageId: string) => void
  setTyping: (isTyping: boolean) => void
}

interface User {
  id: string
  username: string
  avatar: string
  isOnline: boolean
  lastSeen: Date
}

const ChatContext = createContext<ChatContextType | undefined>(undefined)

export const useChat = () => {
  const context = useContext(ChatContext)
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider')
  }
  return context
}

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuthStore()
  const [messages, setMessages] = useState<Message[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [isConnected, setIsConnected] = useState(false)
  const [isTyping, setIsTyping] = useState<string[]>([])
  const [socket, setSocket] = useState<WebSocket | null>(null)
  const [pollingInterval, setPollingInterval] = useState<number | null>(null)
  
  // Detectar se estamos em desenvolvimento ou produção
  const isDevelopment = window.location.hostname === 'localhost'
  const wsUrl = isDevelopment ? 'ws://localhost:4001' : null
  const apiUrl = isDevelopment ? 'http://localhost:4001/api' : '/api'

  // Inicialização do chat
  useEffect(() => {
    if (!user) return

    if (isDevelopment && wsUrl) {
      // Usar WebSocket em desenvolvimento
      initWebSocket()
    } else {
      // Usar polling em produção (Vercel)
      initPolling()
    }

    return () => {
      cleanup()
    }
  }, [user])

  const initWebSocket = () => {
    try {
      const ws = new WebSocket(`${wsUrl}/chat`)
      
      ws.onopen = () => {
        console.log('WebSocket conectado')
        setIsConnected(true)
        
        // Enviar informações do usuário
        ws.send(JSON.stringify({
          type: 'user_join',
          user: {
            id: user?.id,
            username: `${user?.firstName} ${user?.lastName}`,
            avatar: `${user?.firstName?.charAt(0)}${user?.lastName?.charAt(0)}`
          }
        }))
      }

      ws.onmessage = (event) => {
        const data = JSON.parse(event.data)
        handleWebSocketMessage(data)
      }

      ws.onclose = () => {
        console.log('WebSocket desconectado')
        setIsConnected(false)
        // Tentar reconectar após 3 segundos
        setTimeout(() => {
          if (isDevelopment) initWebSocket()
        }, 3000)
      }

      ws.onerror = (error) => {
        console.error('Erro WebSocket:', error)
        setIsConnected(false)
      }

      setSocket(ws)
    } catch (error) {
      console.error('Erro ao conectar WebSocket:', error)
      // Fallback para polling se WebSocket falhar
      initPolling()
    }
  }

  const initPolling = () => {
    console.log('Iniciando polling para chat')
    setIsConnected(true)
    
    // Carregar mensagens iniciais
    loadMessages()
    
    // Configurar polling a cada 2 segundos
    const interval = setInterval(() => {
      loadMessages()
      loadUsers()
    }, 2000)
    
    setPollingInterval(interval)
  }

  const cleanup = () => {
    if (socket) {
      socket.close()
      setSocket(null)
    }
    if (pollingInterval) {
      clearInterval(pollingInterval)
      setPollingInterval(null)
    }
  }

  const handleWebSocketMessage = (data: any) => {
    switch (data.type) {
      case 'message':
        setMessages(prev => [...prev, data.message])
        break
      case 'message_edited':
        setMessages(prev => prev.map(msg => 
          msg.id === data.messageId 
            ? { ...msg, message: data.newText, edited: true }
            : msg
        ))
        break
      case 'message_deleted':
        setMessages(prev => prev.filter(msg => msg.id !== data.messageId))
        break
      case 'user_typing':
        setIsTyping(prev => [...prev.filter(u => u !== data.userId), data.userId])
        break
      case 'user_stop_typing':
        setIsTyping(prev => prev.filter(u => u !== data.userId))
        break
      case 'users_update':
        setUsers(data.users)
        break
      case 'messages_history':
        setMessages(data.messages)
        break
    }
  }

  const loadMessages = async () => {
    try {
      const response = await fetch(`${apiUrl}/chat/messages`)
      if (response.ok) {
        const messages = await response.json()
        setMessages(messages.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        })))
      }
    } catch (error) {
      console.error('Erro ao carregar mensagens:', error)
    }
  }

  const loadUsers = async () => {
    try {
      const response = await fetch(`${apiUrl}/chat/users`)
      if (response.ok) {
        const users = await response.json()
        setUsers(users)
      }
    } catch (error) {
      console.error('Erro ao carregar usuários:', error)
    }
  }

  const sendMessage = useCallback((message: string, type: 'text' | 'emoji' = 'text') => {
    if (!user || !message.trim()) return

    const newMessage: Message = {
      id: Date.now().toString(),
      userId: user.id,
      username: `${user.firstName} ${user.lastName}`,
      avatar: `${user.firstName?.charAt(0)}${user.lastName?.charAt(0)}`,
      message: message.trim(),
      timestamp: new Date(),
      type
    }

    if (socket && socket.readyState === WebSocket.OPEN) {
      // Enviar via WebSocket
      socket.send(JSON.stringify({
        type: 'send_message',
        message: newMessage
      }))
    } else {
      // Enviar via API
      sendMessageAPI(newMessage)
    }
  }, [user, socket])

  const sendMessageAPI = async (message: Message) => {
    try {
      const response = await fetch(`${apiUrl}/chat/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(message)
      })

      if (response.ok) {
        const savedMessage = await response.json()
        setMessages(prev => [...prev, {
          ...savedMessage,
          timestamp: new Date(savedMessage.timestamp)
        }])
      }
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error)
    }
  }

  const editMessage = useCallback((messageId: string, newText: string) => {
    if (!user) return

    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify({
        type: 'edit_message',
        messageId,
        newText,
        userId: user.id
      }))
    } else {
      // Editar via API
      editMessageAPI(messageId, newText)
    }
  }, [user, socket])

  const editMessageAPI = async (messageId: string, newText: string) => {
    try {
      const response = await fetch(`${apiUrl}/chat/messages/${messageId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: newText, userId: user?.id })
      })

      if (response.ok) {
        setMessages(prev => prev.map(msg => 
          msg.id === messageId 
            ? { ...msg, message: newText, edited: true }
            : msg
        ))
      }
    } catch (error) {
      console.error('Erro ao editar mensagem:', error)
    }
  }

  const deleteMessage = useCallback((messageId: string) => {
    if (!user) return

    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify({
        type: 'delete_message',
        messageId,
        userId: user.id
      }))
    } else {
      // Deletar via API
      deleteMessageAPI(messageId)
    }
  }, [user, socket])

  const deleteMessageAPI = async (messageId: string) => {
    try {
      const response = await fetch(`${apiUrl}/chat/messages/${messageId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: user?.id })
      })

      if (response.ok) {
        setMessages(prev => prev.filter(msg => msg.id !== messageId))
      }
    } catch (error) {
      console.error('Erro ao deletar mensagem:', error)
    }
  }

  const setTyping = useCallback((typing: boolean) => {
    if (!user) return

    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify({
        type: typing ? 'start_typing' : 'stop_typing',
        userId: user.id
      }))
    }
  }, [user, socket])

  return (
    <ChatContext.Provider value={{
      messages,
      users,
      isConnected,
      isTyping,
      sendMessage,
      editMessage,
      deleteMessage,
      setTyping
    }}>
      {children}
    </ChatContext.Provider>
  )
}
