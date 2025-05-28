import { Injectable } from '@nestjs/common';
import { CreatePlanDto } from './dto/create-plan.dto';
import { UpdatePlanDto } from './dto/update-plan.dto';
import { Pool, PoolConfig } from 'pg';
import { ReadPlanDto } from './dto/read-plan.dto';
@Injectable()
export class PlansService {
  private readonly pool: Pool;
  
    constructor() {
      const config: PoolConfig = {
      host: process.env.DB_HOST||'localhost',
      port: Number(process.env.DB_HOST)||5432,
      user: process.env.DB_HOST||'postgres',
      password: process.env.DB_HOST||'postgres',
      database: process.env.DB_HOST||'subscription',
      };
    
      this.pool = new Pool(config);
    }

    async create(createPlanDto: CreatePlanDto) {
      try {
      const { name, price, features, duration } = createPlanDto;
      const query = `
      INSERT INTO plans (name, price, features, duration)
      VALUES ($1, $2, $3, $4)
      RETURNING *;
      `;
      const values = [name, price, features, duration];
      const result = await this.pool.query(query, values);
      return result.rows[0] as ReadPlanDto;
      } catch (error) {
      throw new Error(`Failed to create plan: ${error.message}`);
      }
    }

    async findAll() {
      try {
      const query = 'SELECT * FROM plans;';
      const result = await this.pool.query(query);
      return result.rows as ReadPlanDto[];
      } catch (error) {
      throw new Error(`Failed to fetch plans: ${error.message}`);
      }
    }

    async findOne(id: number) {
      try {
      const query = 'SELECT * FROM plans WHERE id = $1;';
      const result = await this.pool.query(query, [id]);
      return result.rows[0] as ReadPlanDto;
      } catch (error) {
      throw new Error(`Failed to fetch plan with id ${id}: ${error.message}`);
      }
    }

    async update(id: number, updatePlanDto: UpdatePlanDto) {
      try {
      const { name, price, features, duration } = updatePlanDto;
      const query = `
      UPDATE plans
      SET name = $1, price = $2, features = $3, duration = $4
      WHERE id = $5
      RETURNING *;
      `;
      const values = [name, price, features, duration, id];
      await this.pool.query(query, values);
      return true;
      } catch (error) {
      throw new Error(`Failed to update plan with id ${id}: ${error.message}`);
      }
    }

    async remove(id: number) {
      try {
      const query = 'DELETE FROM plans WHERE id = $1 RETURNING *;';
      await this.pool.query(query, [id]);
      return true;
      } catch (error) {
      throw new Error(`Failed to delete plan with id ${id}: ${error.message}`);
      }
    }
}
