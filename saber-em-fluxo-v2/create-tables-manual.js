// Script SQL para criar tabelas manualmente
const knex = require('knex');
const config = require('./backend/knexfile.js');

const db = knex(config.development);

const createTables = async () => {
  try {
    console.log('🔄 Criando tabelas manualmente...');
    
    // Criar tabela users primeiro (pode já existir)
    try {
      await db.schema.createTable('users', (table) => {
        table.string('id').primary();
        table.string('first_name').notNullable();
        table.string('last_name').notNullable();
        table.string('email').notNullable().unique();
        table.string('password_hash').notNullable();
        table.string('avatar_url');
        table.boolean('is_active').defaultTo(true);
        table.timestamps(true, true);
      });
      console.log('✅ Tabela users criada');
    } catch (e) {
      console.log('ℹ️ Tabela users já existe');
    }

    // Criar tabela courses
    await db.schema.createTable('courses', (table) => {
      table.string('id').primary();
      table.string('title').notNullable();
      table.text('description');
      table.string('category').notNullable();
      table.string('difficulty').notNullable();
      table.string('cover_image_url');
      table.integer('estimated_hours').defaultTo(0);
      table.integer('xp_reward').defaultTo(0);
      table.string('instructor_id').notNullable();
      table.boolean('is_published').defaultTo(false);
      table.boolean('is_active').defaultTo(true);
      table.timestamps(true, true);
    });
    console.log('✅ Tabela courses criada');

    // Criar tabela course_modules
    await db.schema.createTable('course_modules', (table) => {
      table.string('id').primary();
      table.string('course_id').notNullable();
      table.string('title').notNullable();
      table.text('description');
      table.integer('order_index').notNullable().defaultTo(0);
      table.boolean('is_active').defaultTo(true);
      table.timestamps(true, true);
    });
    console.log('✅ Tabela course_modules criada');

    // Criar tabela lessons
    await db.schema.createTable('lessons', (table) => {
      table.string('id').primary();
      table.string('module_id').notNullable();
      table.string('title').notNullable();
      table.text('description');
      table.string('type').notNullable();
      table.text('content');
      table.string('video_url');
      table.string('resource_url');
      table.integer('duration_minutes').defaultTo(0);
      table.integer('xp_reward').defaultTo(10);
      table.integer('order_index').notNullable().defaultTo(0);
      table.boolean('is_active').defaultTo(true);
      table.timestamps(true, true);
    });
    console.log('✅ Tabela lessons criada');
    
    console.log('🎉 Todas as tabelas foram criadas com sucesso!');
    
  } catch (error) {
    console.error('❌ Erro ao criar tabelas:', error);
  } finally {
    await db.destroy();
  }
};

createTables();
