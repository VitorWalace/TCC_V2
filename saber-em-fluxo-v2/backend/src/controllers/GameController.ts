// FILE: /backend/src/controllers/GameController.ts
import { Request, Response } from 'express';
import { XpService } from '../services/XpService';
import db from '../database/connection';

export class GameController {

  /**
   * GET /api/game/stats - Buscar estatísticas do jogador
   */
  static async getPlayerStats(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req.user as any)?.id;
      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'Usuário não autenticado'
        });
        return;
      }

      const stats = await XpService.getUserStats(userId);

      res.json({
        success: true,
        data: stats
      });
    } catch (error: any) {
      console.error('❌ Erro no GameController.getPlayerStats:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Erro interno do servidor'
      });
    }
  }

  /**
   * POST /api/game/xp - Adicionar XP ao jogador
   */
  static async addXp(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req.user as any)?.id;
      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'Usuário não autenticado'
        });
        return;
      }

      const { amount, source, sourceId, description, metadata } = req.body;

      if (!amount || !source) {
        res.status(400).json({
          success: false,
          message: 'Amount e source são obrigatórios'
        });
        return;
      }

      const xpTransaction = await XpService.addXp(
        userId, 
        amount, 
        source, 
        sourceId, 
        description, 
        metadata
      );

      // Buscar stats atualizadas
      const newStats = await XpService.getUserStats(userId);

      res.json({
        success: true,
        message: `+${amount} XP ganho! 🎉`,
        data: {
          transaction: xpTransaction,
          new_stats: newStats
        }
      });
    } catch (error: any) {
      console.error('❌ Erro no GameController.addXp:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Erro interno do servidor'
      });
    }
  }

  /**
   * GET /api/game/achievements - Listar conquistas disponíveis
   */
  static async getAchievements(req: Request, res: Response): Promise<void> {
    try {
      const achievements = await db('achievements')
        .where('is_active', true)
        .orderBy('category')
        .orderBy('rarity');

      res.json({
        success: true,
        data: achievements,
        count: achievements.length
      });
    } catch (error: any) {
      console.error('❌ Erro no GameController.getAchievements:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Erro interno do servidor'
      });
    }
  }

  /**
   * GET /api/game/achievements/my - Conquistas do jogador
   */
  static async getUserAchievements(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req.user as any)?.id;
      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'Usuário não autenticado'
        });
        return;
      }

      const userAchievements = await db('user_achievements as ua')
        .join('achievements as a', 'ua.achievement_id', 'a.id')
        .select(
          'ua.*',
          'a.key',
          'a.name',
          'a.description',
          'a.icon',
          'a.category',
          'a.rarity',
          'a.xp_reward'
        )
        .where('ua.user_id', userId)
        .orderBy('ua.unlocked_at', 'desc');

      res.json({
        success: true,
        data: userAchievements,
        count: userAchievements.length
      });
    } catch (error: any) {
      console.error('❌ Erro no GameController.getUserAchievements:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Erro interno do servidor'
      });
    }
  }

  /**
   * GET /api/game/leaderboard - Ranking de jogadores
   */
  static async getLeaderboard(req: Request, res: Response): Promise<void> {
    try {
      const { limit = '50' } = req.query;

      const leaderboard = await db('users')
        .select(
          'id',
          'first_name',
          'last_name',
          'avatar_url',
          'player_class',
          'level',
          'xp_points',
          'streak_days'
        )
        .where('is_active', true)
        .orderBy('level', 'desc')
        .orderBy('xp_points', 'desc')
        .limit(parseInt(limit as string));

      // Adicionar ranking
      const leaderboardWithRank = leaderboard.map((player, index) => ({
        ...player,
        rank: index + 1
      }));

      res.json({
        success: true,
        data: leaderboardWithRank,
        count: leaderboardWithRank.length
      });
    } catch (error: any) {
      console.error('❌ Erro no GameController.getLeaderboard:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Erro interno do servidor'
      });
    }
  }

  /**
   * PUT /api/game/player-class - Alterar classe do jogador
   */
  static async updatePlayerClass(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req.user as any)?.id;
      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'Usuário não autenticado'
        });
        return;
      }

      const { playerClass } = req.body;

      if (!['WARRIOR', 'MAGE', 'ARCHER', 'PALADIN'].includes(playerClass)) {
        res.status(400).json({
          success: false,
          message: 'Classe inválida'
        });
        return;
      }

      await db('users')
        .where('id', userId)
        .update({ player_class: playerClass });

      res.json({
        success: true,
        message: `Classe alterada para ${playerClass}! ⚔️`
      });
    } catch (error: any) {
      console.error('❌ Erro no GameController.updatePlayerClass:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Erro interno do servidor'
      });
    }
  }

  /**
   * GET /api/game/daily-challenge - Desafio diário
   */
  static async getDailyChallenge(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req.user as any)?.id;
      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'Usuário não autenticado'
        });
        return;
      }

      // Desafios diários simples baseados no dia
      const today = new Date();
      const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000);
      
      const challenges = [
        {
          id: 'complete_lesson',
          title: 'Mestre do Conhecimento',
          description: 'Complete 3 aulas hoje',
          xp_reward: 100,
          icon: '📚',
          progress: 0,
          target: 3
        },
        {
          id: 'quiz_master',
          title: 'Quiz Master',
          description: 'Acerte 100% em um quiz',
          xp_reward: 150,
          icon: '🎯',
          progress: 0,
          target: 1
        },
        {
          id: 'streak_keeper',
          title: 'Guardião da Sequência',
          description: 'Mantenha seu streak ativo',
          xp_reward: 75,
          icon: '🔥',
          progress: 0,
          target: 1
        }
      ];

      // Selecionar desafio baseado no dia
      const todayChallenge = challenges[dayOfYear % challenges.length];

      // Verificar progresso (simplificado)
      const user = await db('users').where('id', userId).first();
      
      if (todayChallenge && todayChallenge.id === 'streak_keeper' && user?.streak_days > 0) {
        todayChallenge.progress = 1;
      }

      res.json({
        success: true,
        data: todayChallenge
      });
    } catch (error: any) {
      console.error('❌ Erro no GameController.getDailyChallenge:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Erro interno do servidor'
      });
    }
  }
}
