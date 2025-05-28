import * as dotenv from 'dotenv';
dotenv.config();
import { NestFactory } from '@nestjs/core';
import { SubscriptionServiceModule } from './subscription-service.module';
import { Pool } from 'pg';
import * as fs from 'fs';
import * as path from 'path';
import { ValidationPipe } from '@nestjs/common';

async function runDDL(pool: Pool) {
  const ddlPath = path.join(__dirname, '../../../schema.sql');
  const ddl = fs.readFileSync(ddlPath, 'utf8');
  await pool.query(ddl);
}

async function bootstrap() {
  const app = await NestFactory.create(SubscriptionServiceModule);

  const pool = new Pool({
    host: process.env.DB_HOST ||'localhost',
    port: Number(process.env.DB_PORT)||5432 ,
    user: process.env.DB_USER || "postgres",
    password: process.env.DB_PASS || "postgres",
    database: process.env.DB_NAME || "subscription",
  });

  try {
    await runDDL(pool);
    console.log('✅ Schema created (or already exists)');
  } catch (err) {
    console.error('❌ Failed to run DDL:', err);
    process.exit(1);
  } finally {
    await pool.end();
  }
   app.useGlobalPipes(new ValidationPipe());
  await app.listen(process.env.PORT ?? 3000);
  console.log('🚀 Service is running');
}

bootstrap()
  .catch((err) => {
    console.error('Shutting Down!!', err);
    process.exit(1);
  });
