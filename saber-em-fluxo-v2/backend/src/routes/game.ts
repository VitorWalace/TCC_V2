// FILE: /backend/src/routes/game.ts
import { Router } from 'express';
import { GameController } from '../controllers/GameController';
import { authenticateToken as authMiddleware } from '../middlewares/auth';

const router = Router();

// Todas as rotas de gamificação requerem autenticação
router.use(authMiddleware);

// Estatísticas do jogador
router.get('/stats', GameController.getPlayerStats);

// Sistema de XP
router.post('/xp', GameController.addXp);

// Conquistas
router.get('/achievements', GameController.getAchievements);
router.get('/achievements/my', GameController.getUserAchievements);

// Ranking e competição
router.get('/leaderboard', GameController.getLeaderboard);

// Configurações do jogador
router.put('/player-class', GameController.updatePlayerClass);

// Desafios
router.get('/daily-challenge', GameController.getDailyChallenge);

export default router;
