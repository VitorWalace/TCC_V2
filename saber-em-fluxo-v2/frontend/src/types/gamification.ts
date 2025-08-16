// FILE: /frontend/src/types/gamification.ts
export interface PlayerStats {
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
  recent_achievements: UserAchievement[];
  recent_activities: XpTransaction[];
}

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
  achievement: Achievement;
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

export interface LeaderboardPlayer {
  id: string;
  first_name: string;
  last_name: string;
  avatar_url?: string;
  player_class: string;
  level: number;
  xp_points: number;
  streak_days: number;
  rank: number;
}

export interface DailyChallenge {
  id: string;
  title: string;
  description: string;
  xp_reward: number;
  icon: string;
  progress: number;
  target: number;
}

export type PlayerClass = 'WARRIOR' | 'MAGE' | 'ARCHER' | 'PALADIN';

export const PLAYER_CLASSES = {
  WARRIOR: {
    name: "Guerreiro",
    description: "Foco em projetos práticos e desafios",
    color: "from-red-500 to-red-700",
    icon: "⚔️"
  },
  MAGE: {
    name: "Mago", 
    description: "Especialista em teoria e conceitos",
    color: "from-blue-500 to-blue-700",
    icon: "🔮"
  },
  ARCHER: {
    name: "Arqueiro",
    description: "Precisão em quizzes e testes", 
    color: "from-green-500 to-green-700",
    icon: "🏹"
  },
  PALADIN: {
    name: "Paladino",
    description: "Líder e mentor de outros estudantes",
    color: "from-yellow-500 to-yellow-700", 
    icon: "🛡️"
  }
} as const;
