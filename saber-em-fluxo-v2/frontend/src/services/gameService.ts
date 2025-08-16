// FILE: /frontend/src/services/gameService.ts
import api from './api';
import { PlayerStats, Achievement, UserAchievement, LeaderboardPlayer, DailyChallenge, PlayerClass } from '../types/gamification';

export class GameService {
  
  /**
   * Buscar estatísticas completas do jogador
   */
  static async getPlayerStats(): Promise<PlayerStats> {
    try {
      const response = await api.get('/api/game/stats');
      return response.data.data;
    } catch (error: any) {
      console.error('❌ Erro ao buscar estatísticas:', error);
      throw new Error(error.response?.data?.message || 'Falha ao buscar estatísticas');
    }
  }

  /**
   * Adicionar XP ao jogador
   */
  static async addXp(data: {
    amount: number;
    source: string;
    sourceId?: string;
    description?: string;
    metadata?: any;
  }): Promise<any> {
    try {
      const response = await api.post('/api/game/xp', data);
      return response.data.data;
    } catch (error: any) {
      console.error('❌ Erro ao adicionar XP:', error);
      throw new Error(error.response?.data?.message || 'Falha ao adicionar XP');
    }
  }

  /**
   * Buscar todas as conquistas disponíveis
   */
  static async getAchievements(): Promise<Achievement[]> {
    try {
      const response = await api.get('/api/game/achievements');
      return response.data.data;
    } catch (error: any) {
      console.error('❌ Erro ao buscar conquistas:', error);
      throw new Error(error.response?.data?.message || 'Falha ao buscar conquistas');
    }
  }

  /**
   * Buscar conquistas do usuário
   */
  static async getUserAchievements(): Promise<UserAchievement[]> {
    try {
      const response = await api.get('/api/game/achievements/my');
      return response.data.data;
    } catch (error: any) {
      console.error('❌ Erro ao buscar suas conquistas:', error);
      throw new Error(error.response?.data?.message || 'Falha ao buscar suas conquistas');
    }
  }

  /**
   * Buscar ranking de jogadores
   */
  static async getLeaderboard(limit: number = 50): Promise<LeaderboardPlayer[]> {
    try {
      const response = await api.get(`/api/game/leaderboard?limit=${limit}`);
      return response.data.data;
    } catch (error: any) {
      console.error('❌ Erro ao buscar ranking:', error);
      throw new Error(error.response?.data?.message || 'Falha ao buscar ranking');
    }
  }

  /**
   * Alterar classe do jogador
   */
  static async updatePlayerClass(playerClass: PlayerClass): Promise<void> {
    try {
      await api.put('/api/game/player-class', { playerClass });
    } catch (error: any) {
      console.error('❌ Erro ao alterar classe:', error);
      throw new Error(error.response?.data?.message || 'Falha ao alterar classe');
    }
  }

  /**
   * Buscar desafio diário
   */
  static async getDailyChallenge(): Promise<DailyChallenge> {
    try {
      const response = await api.get('/api/game/daily-challenge');
      return response.data.data;
    } catch (error: any) {
      console.error('❌ Erro ao buscar desafio diário:', error);
      throw new Error(error.response?.data?.message || 'Falha ao buscar desafio diário');
    }
  }

  /**
   * Calcular próximo nível baseado no XP
   */
  static calculateNextLevel(currentXp: number): {
    level: number;
    xpForNext: number;
    progress: number;
  } {
    const levels = [
      { level: 1, xp: 0 },
      { level: 2, xp: 100 },
      { level: 5, xp: 500 },
      { level: 10, xp: 1500 },
      { level: 20, xp: 5000 },
      { level: 50, xp: 25000 }
    ];

    let currentLevel = 1;
    let nextLevelXp = 100;

    for (let i = levels.length - 1; i >= 0; i--) {
      if (currentXp >= levels[i].xp) {
        currentLevel = levels[i].level;
        nextLevelXp = levels[i + 1]?.xp || levels[i].xp;
        break;
      }
    }

    const currentLevelXp = levels.find(l => l.level === currentLevel)?.xp || 0;
    const xpNeeded = nextLevelXp - currentLevelXp;
    const xpProgress = currentXp - currentLevelXp;
    const progress = xpNeeded > 0 ? Math.round((xpProgress / xpNeeded) * 100) : 100;

    return {
      level: currentLevel,
      xpForNext: nextLevelXp,
      progress: Math.max(0, Math.min(100, progress))
    };
  }

  /**
   * Formatar XP para display amigável
   */
  static formatXp(xp: number): string {
    if (xp >= 1000000) {
      return `${(xp / 1000000).toFixed(1)}M`;
    } else if (xp >= 1000) {
      return `${(xp / 1000).toFixed(1)}K`;
    }
    return xp.toString();
  }

  /**
   * Determinar cor da raridade
   */
  static getRarityColor(rarity: 'common' | 'rare' | 'epic' | 'legendary'): string {
    switch (rarity) {
      case 'common': return 'text-gray-400 bg-gray-100';
      case 'rare': return 'text-blue-400 bg-blue-100';
      case 'epic': return 'text-purple-400 bg-purple-100';
      case 'legendary': return 'text-yellow-400 bg-yellow-100';
      default: return 'text-gray-400 bg-gray-100';
    }
  }

  /**
   * Gerar mensagem motivacional baseada no progresso
   */
  static getMotivationalMessage(level: number, streak: number): string {
    const messages = [
      `Nível ${level}! Você está dominando as habilidades! 🚀`,
      `${streak} dias seguidos de aprendizado! Incrível! 🔥`,
      `Continue assim, CodeWarrior! A próxima conquista está próxima! ⚔️`,
      `Sua dedicação é inspiradora! Continue evoluindo! 💪`,
      `Cada aula completada te torna mais forte! 📚`,
    ];

    return messages[Math.floor(Math.random() * messages.length)];
  }
}
