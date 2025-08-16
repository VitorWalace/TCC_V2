// FILE: /backend/src/types/chat.ts
export interface ChatChannel {
  id: string;
  name: string;
  description?: string;
  type: 'public' | 'private' | 'guild';
  guild_id?: string;
  created_by: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Message {
  id: string;
  channel_id: string;
  user_id: string;
  content: string;
  type: 'text' | 'image' | 'file' | 'system';
  metadata?: any;
  reply_to?: string;
  is_edited: boolean;
  edited_at?: string;
  is_deleted: boolean;
  deleted_at?: string;
  created_at: string;
  updated_at: string;
}

export interface ChannelMember {
  id: string;
  channel_id: string;
  user_id: string;
  role: 'admin' | 'member';
  joined_at: string;
  last_read_at: string;
  is_muted: boolean;
  is_active: boolean;
}

export interface UserPresence {
  user_id: string;
  status: 'online' | 'away' | 'busy' | 'offline';
  last_seen: string;
  current_page?: string;
  socket_ids?: string[];
  created_at: string;
  updated_at: string;
}

// DTOs
export interface CreateChannelDto {
  name: string;
  description?: string;
  type: 'public' | 'private' | 'guild';
  guild_id?: string;
}

export interface SendMessageDto {
  content: string;
  type?: 'text' | 'image' | 'file';
  metadata?: any;
  reply_to?: string;
}

// Para o frontend
export interface MessageWithUser extends Message {
  user: {
    id: string;
    first_name: string;
    last_name: string;
    avatar_url?: string;
    player_class: string;
    level: number;
  };
  reply_message?: MessageWithUser;
}

export interface ChannelWithDetails extends ChatChannel {
  members?: (ChannelMember & {
    user: {
      id: string;
      first_name: string;
      last_name: string;
      avatar_url?: string;
      player_class: string;
      level: number;
    };
  })[];
  latest_message?: MessageWithUser;
  unread_count?: number;
}

export interface OnlineUser {
  id: string;
  first_name: string;
  last_name: string;
  avatar_url?: string;
  player_class: string;
  level: number;
  status: 'online' | 'away' | 'busy';
  current_page?: string;
}
