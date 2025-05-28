import { Injectable, OnModuleInit } from '@nestjs/common';
import { Kafka, Consumer } from 'kafkajs';
import { NotificationConsumerService } from './notification-consumer.service';

@Injectable()
export class KafkaConsumerService implements OnModuleInit {
    private kafka = new Kafka({
        clientId: 'notification-service',
        brokers: [process.env.KAFKA_BROKER||'localhost:9092'],
    });

    private consumer: Consumer;

    constructor(private readonly NotificationConsumerService: NotificationConsumerService) { }

    async onModuleInit() {
        this.consumer = this.kafka.consumer({ groupId: 'notification-group' });
        await this.consumer.connect();

        await this.consumer.subscribe({ topic: 'notify', fromBeginning: false });

        await this.consumer.run({
            eachMessage: async ({ message }) => {
                if (message && message.value) {
                    const parsed = JSON.parse(message.value.toString());
                    await this.NotificationConsumerService.Notify(parsed);
                }

            },
        });

        console.log('✅ Kafka consumer listening for notifications...');
    }
}
