// FILE: /backend/src/database/migrations/005_create_chat_system.ts
import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  // Tabela de canais de chat
  await knex.schema.createTable('chat_channels', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.string('name').notNullable();
    table.text('description');
    table.string('type').notNullable().defaultTo('public'); // public, private, guild
    table.uuid('guild_id').references('id').inTable('guilds').onDelete('CASCADE');
    table.uuid('created_by').notNullable().references('id').inTable('users');
    table.boolean('is_active').defaultTo(true);
    table.timestamps(true, true);
    
    table.index(['type', 'is_active']);
    table.index(['guild_id']);
  });

  // Tabela de mensagens
  await knex.schema.createTable('messages', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('channel_id').notNullable().references('id').inTable('chat_channels').onDelete('CASCADE');
    table.uuid('user_id').notNullable().references('id').inTable('users').onDelete('CASCADE');
    table.text('content').notNullable();
    table.string('type').defaultTo('text'); // text, image, file, system
    table.json('metadata'); // Para arquivos, imagens, etc
    table.uuid('reply_to'); // Para respostas a outras mensagens
    table.boolean('is_edited').defaultTo(false);
    table.timestamp('edited_at');
    table.boolean('is_deleted').defaultTo(false);
    table.timestamp('deleted_at');
    table.timestamps(true, true);
    
    table.index(['channel_id', 'created_at']);
    table.index(['user_id']);
  });

  // Tabela de membros do canal
  await knex.schema.createTable('channel_members', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('channel_id').notNullable().references('id').inTable('chat_channels').onDelete('CASCADE');
    table.uuid('user_id').notNullable().references('id').inTable('users').onDelete('CASCADE');
    table.string('role').defaultTo('member'); // admin, member
    table.timestamp('joined_at').defaultTo(knex.fn.now());
    table.timestamp('last_read_at').defaultTo(knex.fn.now());
    table.boolean('is_muted').defaultTo(false);
    table.boolean('is_active').defaultTo(true);
    
    table.unique(['channel_id', 'user_id']);
    table.index(['user_id']);
  });

  // Tabela de usuários online
  await knex.schema.createTable('user_presence', (table) => {
    table.uuid('user_id').primary().references('id').inTable('users').onDelete('CASCADE');
    table.string('status').defaultTo('offline'); // online, away, busy, offline
    table.timestamp('last_seen').defaultTo(knex.fn.now());
    table.string('current_page'); // Para saber onde o usuário está
    table.json('socket_ids'); // Para gerenciar múltiplas conexões
    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('user_presence');
  await knex.schema.dropTableIfExists('channel_members');
  await knex.schema.dropTableIfExists('messages');
  await knex.schema.dropTableIfExists('chat_channels');
}
