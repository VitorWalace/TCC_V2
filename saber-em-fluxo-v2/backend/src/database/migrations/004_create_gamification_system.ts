// FILE: /backend/src/database/migrations/004_create_gamification_system.ts
import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  // Atualizar tabela users para gamificação
  await knex.schema.alterTable('users', (table) => {
    table.integer('xp_points').defaultTo(0);
    table.integer('level').defaultTo(1);
    table.string('player_class').defaultTo('WARRIOR'); // WARRIOR, MAGE, ARCHER, PALADIN
    table.integer('streak_days').defaultTo(0);
    table.timestamp('last_activity_date');
    table.json('preferences'); // Para armazenar preferências do usuário
  });

  // Tabela de conquistas (achievements)
  await knex.schema.createTable('achievements', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.string('key').unique().notNullable(); // ex: first_course, streak_7_days
    table.string('name').notNullable();
    table.text('description');
    table.string('icon').notNullable();
    table.string('category').notNullable(); // learning, social, streak, special
    table.string('rarity').notNullable(); // common, rare, epic, legendary
    table.integer('xp_reward').defaultTo(0);
    table.json('unlock_conditions'); // Condições para desbloquear
    table.boolean('is_active').defaultTo(true);
    table.timestamps(true, true);
  });

  // Tabela de conquistas dos usuários
  await knex.schema.createTable('user_achievements', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('user_id').notNullable().references('id').inTable('users').onDelete('CASCADE');
    table.uuid('achievement_id').notNullable().references('id').inTable('achievements').onDelete('CASCADE');
    table.timestamp('unlocked_at').defaultTo(knex.fn.now());
    table.json('unlock_data'); // Dados adicionais sobre o desbloqueio
    table.timestamps(true, true);
    
    table.unique(['user_id', 'achievement_id']);
    table.index(['user_id']);
  });

  // Tabela de histórico XP
  await knex.schema.createTable('xp_transactions', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('user_id').notNullable().references('id').inTable('users').onDelete('CASCADE');
    table.integer('xp_amount').notNullable();
    table.string('source').notNullable(); // lesson_completed, quiz_passed, achievement, etc
    table.uuid('source_id'); // ID da aula, conquista, etc
    table.text('description');
    table.json('metadata'); // Dados adicionais
    table.timestamp('created_at').defaultTo(knex.fn.now());
    
    table.index(['user_id', 'created_at']);
  });

  // Tabela de guilds/grupos
  await knex.schema.createTable('guilds', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.string('name').notNullable();
    table.text('description');
    table.string('avatar_url');
    table.uuid('owner_id').notNullable().references('id').inTable('users');
    table.integer('max_members').defaultTo(50);
    table.boolean('is_public').defaultTo(true);
    table.boolean('is_active').defaultTo(true);
    table.timestamps(true, true);
  });

  // Tabela de membros da guild
  await knex.schema.createTable('guild_members', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('guild_id').notNullable().references('id').inTable('guilds').onDelete('CASCADE');
    table.uuid('user_id').notNullable().references('id').inTable('users').onDelete('CASCADE');
    table.string('role').defaultTo('member'); // owner, admin, member
    table.timestamp('joined_at').defaultTo(knex.fn.now());
    table.boolean('is_active').defaultTo(true);
    table.timestamps(true, true);
    
    table.unique(['guild_id', 'user_id']);
    table.index(['guild_id']);
    table.index(['user_id']);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('guild_members');
  await knex.schema.dropTableIfExists('guilds');
  await knex.schema.dropTableIfExists('xp_transactions');
  await knex.schema.dropTableIfExists('user_achievements');
  await knex.schema.dropTableIfExists('achievements');
  
  // Remover colunas de gamificação da tabela users
  await knex.schema.alterTable('users', (table) => {
    table.dropColumn('xp_points');
    table.dropColumn('level');
    table.dropColumn('player_class');
    table.dropColumn('streak_days');
    table.dropColumn('last_activity_date');
    table.dropColumn('preferences');
  });
}
