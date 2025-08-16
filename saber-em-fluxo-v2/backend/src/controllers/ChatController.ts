// FILE: /backend/src/controllers/ChatController.ts
import { Request, Response } from 'express';
import { ChatService } from '../services/ChatService';

export class ChatController {

  /**
   * GET /api/chat/channels - Listar canais do usuário
   */
  static async getUserChannels(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req.user as any)?.id;
      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'Usuário não autenticado'
        });
        return;
      }

      const channels = await ChatService.getUserChannels(userId);

      res.json({
        success: true,
        data: channels,
        count: channels.length
      });
    } catch (error: any) {
      console.error('❌ Erro no ChatController.getUserChannels:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Erro interno do servidor'
      });
    }
  }

  /**
   * POST /api/chat/channels - Criar novo canal
   */
  static async createChannel(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req.user as any)?.id;
      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'Usuário não autenticado'
        });
        return;
      }

      const channelData = req.body;
      const channel = await ChatService.createChannel(userId, channelData);

      res.status(201).json({
        success: true,
        message: 'Canal criado com sucesso',
        data: channel
      });
    } catch (error: any) {
      console.error('❌ Erro no ChatController.createChannel:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Erro interno do servidor'
      });
    }
  }

  /**
   * GET /api/chat/channels/:channelId/messages - Buscar mensagens do canal
   */
  static async getChannelMessages(req: Request, res: Response): Promise<void> {
    try {
      const { channelId } = req.params;
      const userId = (req.user as any)?.id;
      const { limit = '50', offset = '0' } = req.query;

      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'Usuário não autenticado'
        });
        return;
      }

      if (!channelId) {
        res.status(400).json({
          success: false,
          message: 'ID do canal é obrigatório'
        });
        return;
      }

      const messages = await ChatService.getChannelMessages(
        channelId,
        userId,
        parseInt(limit as string),
        parseInt(offset as string)
      );

      res.json({
        success: true,
        data: messages,
        count: messages.length
      });
    } catch (error: any) {
      console.error('❌ Erro no ChatController.getChannelMessages:', error);
      res.status(400).json({
        success: false,
        message: error.message || 'Erro interno do servidor'
      });
    }
  }

  /**
   * POST /api/chat/channels/:channelId/messages - Enviar mensagem
   */
  static async sendMessage(req: Request, res: Response): Promise<void> {
    try {
      const { channelId } = req.params;
      const userId = (req.user as any)?.id;
      const messageData = req.body;

      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'Usuário não autenticado'
        });
        return;
      }

      if (!channelId) {
        res.status(400).json({
          success: false,
          message: 'ID do canal é obrigatório'
        });
        return;
      }

      const message = await ChatService.sendMessage(channelId, userId, messageData);

      res.status(201).json({
        success: true,
        message: 'Mensagem enviada',
        data: message
      });
    } catch (error: any) {
      console.error('❌ Erro no ChatController.sendMessage:', error);
      res.status(400).json({
        success: false,
        message: error.message || 'Erro interno do servidor'
      });
    }
  }

  /**
   * POST /api/chat/channels/:channelId/join - Entrar em canal
   */
  static async joinChannel(req: Request, res: Response): Promise<void> {
    try {
      const { channelId } = req.params;
      const userId = (req.user as any)?.id;

      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'Usuário não autenticado'
        });
        return;
      }

      if (!channelId) {
        res.status(400).json({
          success: false,
          message: 'ID do canal é obrigatório'
        });
        return;
      }

      await ChatService.joinChannel(channelId, userId);

      res.json({
        success: true,
        message: 'Entrou no canal com sucesso'
      });
    } catch (error: any) {
      console.error('❌ Erro no ChatController.joinChannel:', error);
      res.status(400).json({
        success: false,
        message: error.message || 'Erro interno do servidor'
      });
    }
  }

  /**
   * GET /api/chat/online - Usuários online
   */
  static async getOnlineUsers(req: Request, res: Response): Promise<void> {
    try {
      const { limit = '50' } = req.query;

      const onlineUsers = await ChatService.getOnlineUsers(parseInt(limit as string));

      res.json({
        success: true,
        data: onlineUsers,
        count: onlineUsers.length
      });
    } catch (error: any) {
      console.error('❌ Erro no ChatController.getOnlineUsers:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Erro interno do servidor'
      });
    }
  }

  /**
   * PUT /api/chat/presence - Atualizar presença
   */
  static async updatePresence(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req.user as any)?.id;
      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'Usuário não autenticado'
        });
        return;
      }

      const { status, currentPage, socketId } = req.body;

      await ChatService.updateUserPresence(userId, status, currentPage, socketId);

      res.json({
        success: true,
        message: 'Presença atualizada'
      });
    } catch (error: any) {
      console.error('❌ Erro no ChatController.updatePresence:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Erro interno do servidor'
      });
    }
  }

  /**
   * POST /api/chat/channels/:channelId/read - Marcar como lido
   */
  static async markAsRead(req: Request, res: Response): Promise<void> {
    try {
      const { channelId } = req.params;
      const userId = (req.user as any)?.id;

      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'Usuário não autenticado'
        });
        return;
      }

      if (!channelId) {
        res.status(400).json({
          success: false,
          message: 'ID do canal é obrigatório'
        });
        return;
      }

      await ChatService.markAsRead(channelId, userId);

      res.json({
        success: true,
        message: 'Marcado como lido'
      });
    } catch (error: any) {
      console.error('❌ Erro no ChatController.markAsRead:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Erro interno do servidor'
      });
    }
  }

  /**
   * DELETE /api/chat/messages/:messageId - Deletar mensagem
   */
  static async deleteMessage(req: Request, res: Response): Promise<void> {
    try {
      const { messageId } = req.params;
      const userId = (req.user as any)?.id;

      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'Usuário não autenticado'
        });
        return;
      }

      if (!messageId) {
        res.status(400).json({
          success: false,
          message: 'ID da mensagem é obrigatório'
        });
        return;
      }

      await ChatService.deleteMessage(messageId, userId);

      res.json({
        success: true,
        message: 'Mensagem deletada'
      });
    } catch (error: any) {
      console.error('❌ Erro no ChatController.deleteMessage:', error);
      res.status(400).json({
        success: false,
        message: error.message || 'Erro interno do servidor'
      });
    }
  }

  /**
   * GET /api/chat/guild/:guildId - Canal da guild
   */
  static async getGuildChannel(req: Request, res: Response): Promise<void> {
    try {
      const { guildId } = req.params;

      if (!guildId) {
        res.status(400).json({
          success: false,
          message: 'ID da guild é obrigatório'
        });
        return;
      }

      const channel = await ChatService.getGuildChannel(guildId);

      res.json({
        success: true,
        data: channel
      });
    } catch (error: any) {
      console.error('❌ Erro no ChatController.getGuildChannel:', error);
      res.status(400).json({
        success: false,
        message: error.message || 'Erro interno do servidor'
      });
    }
  }
}
