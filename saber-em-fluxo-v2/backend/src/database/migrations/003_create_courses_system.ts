// FILE: /backend/src/database/migrations/003_create_courses_system.ts
import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  // Tabela de cursos
  await knex.schema.createTable('courses', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.string('title').notNullable();
    table.text('description');
    table.string('category').notNullable();
    table.string('difficulty').notNullable(); // Iniciante, Intermediário, Avançado
    table.string('cover_image_url');
    table.integer('estimated_hours').defaultTo(0);
    table.integer('xp_reward').defaultTo(0);
    table.uuid('instructor_id').notNullable().references('id').inTable('users');
    table.boolean('is_published').defaultTo(false);
    table.boolean('is_active').defaultTo(true);
    table.timestamps(true, true);
    
    // Indexes para performance
    table.index(['category', 'is_published']);
    table.index(['instructor_id']);
  });

  // Tabela de módulos
  await knex.schema.createTable('course_modules', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('course_id').notNullable().references('id').inTable('courses').onDelete('CASCADE');
    table.string('title').notNullable();
    table.text('description');
    table.integer('order_index').notNullable().defaultTo(0);
    table.boolean('is_active').defaultTo(true);
    table.timestamps(true, true);
    
    table.index(['course_id', 'order_index']);
  });

  // Tabela de aulas
  await knex.schema.createTable('lessons', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('module_id').notNullable().references('id').inTable('course_modules').onDelete('CASCADE');
    table.string('title').notNullable();
    table.text('description');
    table.string('type').notNullable(); // video, text, quiz, assignment
    table.text('content'); // Para conteúdo de texto ou JSON para quiz
    table.string('video_url');
    table.string('resource_url');
    table.integer('duration_minutes').defaultTo(0);
    table.integer('xp_reward').defaultTo(10);
    table.integer('order_index').notNullable().defaultTo(0);
    table.boolean('is_free').defaultTo(false);
    table.boolean('is_active').defaultTo(true);
    table.timestamps(true, true);
    
    table.index(['module_id', 'order_index']);
  });

  // Tabela de matrículas
  await knex.schema.createTable('enrollments', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('user_id').notNullable().references('id').inTable('users').onDelete('CASCADE');
    table.uuid('course_id').notNullable().references('id').inTable('courses').onDelete('CASCADE');
    table.timestamp('enrolled_at').defaultTo(knex.fn.now());
    table.timestamp('completed_at');
    table.integer('progress_percentage').defaultTo(0);
    table.integer('current_lesson_id');
    table.boolean('is_active').defaultTo(true);
    table.timestamps(true, true);
    
    // Unique constraint - um usuário não pode se matricular duas vezes no mesmo curso
    table.unique(['user_id', 'course_id']);
    table.index(['user_id']);
    table.index(['course_id']);
  });

  // Tabela de progresso das aulas
  await knex.schema.createTable('lesson_progress', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('user_id').notNullable().references('id').inTable('users').onDelete('CASCADE');
    table.uuid('lesson_id').notNullable().references('id').inTable('lessons').onDelete('CASCADE');
    table.uuid('enrollment_id').notNullable().references('id').inTable('enrollments').onDelete('CASCADE');
    table.boolean('is_completed').defaultTo(false);
    table.integer('completion_percentage').defaultTo(0);
    table.integer('time_spent_minutes').defaultTo(0);
    table.timestamp('started_at').defaultTo(knex.fn.now());
    table.timestamp('completed_at');
    table.json('quiz_answers'); // Para armazenar respostas de quiz
    table.integer('quiz_score').defaultTo(0);
    table.timestamps(true, true);
    
    table.unique(['user_id', 'lesson_id']);
    table.index(['user_id', 'enrollment_id']);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('lesson_progress');
  await knex.schema.dropTableIfExists('enrollments');
  await knex.schema.dropTableIfExists('lessons');
  await knex.schema.dropTableIfExists('course_modules');
  await knex.schema.dropTableIfExists('courses');
}
