// FILE: /backend/src/routes/chat_new.ts
import { Router } from 'express';
import { ChatController } from '../controllers/ChatController';
import { authenticateToken as authMiddleware } from '../middlewares/auth';

const router = Router();

// Todas as rotas de chat requerem autenticação
router.use(authMiddleware);

// Canais
router.get('/channels', ChatController.getUserChannels);
router.post('/channels', ChatController.createChannel);
router.post('/channels/:channelId/join', ChatController.joinChannel);

// Mensagens
router.get('/channels/:channelId/messages', ChatController.getChannelMessages);
router.post('/channels/:channelId/messages', ChatController.sendMessage);
router.delete('/messages/:messageId', ChatController.deleteMessage);

// Leitura
router.post('/channels/:channelId/read', ChatController.markAsRead);

// Presença e usuários online
router.get('/online', ChatController.getOnlineUsers);
router.put('/presence', ChatController.updatePresence);

// Guild chat
router.get('/guild/:guildId', ChatController.getGuildChannel);

export default router;
