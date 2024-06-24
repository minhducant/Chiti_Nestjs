import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { FriendService } from './friend.service';
import { FriendController } from './friend.controller';
import { UserModule } from 'src/modules/user/user.module';
import { User, UserSchema } from '../user/schemas/user.schema';

@Module({
  imports: [
    UserModule,
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  providers: [FriendService],
  controllers: [FriendController],
  exports: [FriendService],
})
export class FriendModule {}
