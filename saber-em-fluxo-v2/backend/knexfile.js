"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const config = {
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
//# sourceMappingURL=knexfile.js.map