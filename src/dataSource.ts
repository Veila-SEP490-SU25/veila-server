import { DataSource } from "typeorm";
import * as dotenv from 'dotenv';

const envFile = `.env.${process.env.NODE_ENV || 'development'}`;
dotenv.config({ path: envFile });

export default new DataSource({
    type: 'mysql',
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT as string),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    entities: [__dirname + '/**/*.model.{js,ts}'],
    charset: 'utf8mb4_unicode_ci',
    synchronize: false,
    migrations: [__dirname + '/migrations/*.{js,ts}'],
    migrationsTableName: 'veila_migration_db',
})