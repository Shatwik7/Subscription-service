import { Injectable } from '@nestjs/common';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { UpdateSubscriptionDto } from './dto/update-subscription.dto';
import { Pool, PoolConfig } from 'pg';
import { ReadSubscriptionDto } from './dto/read-subcription.dto';
import { PlansService } from '../plans/plans.service';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class SubscriptionService {
  private readonly pool: Pool;

  constructor(private readonly plansService: PlansService) {
    const config: PoolConfig = {
      host: process.env.DB_HOST||'localhost',
      port: Number(process.env.DB_HOST)||5432,
      user: process.env.DB_HOST||'postgres',
      password: process.env.DB_HOST||'postgres',
      database: process.env.DB_HOST||'subscription',
    };
    this.pool = new Pool(config);
  }
  async create(createSubscriptionDto: CreateSubscriptionDto): Promise<ReadSubscriptionDto> {
    const { userId, planId } = createSubscriptionDto;
    const query = `
      INSERT INTO subscriptions (user_id, plan_id, end_date,status)
      VALUES ($1, $2, $3, $4)
      RETURNING *;
    `;
    const plan = await this.plansService.findOne(planId);
    if (!plan) {
      throw new Error(`Plan with id ${planId} does not exist.`)
    }
    const end_date = new Date(Date.now() + plan.duration * 60 * 60 * 24 * 1000);
    const result = await this.pool.query(query, [userId, planId, end_date, 'active']);
    return result.rows[0] as ReadSubscriptionDto;
  }

  async findAll(): Promise<ReadSubscriptionDto[]> {
    const query = 'SELECT * FROM subscriptions;';
    const result = await this.pool.query(query);
    return result.rows as ReadSubscriptionDto[];
  }

  async findOne(user_id: number): Promise<ReadSubscriptionDto> {
    const query = 'SELECT * FROM subscriptions WHERE user_id = $1;';
    const result = await this.pool.query(query, [user_id]);
    return result.rows[0] as ReadSubscriptionDto;
  }

  async update(user_id: number, updateDto: UpdateSubscriptionDto): Promise<boolean> {
    const { planId, endDate, status } = updateDto;
    const query = `
      UPDATE subscriptions
      SET plan_id = $1, end_date = $2, status = $3, updated_at = NOW()
      WHERE user_id = $4
      RETURNING *;`;
    const result = await this.pool.query(query, [planId, endDate, status, user_id]);
    if (result.rowCount === 0) {
      return false;
    }
    return true;
  }

  async remove(user_id: number): Promise<boolean> {
    const query = 'DELETE FROM subscriptions WHERE user_id = $1 RETURNING *; ';
    const result = await this.pool.query(query, [user_id]);
    if (result.rowCount === 0) {
      return false;
    }
    return true;
  }

  //EXPIRATION QUERY RUNS EVERY HOUR
  @Cron(CronExpression.EVERY_HOUR)
  async expireSubscriptions() {
    const query = `
      UPDATE subscriptions
      SET status = 'expired', updated_at = NOW()
      WHERE end_date < NOW() AND status = 'active';
    `;
    try {
      const result = await this.pool.query(query);
      console.log(`Expired ${result.rowCount} subscriptions`);
    } catch (error) {
      console.error('Error expiring subscriptions:', error);
    }
  }
}
