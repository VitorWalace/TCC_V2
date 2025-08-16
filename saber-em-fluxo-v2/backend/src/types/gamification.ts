// FILE: /backend/src/types/gamification.ts
export interface Achievement {
  id: string;
  key: string;
  name: string;
  description?: string;
  icon: string;
  category: 'learning' | 'social' | 'streak' | 'special';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  xp_reward: number;
  unlock_conditions: any;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface UserAchievement {
  id: string;
  user_id: string;
  achievement_id: string;
  unlocked_at: string;
  unlock_data?: any;
  created_at: string;
  updated_at: string;
}

export interface XpTransaction {
  id: string;
  user_id: string;
  xp_amount: number;
  source: string;
  source_id?: string;
  description?: string;
  metadata?: any;
  created_at: string;
}

export interface Guild {
  id: string;
  name: string;
  description?: string;
  avatar_url?: string;
  owner_id: string;
  max_members: number;
  is_public: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface GuildMember {
  id: string;
  guild_id: string;
  user_id: string;
  role: 'owner' | 'admin' | 'member';
  joined_at: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// DTOs
export interface CreateXpTransactionDto {
  user_id: string;
  xp_amount: number;
  source: string;
  source_id?: string;
  description?: string;
  metadata?: any;
}

export interface UserStats {
  total_xp: number;
  current_level: number;
  xp_for_next_level: number;
  xp_progress_percentage: number;
  total_courses: number;
  completed_courses: number;
  total_lessons_completed: number;
  current_streak: number;
  longest_streak: number;
  achievements_count: number;
  recent_achievements: (UserAchievement & { achievement: Achievement })[];
  recent_activities: XpTransaction[];
}

// Sistema de níveis
export interface LevelSystem {
  level: number;
  xp_required: number;
  title: string;
  benefits: string[];
}

export const LEVEL_SYSTEM: LevelSystem[] = [
  { level: 1, xp_required: 0, title: "Novato", benefits: ["Acesso básico"] },
  { level: 2, xp_required: 100, title: "Aprendiz", benefits: ["Acesso a quizzes"] },
  { level: 5, xp_required: 500, title: "Estudante", benefits: ["Acesso a projetos"] },
  { level: 10, xp_required: 1500, title: "CodeWarrior", benefits: ["Criar guilds"] },
  { level: 20, xp_required: 5000, title: "DevMaster", benefits: ["Mentoria"] },
  { level: 50, xp_required: 25000, title: "Lenda", benefits: ["Acesso total"] }
];

export const PLAYER_CLASSES = {
  WARRIOR: {
    name: "Guerreiro",
    description: "Foco em projetos práticos e desafios",
    bonuses: { xp_multiplier: 1.1, project_bonus: 1.2 }
  },
  MAGE: {
    name: "Mago",
    description: "Especialista em teoria e conceitos",
    bonuses: { xp_multiplier: 1.0, theory_bonus: 1.3 }
  },
  ARCHER: {
    name: "Arqueiro",
    description: "Precisão em quizzes e testes",
    bonuses: { xp_multiplier: 1.0, quiz_bonus: 1.4 }
  },
  PALADIN: {
    name: "Paladino",
    description: "Líder e mentor de outros estudantes",
    bonuses: { xp_multiplier: 1.0, social_bonus: 1.5 }
  }
} as const;

export type PlayerClass = keyof typeof PLAYER_CLASSES;
