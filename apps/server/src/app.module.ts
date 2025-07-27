import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user/user.module';
import { config } from 'shared/config';

@Module({
  imports: [
    MongooseModule.forRoot(config.db.url),
    UserModule,
  ],
})
export class AppModule {}
