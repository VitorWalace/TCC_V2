// FILE: /frontend/src/stores/gameStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { GameService } from '../services/gameService';
import { PlayerStats, Achievement, UserAchievement, LeaderboardPlayer, DailyChallenge, PlayerClass } from '../types/gamification';
import toast from 'react-hot-toast';

interface GameState {
  // Estado do jogador
  playerStats: PlayerStats | null;
  isLoadingStats: boolean;
  
  // Conquistas
  achievements: Achievement[];
  userAchievements: UserAchievement[];
  isLoadingAchievements: boolean;
  
  // Ranking
  leaderboard: LeaderboardPlayer[];
  isLoadingLeaderboard: boolean;
  
  // Desafio diário
  dailyChallenge: DailyChallenge | null;
  isLoadingChallenge: boolean;
  
  // Actions
  loadPlayerStats: () => Promise<void>;
  loadAchievements: () => Promise<void>;
  loadUserAchievements: () => Promise<void>;
  loadLeaderboard: () => Promise<void>;
  loadDailyChallenge: () => Promise<void>;
  updatePlayerClass: (playerClass: PlayerClass) => Promise<void>;
  addXp: (amount: number, source: string, description?: string) => Promise<void>;
  
  // Helpers
  getPlayerLevel: () => number;
  getPlayerXp: () => number;
  getXpProgress: () => number;
  canLevelUp: () => boolean;
}

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      // Estado inicial
      playerStats: null,
      isLoadingStats: false,
      achievements: [],
      userAchievements: [],
      isLoadingAchievements: false,
      leaderboard: [],
      isLoadingLeaderboard: false,
      dailyChallenge: null,
      isLoadingChallenge: false,

      // Carregar estatísticas do jogador
      loadPlayerStats: async () => {
        set({ isLoadingStats: true });
        try {
          const stats = await GameService.getPlayerStats();
          set({ playerStats: stats, isLoadingStats: false });
        } catch (error: any) {
          console.error('❌ Erro ao carregar estatísticas:', error);
          toast.error(error.message);
          set({ isLoadingStats: false });
        }
      },

      // Carregar conquistas disponíveis
      loadAchievements: async () => {
        set({ isLoadingAchievements: true });
        try {
          const achievements = await GameService.getAchievements();
          set({ achievements, isLoadingAchievements: false });
        } catch (error: any) {
          console.error('❌ Erro ao carregar conquistas:', error);
          set({ isLoadingAchievements: false });
        }
      },

      // Carregar conquistas do usuário
      loadUserAchievements: async () => {
        set({ isLoadingAchievements: true });
        try {
          const userAchievements = await GameService.getUserAchievements();
          set({ userAchievements, isLoadingAchievements: false });
        } catch (error: any) {
          console.error('❌ Erro ao carregar suas conquistas:', error);
          set({ isLoadingAchievements: false });
        }
      },

      // Carregar ranking
      loadLeaderboard: async () => {
        set({ isLoadingLeaderboard: true });
        try {
          const leaderboard = await GameService.getLeaderboard();
          set({ leaderboard, isLoadingLeaderboard: false });
        } catch (error: any) {
          console.error('❌ Erro ao carregar ranking:', error);
          set({ isLoadingLeaderboard: false });
        }
      },

      // Carregar desafio diário
      loadDailyChallenge: async () => {
        set({ isLoadingChallenge: true });
        try {
          const dailyChallenge = await GameService.getDailyChallenge();
          set({ dailyChallenge, isLoadingChallenge: false });
        } catch (error: any) {
          console.error('❌ Erro ao carregar desafio diário:', error);
          set({ isLoadingChallenge: false });
        }
      },

      // Alterar classe do jogador
      updatePlayerClass: async (playerClass: PlayerClass) => {
        try {
          await GameService.updatePlayerClass(playerClass);
          
          // Recarregar estatísticas
          await get().loadPlayerStats();
          
          toast.success(`Classe alterada para ${playerClass}! ⚔️`, {
            icon: '🎯',
            duration: 3000
          });
        } catch (error: any) {
          console.error('❌ Erro ao alterar classe:', error);
          toast.error(error.message);
        }
      },

      // Adicionar XP
      addXp: async (amount: number, source: string, description?: string) => {
        try {
          const result = await GameService.addXp({
            amount,
            source,
            description
          });

          // Mostrar notificação de XP
          toast.success(`+${amount} XP! 🎉`, {
            icon: '⭐',
            duration: 2000
          });

          // Se subiu de nível, mostrar notificação especial
          const currentStats = get().playerStats;
          if (result.new_stats && currentStats && result.new_stats.current_level > currentStats.current_level) {
            toast.success(`Subiu para o nível ${result.new_stats.current_level}! 🚀`, {
              icon: '🎊',
              duration: 4000
            });
          }

          // Atualizar estatísticas
          set({ playerStats: result.new_stats });

        } catch (error: any) {
          console.error('❌ Erro ao adicionar XP:', error);
          toast.error(error.message);
        }
      },

      // Helpers
      getPlayerLevel: () => {
        const { playerStats } = get();
        return playerStats?.current_level || 1;
      },

      getPlayerXp: () => {
        const { playerStats } = get();
        return playerStats?.total_xp || 0;
      },

      getXpProgress: () => {
        const { playerStats } = get();
        return playerStats?.xp_progress_percentage || 0;
      },

      canLevelUp: () => {
        const { playerStats } = get();
        if (!playerStats) return false;
        return playerStats.total_xp >= playerStats.xp_for_next_level;
      }
    }),
    {
      name: 'game-store',
      partialize: (state) => ({
        playerStats: state.playerStats,
        userAchievements: state.userAchievements,
        dailyChallenge: state.dailyChallenge
      })
    }
  )
);
