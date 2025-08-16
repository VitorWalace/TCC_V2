import { Router } from 'express'
import { randomUUID } from 'crypto'

const router = Router()

// Sistema simples de armazenamento em memória
// Em produção, você usaria um banco de dados
let messages: any[] = []
let users: Map<string, any> = new Map()

interface ChatMessage {
  id: string
  userId: string
  username: string
  avatar: string
  message: string
  timestamp: Date
  type: 'text' | 'system' | 'emoji'
  edited?: boolean
}

// Obter todas as mensagens
router.get('/messages', (req, res) => {
  try {
    // Retornar últimas 100 mensagens
    const recentMessages = messages.slice(-100)
    res.json(recentMessages)
  } catch (error) {
    console.error('Erro ao obter mensagens:', error)
    res.status(500).json({ error: 'Erro interno do servidor' })
  }
})

// Enviar nova mensagem
router.post('/messages', (req, res) => {
  try {
    const { userId, username, avatar, message, type = 'text' } = req.body

    if (!userId || !username || !message?.trim()) {
      return res.status(400).json({ error: 'Dados obrigatórios não fornecidos' })
    }

    const newMessage: ChatMessage = {
      id: randomUUID(),
      userId,
      username,
      avatar: avatar || username.charAt(0).toUpperCase(),
      message: message.trim(),
      timestamp: new Date(),
      type
    }

    messages.push(newMessage)

    // Atualizar informações do usuário
    users.set(userId, {
      id: userId,
      username,
      avatar: avatar || username.charAt(0).toUpperCase(),
      isOnline: true,
      lastSeen: new Date()
    })

    console.log(`Nova mensagem de ${username}: ${message}`)
    res.status(201).json(newMessage)
  } catch (error) {
    console.error('Erro ao enviar mensagem:', error)
    res.status(500).json({ error: 'Erro interno do servidor' })
  }
})

// Editar mensagem
router.put('/messages/:messageId', (req, res) => {
  try {
    const { messageId } = req.params
    const { message: newText, userId } = req.body

    if (!newText?.trim()) {
      return res.status(400).json({ error: 'Novo texto não fornecido' })
    }

    const messageIndex = messages.findIndex(msg => msg.id === messageId)
    
    if (messageIndex === -1) {
      return res.status(404).json({ error: 'Mensagem não encontrada' })
    }

    const message = messages[messageIndex]

    // Verificar se o usuário é o autor da mensagem
    if (message.userId !== userId) {
      return res.status(403).json({ error: 'Não autorizado a editar esta mensagem' })
    }

    // Atualizar mensagem
    messages[messageIndex] = {
      ...message,
      message: newText.trim(),
      edited: true
    }

    console.log(`Mensagem editada por ${message.username}`)
    res.json(messages[messageIndex])
  } catch (error) {
    console.error('Erro ao editar mensagem:', error)
    res.status(500).json({ error: 'Erro interno do servidor' })
  }
})

// Deletar mensagem
router.delete('/messages/:messageId', (req, res) => {
  try {
    const { messageId } = req.params
    const { userId } = req.body

    const messageIndex = messages.findIndex(msg => msg.id === messageId)
    
    if (messageIndex === -1) {
      return res.status(404).json({ error: 'Mensagem não encontrada' })
    }

    const message = messages[messageIndex]

    // Verificar se o usuário é o autor da mensagem
    if (message.userId !== userId) {
      return res.status(403).json({ error: 'Não autorizado a deletar esta mensagem' })
    }

    // Remover mensagem
    messages.splice(messageIndex, 1)

    console.log(`Mensagem deletada por ${message.username}`)
    res.json({ success: true })
  } catch (error) {
    console.error('Erro ao deletar mensagem:', error)
    res.status(500).json({ error: 'Erro interno do servidor' })
  }
})

// Obter usuários online
router.get('/users', (req, res) => {
  try {
    const now = new Date()
    const fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000)

    // Considerar usuários online se tiveram atividade nos últimos 5 minutos
    const onlineUsers = Array.from(users.values()).map(user => ({
      ...user,
      isOnline: user.lastSeen > fiveMinutesAgo
    }))

    res.json(onlineUsers)
  } catch (error) {
    console.error('Erro ao obter usuários:', error)
    res.status(500).json({ error: 'Erro interno do servidor' })
  }
})

// Atualizar status do usuário
router.post('/users/:userId/status', (req, res) => {
  try {
    const { userId } = req.params
    const { username, avatar } = req.body

    if (!username) {
      return res.status(400).json({ error: 'Nome de usuário obrigatório' })
    }

    // Atualizar ou criar usuário
    users.set(userId, {
      id: userId,
      username,
      avatar: avatar || username.charAt(0).toUpperCase(),
      isOnline: true,
      lastSeen: new Date()
    })

    res.json({ success: true })
  } catch (error) {
    console.error('Erro ao atualizar status:', error)
    res.status(500).json({ error: 'Erro interno do servidor' })
  }
})

export default router
