// FILE: /backend/src/database/seeds/001_achievements.ts
import { Knex } from 'knex';

export async function seed(knex: Knex): Promise<void> {
  // Deletar dados existentes
  await knex('achievements').del();

  // Inserir conquistas básicas
  await knex('achievements').insert([
    // Conquistas de aprendizado
    {
      key: 'first_lesson',
      name: 'Primeira Lição',
      description: 'Complete sua primeira aula',
      icon: '🎯',
      category: 'learning',
      rarity: 'common',
      xp_reward: 50,
      unlock_conditions: JSON.stringify({ lessons_completed: 1 }),
      is_active: true
    },
    {
      key: 'lesson_master_10',
      name: 'Mestre das Lições',
      description: 'Complete 10 aulas',
      icon: '📚',
      category: 'learning',
      rarity: 'rare',
      xp_reward: 200,
      unlock_conditions: JSON.stringify({ lessons_completed: 10 }),
      is_active: true
    },
    {
      key: 'lesson_master_50',
      name: 'Sábio do Conhecimento',
      description: 'Complete 50 aulas',
      icon: '🧠',
      category: 'learning',
      rarity: 'epic',
      xp_reward: 500,
      unlock_conditions: JSON.stringify({ lessons_completed: 50 }),
      is_active: true
    },
    {
      key: 'course_completionist',
      name: 'Completionista',
      description: 'Complete seu primeiro curso',
      icon: '🏆',
      category: 'learning',
      rarity: 'epic',
      xp_reward: 300,
      unlock_conditions: JSON.stringify({ courses_completed: 1 }),
      is_active: true
    },
    {
      key: 'course_master',
      name: 'Mestre dos Cursos',
      description: 'Complete 5 cursos',
      icon: '👑',
      category: 'learning',
      rarity: 'legendary',
      xp_reward: 1000,
      unlock_conditions: JSON.stringify({ courses_completed: 5 }),
      is_active: true
    },

    // Conquistas de streak
    {
      key: 'streak_3',
      name: 'Constância',
      description: '3 dias consecutivos de aprendizado',
      icon: '🔥',
      category: 'streak',
      rarity: 'common',
      xp_reward: 75,
      unlock_conditions: JSON.stringify({ streak_days: 3 }),
      is_active: true
    },
    {
      key: 'streak_7',
      name: 'Semana Perfeita',
      description: '7 dias consecutivos de aprendizado',
      icon: '⚡',
      category: 'streak',
      rarity: 'rare',
      xp_reward: 150,
      unlock_conditions: JSON.stringify({ streak_days: 7 }),
      is_active: true
    },
    {
      key: 'streak_30',
      name: 'Dedicação Absoluta',
      description: '30 dias consecutivos de aprendizado',
      icon: '💎',
      category: 'streak',
      rarity: 'legendary',
      xp_reward: 800,
      unlock_conditions: JSON.stringify({ streak_days: 30 }),
      is_active: true
    },

    // Conquistas especiais
    {
      key: 'quiz_perfectionist',
      name: 'Perfeccionista',
      description: 'Acerte 100% em 10 quizzes',
      icon: '🎯',
      category: 'special',
      rarity: 'epic',
      xp_reward: 400,
      unlock_conditions: JSON.stringify({ perfect_quizzes: 10 }),
      is_active: true
    },
    {
      key: 'speed_learner',
      name: 'Aprendiz Veloz',
      description: 'Complete 5 aulas em um dia',
      icon: '⚡',
      category: 'special',
      rarity: 'rare',
      xp_reward: 250,
      unlock_conditions: JSON.stringify({ lessons_per_day: 5 }),
      is_active: true
    },
    {
      key: 'night_owl',
      name: 'Coruja Noturna',
      description: 'Estude após as 22h por 7 dias',
      icon: '🦉',
      category: 'special',
      rarity: 'rare',
      xp_reward: 200,
      unlock_conditions: JSON.stringify({ late_study_days: 7 }),
      is_active: true
    },
    {
      key: 'early_bird',
      name: 'Madrugador',
      description: 'Estude antes das 7h por 7 dias',
      icon: '🐦',
      category: 'special',
      rarity: 'rare',
      xp_reward: 200,
      unlock_conditions: JSON.stringify({ early_study_days: 7 }),
      is_active: true
    }
  ]);
}
