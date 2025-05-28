import { Injectable, OnModuleInit } from '@nestjs/common';
import { Kafka, Consumer } from 'kafkajs';
import { LogService } from './logs/log.service';


@Injectable()
export class KafkaConsumerService implements OnModuleInit {
    private readonly kafka = new Kafka({
        clientId: 'notification-consumer',
        brokers: ['localhost:9092'], // change this to match your Kafka broker
    });

    private readonly consumer: Consumer = this.kafka.consumer({ groupId: 'notification-group' });

    constructor(
        private readonly logService: LogService,
    ) { }

    async onModuleInit() {
        await this.consumer.connect();

        await this.consumer.subscribe({ topic: 'subscription-created', fromBeginning: false });
        await this.consumer.subscribe({ topic: 'subscription-removed', fromBeginning: false });

        await this.consumer.run({
            eachMessage: async ({ topic, message }) => {
                if (message.value) {
                    const parsed = JSON.parse(message.value.toString());
                    console.log(`📥 Received message on topic "${topic}"`, parsed);

                    switch (topic) {
                        case 'subscription-created':
                            await this.logService.create('subscription-created', parsed as JSON);
                            break;

                        case 'subscription-removed':
                            await this.logService.create('subscription-removed', parsed as JSON);
                            break;
                    }
                }

            },
        });

        console.log('✅ Kafka consumer is listening for subscription events...');
    }
}
