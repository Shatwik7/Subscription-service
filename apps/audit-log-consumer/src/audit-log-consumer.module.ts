import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { LogModule } from "./logs/log.module";

@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGO_URI||'mongodb://localhost:27017/logs'),
    LogModule,
  ],
})
export class AuditLogConsumerModule {}
