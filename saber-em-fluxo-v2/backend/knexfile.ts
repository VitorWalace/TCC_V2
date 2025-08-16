import type { Knex } from "knex";
import dotenv from "dotenv";

dotenv.config();

const config: { [key: string]: Knex.Config } = {
  development: {
    client: "sqlite3",
    connection: {
      filename: "./src/database/database.db"
    },
    useNullAsDefault: true,
    migrations: {
      tableName: "knex_migrations",
      directory: "./src/database/migrations",
    },
    seeds: {
      directory: "./src/database/seeds",
    },
  },

  production: {
    client: "postgresql",
    connection: process.env.DATABASE_URL || process.env.POSTGRES_URL,
    pool: {
      min: 2,
      max: 20,
    },
    migrations: {
      tableName: "knex_migrations",
      directory: "./src/database/migrations",
    },
    seeds: {
      directory: "./src/database/seeds",
    },
  },
};

module.exports = config;
