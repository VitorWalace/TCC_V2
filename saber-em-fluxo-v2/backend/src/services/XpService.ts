// FILE: /backend/src/services/XpService.ts
import db from '../database/connection';
import { 
  XpTransaction, 
  UserStats, 
  Achievement, 
  UserAchievement,
  CreateXpTransactionDto,
  LEVEL_SYSTEM,
  PLAYER_CLASSES,
  PlayerClass
} from '../types/gamification';

export class XpService {
  
  /**
   * Adicionar XP para um usuário
   */
  static async addXp(
    userId: string, 
    xpAmount: number, 
    source: string, 
    sourceId?: string, 
    description?: string,
    metadata?: any
  ): Promise<XpTransaction> {
    const trx = await db.transaction();
    
    try {
      // Buscar usuário atual
      const user = await trx('users').where('id', userId).first();
      if (!user) {
        throw new Error('Usuário não encontrado');
      }

      // Aplicar multiplicador da classe
      const playerClass = user.player_class as PlayerClass;
      const classBonus = PLAYER_CLASSES[playerClass]?.bonuses.xp_multiplier || 1.0;
      const finalXp = Math.round(xpAmount * classBonus);

      // Criar transação XP
      const [xpTransaction] = await trx('xp_transactions')
        .insert({
          user_id: userId,
          xp_amount: finalXp,
          source,
          source_id: sourceId,
          description,
          metadata
        })
        .returning('*');

      // Atualizar XP do usuário
      const newTotalXp = (user.xp_points || 0) + finalXp;
      const newLevel = this.calculateLevel(newTotalXp);

      await trx('users')
        .where('id', userId)
        .update({
          xp_points: newTotalXp,
          level: newLevel,
          last_activity_date: db.fn.now()
        });

      // Verificar se subiu de nível
      if (newLevel > (user.level || 1)) {
        await this.checkLevelAchievements(trx, userId, newLevel);
      }

      // Verificar outras conquistas
      await this.checkAchievements(trx, userId, source, sourceId, metadata);

      await trx.commit();
      return xpTransaction;

    } catch (error) {
      await trx.rollback();
      console.error('❌ Erro ao adicionar XP:', error);
      throw error;
    }
  }

  /**
   * Calcular nível baseado no XP total
   */
  static calculateLevel(totalXp: number): number {
    for (let i = LEVEL_SYSTEM.length - 1; i >= 0; i--) {
      const levelData = LEVEL_SYSTEM[i];
      if (levelData && totalXp >= levelData.xp_required) {
        return levelData.level;
      }
    }
    return 1;
  }

  /**
   * Calcular XP necessário para próximo nível
   */
  static getXpForNextLevel(currentLevel: number): number {
    const nextLevelData = LEVEL_SYSTEM.find(level => level.level > currentLevel);
    return nextLevelData?.xp_required || 0;
  }

  /**
   * Buscar estatísticas completas do usuário
   */
  static async getUserStats(userId: string): Promise<UserStats> {
    try {
      // Dados básicos do usuário
      const user = await db('users').where('id', userId).first();
      if (!user) {
        throw new Error('Usuário não encontrado');
      }

      const currentXp = user.xp_points || 0;
      const currentLevel = user.level || 1;
      const xpForNext = this.getXpForNextLevel(currentLevel);
      
      // XP necessário para o nível atual
      const currentLevelData = LEVEL_SYSTEM.find(l => l.level === currentLevel);
      const xpForCurrentLevel = currentLevelData?.xp_required || 0;
      
      const xpProgress = xpForNext > 0 ? currentXp - xpForCurrentLevel : 0;
      const xpNeeded = xpForNext > 0 ? xpForNext - xpForCurrentLevel : 0;
      const xpProgressPercentage = xpNeeded > 0 ? Math.round((xpProgress / xpNeeded) * 100) : 100;

      // Estatísticas de cursos
      const courseStats = await db('enrollments')
        .where('user_id', userId)
        .where('is_active', true);

      const totalCourses = courseStats.length;
      const completedCourses = courseStats.filter(e => e.completed_at).length;

      // Aulas completadas
      const completedLessonsResult = await db('lesson_progress')
        .where('user_id', userId)
        .where('is_completed', true)
        .count('id as total');

      const totalLessonsCompleted = parseInt(String(completedLessonsResult[0]?.total || 0));

      // Streak atual e maior
      const currentStreak = user.streak_days || 0;
      
      // Calcular maior streak (simplificado - poderia ser mais sofisticado)
      const longestStreak = await db('users')
        .where('id', userId)
        .select('streak_days')
        .first();

      // Conquistas
      const achievementsCount = await db('user_achievements')
        .where('user_id', userId)
        .count('id as total');

      const totalAchievements = parseInt(String(achievementsCount[0]?.total || 0));

      // Conquistas recentes
      const recentAchievements = await db('user_achievements as ua')
        .join('achievements as a', 'ua.achievement_id', 'a.id')
        .select('ua.*', 'a.name', 'a.icon', 'a.rarity', 'a.category')
        .where('ua.user_id', userId)
        .orderBy('ua.unlocked_at', 'desc')
        .limit(5);

      // Atividades recentes
      const recentActivities = await db('xp_transactions')
        .where('user_id', userId)
        .orderBy('created_at', 'desc')
        .limit(10);

      return {
        total_xp: currentXp,
        current_level: currentLevel,
        xp_for_next_level: xpForNext,
        xp_progress_percentage: xpProgressPercentage,
        total_courses: totalCourses,
        completed_courses: completedCourses,
        total_lessons_completed: totalLessonsCompleted,
        current_streak: currentStreak,
        longest_streak: longestStreak?.streak_days || currentStreak,
        achievements_count: totalAchievements,
        recent_achievements: recentAchievements.map(ra => ({
          ...ra,
          achievement: {
            id: ra.achievement_id,
            name: ra.name,
            icon: ra.icon,
            rarity: ra.rarity,
            category: ra.category
          }
        })),
        recent_activities: recentActivities
      };

    } catch (error) {
      console.error('❌ Erro ao buscar estatísticas:', error);
      throw new Error('Falha ao buscar estatísticas do usuário');
    }
  }

  /**
   * Verificar conquistas de nível
   */
  private static async checkLevelAchievements(trx: any, userId: string, newLevel: number): Promise<void> {
    try {
      // Conquistas específicas de nível
      const levelAchievements = await trx('achievements')
        .where('category', 'level')
        .where('is_active', true);

      for (const achievement of levelAchievements) {
        const conditions = achievement.unlock_conditions;
        if (conditions?.level && newLevel >= conditions.level) {
          await this.unlockAchievement(trx, userId, achievement.id, { level: newLevel });
        }
      }

      // Conquista por atingir certos marcos
      const milestones = [5, 10, 20, 30, 50, 100];
      if (milestones.includes(newLevel)) {
        // Criar conquista dinâmica ou buscar existente
        const achievementKey = `level_${newLevel}`;
        let achievement = await trx('achievements').where('key', achievementKey).first();
        
        if (!achievement) {
          [achievement] = await trx('achievements')
            .insert({
              key: achievementKey,
              name: `Nível ${newLevel}`,
              description: `Alcançou o nível ${newLevel}!`,
              icon: '🏆',
              category: 'level',
              rarity: newLevel >= 50 ? 'legendary' : newLevel >= 20 ? 'epic' : 'rare',
              xp_reward: newLevel * 10,
              unlock_conditions: { level: newLevel }
            })
            .returning('*');
        }

        await this.unlockAchievement(trx, userId, achievement.id, { level: newLevel });
      }

    } catch (error) {
      console.error('❌ Erro ao verificar conquistas de nível:', error);
    }
  }

  /**
   * Verificar outras conquistas baseadas em ações
   */
  private static async checkAchievements(
    trx: any, 
    userId: string, 
    source: string, 
    sourceId?: string, 
    metadata?: any
  ): Promise<void> {
    try {
      const achievements = await trx('achievements')
        .where('is_active', true)
        .whereNot('category', 'level'); // Níveis são tratados separadamente

      for (const achievement of achievements) {
        const conditions = achievement.unlock_conditions;
        let shouldUnlock = false;

        switch (achievement.category) {
          case 'learning':
            shouldUnlock = await this.checkLearningAchievements(trx, userId, source, conditions);
            break;
          case 'streak':
            shouldUnlock = await this.checkStreakAchievements(trx, userId, conditions);
            break;
          case 'social':
            shouldUnlock = await this.checkSocialAchievements(trx, userId, source, conditions);
            break;
        }

        if (shouldUnlock) {
          await this.unlockAchievement(trx, userId, achievement.id, metadata);
        }
      }

    } catch (error) {
      console.error('❌ Erro ao verificar conquistas:', error);
    }
  }

  /**
   * Verificar conquistas de aprendizado
   */
  private static async checkLearningAchievements(
    trx: any, 
    userId: string, 
    source: string, 
    conditions: any
  ): Promise<boolean> {
    if (source === 'lesson_completed' && conditions?.lessons_completed) {
      const completedCount = await trx('lesson_progress')
        .where('user_id', userId)
        .where('is_completed', true)
        .count('id as total');
      
      return parseInt(String(completedCount[0]?.total || 0)) >= conditions.lessons_completed;
    }

    if (source === 'course_completed' && conditions?.courses_completed) {
      const completedCount = await trx('enrollments')
        .where('user_id', userId)
        .whereNotNull('completed_at')
        .count('id as total');
      
      return parseInt(String(completedCount[0]?.total || 0)) >= conditions.courses_completed;
    }

    return false;
  }

  /**
   * Verificar conquistas de streak
   */
  private static async checkStreakAchievements(
    trx: any, 
    userId: string, 
    conditions: any
  ): Promise<boolean> {
    const user = await trx('users').where('id', userId).first();
    return (user?.streak_days || 0) >= (conditions?.streak_days || 0);
  }

  /**
   * Verificar conquistas sociais
   */
  private static async checkSocialAchievements(
    trx: any, 
    userId: string, 
    source: string, 
    conditions: any
  ): Promise<boolean> {
    // Implementar quando houver funcionalidades sociais
    return false;
  }

  /**
   * Desbloquear conquista
   */
  private static async unlockAchievement(
    trx: any, 
    userId: string, 
    achievementId: string, 
    unlockData?: any
  ): Promise<void> {
    try {
      // Verificar se já foi desbloqueada
      const existing = await trx('user_achievements')
        .where('user_id', userId)
        .where('achievement_id', achievementId)
        .first();

      if (existing) return;

      // Desbloquear conquista
      await trx('user_achievements').insert({
        user_id: userId,
        achievement_id: achievementId,
        unlock_data: unlockData
      });

      // Dar XP da conquista
      const achievement = await trx('achievements').where('id', achievementId).first();
      if (achievement?.xp_reward > 0) {
        await trx('xp_transactions').insert({
          user_id: userId,
          xp_amount: achievement.xp_reward,
          source: 'achievement',
          source_id: achievementId,
          description: `Conquista desbloqueada: ${achievement.name}`
        });

        // Atualizar XP do usuário
        await trx('users')
          .where('id', userId)
          .increment('xp_points', achievement.xp_reward);
      }

    } catch (error) {
      console.error('❌ Erro ao desbloquear conquista:', error);
    }
  }

  /**
   * Atualizar streak do usuário
   */
  static async updateStreak(userId: string): Promise<void> {
    try {
      const user = await db('users').where('id', userId).first();
      if (!user) return;

      const today = new Date();
      const lastActivity = user.last_activity_date ? new Date(user.last_activity_date) : null;
      
      let newStreak = user.streak_days || 0;

      if (lastActivity) {
        const daysDiff = Math.floor((today.getTime() - lastActivity.getTime()) / (1000 * 60 * 60 * 24));
        
        if (daysDiff === 1) {
          // Dia consecutivo
          newStreak += 1;
        } else if (daysDiff > 1) {
          // Perdeu o streak
          newStreak = 1;
        }
        // Se daysDiff === 0, mantém o streak atual (mesmo dia)
      } else {
        // Primeira atividade
        newStreak = 1;
      }

      await db('users')
        .where('id', userId)
        .update({
          streak_days: newStreak,
          last_activity_date: today
        });

    } catch (error) {
      console.error('❌ Erro ao atualizar streak:', error);
    }
  }
}
