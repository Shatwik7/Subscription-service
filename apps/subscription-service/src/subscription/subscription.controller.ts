import { Controller, Get, Post, Body, Param, Delete, HttpCode, BadRequestException, NotFoundException, Put } from '@nestjs/common';
import { SubscriptionService } from './subscription.service';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { UpdateSubscriptionDto } from './dto/update-subscription.dto';
import { KafkaProducerService } from '../KafkaProducer/kafka.service';
@Controller('subscription')
export class SubscriptionController {
  constructor(private readonly subscriptionService: SubscriptionService,
    private readonly kafkaProducerService: KafkaProducerService
  ) { }

  @Post()
  @HttpCode(201)
  async create(@Body() createSubscriptionDto: CreateSubscriptionDto) {
    try {
      const data = await this.subscriptionService.create(createSubscriptionDto);
      const log = this.kafkaProducerService.logSubscriptionCreated(createSubscriptionDto);
      const notify = this.kafkaProducerService.sendNotification(
        {
          user_id: createSubscriptionDto.userId,
          message: "successfully created the "
        })
      await Promise.all([log, notify])
      return data;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Get()
  @HttpCode(200)
  findAll() {
    return this.subscriptionService.findAll();
  }

  @Get(':id')
  @HttpCode(200)
  async findOne(@Param('id') id: string) {
    try {
      const data = await this.subscriptionService.findOne(+id);
      if (!data) {
        throw new NotFoundException();
      }
      return data
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateSubscriptionDto: UpdateSubscriptionDto) {
    try {
      const data = await this.subscriptionService.update(+id, updateSubscriptionDto);
      return {success:data};
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  @Delete(':id')
  @HttpCode(200)
  async remove(@Param('id') id: string) {
    try {
      const data = await this.subscriptionService.remove(+id);
      await this.kafkaProducerService.logSubscriptionRemoved({user_id:id,success:data});
      return {success:data};
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }
}
