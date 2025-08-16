import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("users", (table) => {
    // Chave primária - compatível com SQLite e PostgreSQL
    if (knex.client.config.client === "postgresql") {
      table.uuid("id").primary().defaultTo(knex.raw("gen_random_uuid()"));
    } else {
      table.string("id", 36).primary();
    }
    
    // Informações básicas
    table.string("email", 255).notNullable().unique();
    table.string("password", 255).notNullable();
    table.string("first_name", 100).notNullable();
    table.string("last_name", 100).notNullable();
    
    // Perfil do utilizador
    table.text("bio").nullable();
    table.string("avatar_url", 500).nullable();
    table.string("phone", 20).nullable();
    
    // Configurações e estatísticas
    if (knex.client.config.client === "postgresql") {
      table.enum("role", ["student", "instructor", "admin"]).defaultTo("student");
    } else {
      table.string("role", 20).defaultTo("student");
    }
    table.boolean("is_email_verified").defaultTo(false);
    table.boolean("is_active").defaultTo(true);
    
    // Timestamps
    table.timestamps(true, true);
    
    // Índices para performance
    table.index(["email"]);
    table.index(["role"]);
    table.index(["is_active"]);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists("users");
}
