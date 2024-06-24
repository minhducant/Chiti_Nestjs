import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { DebtService } from './debt.service';
import { DebtController } from './debt.controller';
import { Debt, DebtSchema } from './schemas/debt.schema';
import { User, UserSchema } from '../user/schemas/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Debt.name, schema: DebtSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  providers: [DebtService],
  controllers: [DebtController],
})
export class DebtModule {}
