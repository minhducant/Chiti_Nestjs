import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { FriendService } from './friend.service';
import { FriendController } from './friend.controller';
import { UserModule } from 'src/modules/user/user.module';
import { User, UserSchema } from '../user/schemas/user.schema';
import { Friend, FriendSchema } from './schemas/friend.schema';
import { NotificationModule } from 'src/modules/notification/notification.module';

@Module({
  imports: [
    UserModule,
    NotificationModule,
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([{ name: Friend.name, schema: FriendSchema }]),
  ],
  providers: [FriendService],
  controllers: [FriendController],
  exports: [FriendService],
})
export class FriendModule {}
