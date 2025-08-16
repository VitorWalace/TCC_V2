const dotenv = require('dotenv');
dotenv.config();

module.exports = {
  development: {
    client: 'sqlite3',
    connection: {
      filename: './src/database/database.db'
    },
    useNullAsDefault: true,
    migrations: {
      tableName: 'knex_migrations',
      directory: './migrations_js'
    },
    seeds: {
      directory: './seeds_js'
    }
  },

  production: {
    client: 'postgresql',
    connection: process.env.DATABASE_URL || process.env.POSTGRES_URL,
    pool: {
      min: 2,
      max: 20
    },
    migrations: {
      tableName: 'knex_migrations',
      directory: './migrations_js'
    },
    seeds: {
      directory: './seeds_js'
    }
  }
};
