import { Injectable, OnModuleInit } from '@nestjs/common';
import { Kafka, Producer } from 'kafkajs';

@Injectable()
export class KafkaProducerService implements OnModuleInit {
    private kafka: Kafka;
    private producer: Producer;

    onModuleInit() {
        this.kafka = new Kafka({
            clientId: 'subscription-service',
            brokers: [process.env.KAFKA_BROKER||'localhost:9092'],
        });

        this.producer = this.kafka.producer();
        this.producer.connect().catch((error) => {
            console.error(error);
        });
    }

    async sendNotification( message:{user_id: number, message: string} ) {
        try {
            await this.producer.send({
                "topic": "notify",
                "messages": [{ value: JSON.stringify(message) }],
            });
        } catch (error) {
            console.log(error);
        }

    }

    async logSubscriptionCreated(message: any) {
        try {
            await this.producer.send({
                "topic": "subscription-created",
                "messages": [{ value: JSON.stringify(message) }]
            })
        } catch (err) {
            console.log(err);
        }
    }

    async logSubscriptionRemoved(message:any){
        try{
            await this.producer.send({
                "topic":"subscription-removed",
                "messages":[{value:JSON.stringify(message)}]
            })
        }catch(err){
            console.log(err);
        }
    }
}
