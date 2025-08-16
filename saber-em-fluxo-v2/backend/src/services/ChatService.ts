// FILE: /backend/src/services/ChatService.ts
import db from '../database/connection';
import { 
  ChatChannel, 
  Message, 
  ChannelMember, 
  UserPresence,
  CreateChannelDto,
  SendMessageDto,
  MessageWithUser,
  ChannelWithDetails,
  OnlineUser
} from '../types/chat';

export class ChatService {

  /**
   * Criar um novo canal de chat
   */
  static async createChannel(userId: string, data: CreateChannelDto): Promise<ChatChannel> {
    try {
      const [channel] = await db('chat_channels')
        .insert({
          ...data,
          created_by: userId
        })
        .returning('*');

      // Adicionar criador como membro admin
      await db('channel_members').insert({
        channel_id: channel.id,
        user_id: userId,
        role: 'admin'
      });

      return channel;
    } catch (error) {
      console.error('❌ Erro ao criar canal:', error);
      throw new Error('Falha ao criar canal');
    }
  }

  /**
   * Buscar canais do usuário
   */
  static async getUserChannels(userId: string): Promise<ChannelWithDetails[]> {
    try {
      const channels = await db('chat_channels as c')
        .join('channel_members as cm', 'c.id', 'cm.channel_id')
        .leftJoin('messages as m', function() {
          this.on('c.id', 'm.channel_id')
              .andOn('m.created_at', '=', 
                db.raw('(SELECT MAX(created_at) FROM messages WHERE channel_id = c.id)')
              );
        })
        .leftJoin('users as mu', 'm.user_id', 'mu.id')
        .select(
          'c.*',
          'm.content as latest_message_content',
          'm.created_at as latest_message_time',
          'mu.first_name as latest_message_user_name'
        )
        .where('cm.user_id', userId)
        .where('cm.is_active', true)
        .where('c.is_active', true)
        .orderBy('latest_message_time', 'desc');

      // Buscar membros para cada canal
      for (const channel of channels) {
        const members = await db('channel_members as cm')
          .join('users as u', 'cm.user_id', 'u.id')
          .select(
            'cm.*',
            'u.first_name',
            'u.last_name',
            'u.avatar_url',
            'u.player_class',
            'u.level'
          )
          .where('cm.channel_id', channel.id)
          .where('cm.is_active', true);

        channel.members = members.map(m => ({
          ...m,
          user: {
            id: m.user_id,
            first_name: m.first_name,
            last_name: m.last_name,
            avatar_url: m.avatar_url,
            player_class: m.player_class,
            level: m.level
          }
        }));

        // Contar mensagens não lidas (simplificado)
        const unreadCount = await db('messages')
          .where('channel_id', channel.id)
          .where('created_at', '>', channel.last_read_at || '1970-01-01')
          .count('id as total');

        channel.unread_count = parseInt(String(unreadCount[0]?.total || 0));
      }

      return channels;
    } catch (error) {
      console.error('❌ Erro ao buscar canais:', error);
      throw new Error('Falha ao buscar canais');
    }
  }

  /**
   * Buscar mensagens de um canal
   */
  static async getChannelMessages(
    channelId: string, 
    userId: string, 
    limit: number = 50, 
    offset: number = 0
  ): Promise<MessageWithUser[]> {
    try {
      // Verificar se usuário tem acesso ao canal
      const membership = await db('channel_members')
        .where('channel_id', channelId)
        .where('user_id', userId)
        .where('is_active', true)
        .first();

      if (!membership) {
        throw new Error('Acesso negado ao canal');
      }

      const messages = await db('messages as m')
        .join('users as u', 'm.user_id', 'u.id')
        .leftJoin('messages as rm', 'm.reply_to', 'rm.id')
        .leftJoin('users as ru', 'rm.user_id', 'ru.id')
        .select(
          'm.*',
          'u.first_name',
          'u.last_name',
          'u.avatar_url',
          'u.player_class',
          'u.level',
          'rm.content as reply_content',
          'ru.first_name as reply_user_name'
        )
        .where('m.channel_id', channelId)
        .where('m.is_deleted', false)
        .orderBy('m.created_at', 'desc')
        .limit(limit)
        .offset(offset);

      return messages.reverse().map(m => ({
        ...m,
        user: {
          id: m.user_id,
          first_name: m.first_name,
          last_name: m.last_name,
          avatar_url: m.avatar_url,
          player_class: m.player_class,
          level: m.level
        },
        reply_message: m.reply_content ? {
          id: m.reply_to!,
          content: m.reply_content,
          user: {
            first_name: m.reply_user_name,
            last_name: '',
            id: '',
            avatar_url: '',
            player_class: '',
            level: 1
          }
        } : undefined
      }));
    } catch (error) {
      console.error('❌ Erro ao buscar mensagens:', error);
      throw error;
    }
  }

  /**
   * Enviar mensagem
   */
  static async sendMessage(
    channelId: string, 
    userId: string, 
    data: SendMessageDto
  ): Promise<MessageWithUser> {
    try {
      // Verificar permissão
      const membership = await db('channel_members')
        .where('channel_id', channelId)
        .where('user_id', userId)
        .where('is_active', true)
        .first();

      if (!membership) {
        throw new Error('Acesso negado ao canal');
      }

      // Criar mensagem
      const [message] = await db('messages')
        .insert({
          channel_id: channelId,
          user_id: userId,
          content: data.content,
          type: data.type || 'text',
          metadata: data.metadata,
          reply_to: data.reply_to
        })
        .returning('*');

      // Buscar dados do usuário para retorno
      const user = await db('users').where('id', userId).first();

      const messageWithUser: MessageWithUser = {
        ...message,
        user: {
          id: user.id,
          first_name: user.first_name,
          last_name: user.last_name,
          avatar_url: user.avatar_url,
          player_class: user.player_class,
          level: user.level
        }
      };

      return messageWithUser;
    } catch (error) {
      console.error('❌ Erro ao enviar mensagem:', error);
      throw error;
    }
  }

  /**
   * Entrar em um canal
   */
  static async joinChannel(channelId: string, userId: string): Promise<void> {
    try {
      // Verificar se canal existe e é público
      const channel = await db('chat_channels').where('id', channelId).first();
      if (!channel || channel.type === 'private') {
        throw new Error('Canal não encontrado ou privado');
      }

      // Verificar se já é membro
      const existingMember = await db('channel_members')
        .where('channel_id', channelId)
        .where('user_id', userId)
        .first();

      if (existingMember) {
        if (!existingMember.is_active) {
          // Reativar membership
          await db('channel_members')
            .where('id', existingMember.id)
            .update({ is_active: true, joined_at: db.fn.now() });
        }
        return;
      }

      // Adicionar como membro
      await db('channel_members').insert({
        channel_id: channelId,
        user_id: userId,
        role: 'member'
      });

    } catch (error) {
      console.error('❌ Erro ao entrar no canal:', error);
      throw error;
    }
  }

  /**
   * Atualizar presença do usuário
   */
  static async updateUserPresence(
    userId: string, 
    status: 'online' | 'away' | 'busy' | 'offline',
    currentPage?: string,
    socketId?: string
  ): Promise<void> {
    try {
      const existingPresence = await db('user_presence').where('user_id', userId).first();

      if (existingPresence) {
        let socketIds = existingPresence.socket_ids || [];
        
        if (socketId) {
          if (status === 'online' && !socketIds.includes(socketId)) {
            socketIds.push(socketId);
          } else if (status === 'offline') {
            socketIds = socketIds.filter((id: string) => id !== socketId);
            if (socketIds.length === 0) {
              status = 'offline';
            }
          }
        }

        await db('user_presence')
          .where('user_id', userId)
          .update({
            status: socketIds.length > 0 ? 'online' : status,
            last_seen: db.fn.now(),
            current_page: currentPage || existingPresence.current_page,
            socket_ids: socketIds
          });
      } else {
        await db('user_presence').insert({
          user_id: userId,
          status,
          last_seen: db.fn.now(),
          current_page: currentPage,
          socket_ids: socketId ? [socketId] : []
        });
      }
    } catch (error) {
      console.error('❌ Erro ao atualizar presença:', error);
    }
  }

  /**
   * Buscar usuários online
   */
  static async getOnlineUsers(limit: number = 50): Promise<OnlineUser[]> {
    try {
      const onlineUsers = await db('user_presence as up')
        .join('users as u', 'up.user_id', 'u.id')
        .select(
          'u.id',
          'u.first_name',
          'u.last_name',
          'u.avatar_url',
          'u.player_class',
          'u.level',
          'up.status',
          'up.current_page'
        )
        .whereIn('up.status', ['online', 'away', 'busy'])
        .where('u.is_active', true)
        .orderBy('up.last_seen', 'desc')
        .limit(limit);

      return onlineUsers;
    } catch (error) {
      console.error('❌ Erro ao buscar usuários online:', error);
      return [];
    }
  }

  /**
   * Buscar ou criar canal da guild
   */
  static async getGuildChannel(guildId: string): Promise<ChatChannel> {
    try {
      let channel = await db('chat_channels')
        .where('guild_id', guildId)
        .where('type', 'guild')
        .where('is_active', true)
        .first();

      if (!channel) {
        // Buscar informações da guild
        const guild = await db('guilds').where('id', guildId).first();
        if (!guild) {
          throw new Error('Guild não encontrada');
        }

        // Criar canal da guild
        [channel] = await db('chat_channels')
          .insert({
            name: `${guild.name} - Chat Geral`,
            description: `Canal principal da guild ${guild.name}`,
            type: 'guild',
            guild_id: guildId,
            created_by: guild.owner_id
          })
          .returning('*');

        // Adicionar todos os membros da guild ao canal
        const guildMembers = await db('guild_members')
          .where('guild_id', guildId)
          .where('is_active', true);

        for (const member of guildMembers) {
          await db('channel_members').insert({
            channel_id: channel.id,
            user_id: member.user_id,
            role: member.role === 'owner' ? 'admin' : 'member'
          });
        }
      }

      return channel;
    } catch (error) {
      console.error('❌ Erro ao buscar/criar canal da guild:', error);
      throw error;
    }
  }

  /**
   * Marcar mensagens como lidas
   */
  static async markAsRead(channelId: string, userId: string): Promise<void> {
    try {
      await db('channel_members')
        .where('channel_id', channelId)
        .where('user_id', userId)
        .update({ last_read_at: db.fn.now() });
    } catch (error) {
      console.error('❌ Erro ao marcar como lido:', error);
    }
  }

  /**
   * Deletar mensagem
   */
  static async deleteMessage(messageId: string, userId: string): Promise<void> {
    try {
      const message = await db('messages').where('id', messageId).first();
      if (!message) {
        throw new Error('Mensagem não encontrada');
      }

      // Verificar se é o autor da mensagem ou admin do canal
      const isAuthor = message.user_id === userId;
      const isAdmin = await db('channel_members')
        .where('channel_id', message.channel_id)
        .where('user_id', userId)
        .where('role', 'admin')
        .first();

      if (!isAuthor && !isAdmin) {
        throw new Error('Permissão negada');
      }

      await db('messages')
        .where('id', messageId)
        .update({
          is_deleted: true,
          deleted_at: db.fn.now(),
          content: '[Mensagem deletada]'
        });

    } catch (error) {
      console.error('❌ Erro ao deletar mensagem:', error);
      throw error;
    }
  }
}
