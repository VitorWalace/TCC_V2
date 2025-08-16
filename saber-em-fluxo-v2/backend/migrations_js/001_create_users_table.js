exports.up = async function(knex) {
  return knex.schema.createTable('users', function(table) {
    // ID usando uuid para PostgreSQL, string para SQLite
    if (knex.client.config.client === 'postgresql') {
      table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    } else {
      table.string('id', 36).primary();
    }
    
    table.string('email', 255).notNullable().unique();
    table.string('password', 255).notNullable();
    table.string('first_name', 100).notNullable();
    table.string('last_name', 100).notNullable();
    table.text('bio').nullable();
    table.string('avatar_url', 500).nullable();
    table.string('phone', 20).nullable();
    
    // Role usando enum para PostgreSQL, string para SQLite
    if (knex.client.config.client === 'postgresql') {
      table.enum('role', ['student', 'instructor', 'admin']).defaultTo('student');
    } else {
      table.string('role', 20).defaultTo('student');
    }
    
    table.boolean('is_email_verified').defaultTo(false);
    table.boolean('is_active').defaultTo(true);
    table.timestamps(true, true);
    
    // Índices
    table.index(['email']);
    table.index(['role']);
    table.index(['created_at']);
  });
};

exports.down = async function(knex) {
  return knex.schema.dropTableIfExists('users');
};
