import mongoose, { Model } from 'mongoose';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel, InjectConnection } from '@nestjs/mongoose';

import { GetDebtDto } from './dto/get-debt.dto';
import { ChangeStatus } from './dto/update-debt.dto';
import { CreateDebtDto } from './dto/create-debt.dto';
import { Debt, DebtDocument } from './schemas/debt.schema';
import { ResPagingDto } from 'src/shares/dtos/pagination.dto';
import { User, UserDocument } from '../user/schemas/user.schema';

@Injectable()
export class DebtService {
  constructor(
    private readonly eventEmitter: EventEmitter2,
    @InjectModel(Debt.name) private debtModel: Model<DebtDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectConnection() private readonly connection: mongoose.Connection,
  ) {}

  async geDebts(
    GetDebtDto: GetDebtDto,
    user_id: string,
  ): Promise<ResPagingDto<Debt[]>> {
    const { sort, page, limit, status, lender_id, borrower_id } = GetDebtDto;

    const query: any = {};
    if (status) {
      query.status = status;
    }
    if (lender_id) {
      query.lender_id = new mongoose.Types.ObjectId(lender_id);
    }
    if (borrower_id) {
      query.borrower_id = new mongoose.Types.ObjectId(borrower_id);
    }

    const pipeline = [
      { $match: query },
      { $sort: { createdAt: sort } },
      { $skip: (page - 1) * limit },
      { $limit: limit },
    ];

    const [result, total] = await Promise.all([
      this.debtModel.aggregate(pipeline).exec(),
      this.debtModel.countDocuments(query),
    ]);

    return {
      result,
      total,
      lastPage: Math.ceil(total / limit),
    };
  }

  async findDebtById(_id: string): Promise<ResPagingDto<Debt>> {
    return await this.debtModel.findById(_id);
  }

  async createDebt(payload: CreateDebtDto, create_by: string): Promise<void> {
    await this.debtModel.create({
      ...payload,
    });
  }

  async deleteDebt(_id: string): Promise<void> {
    const debtToDelete = await this.debtModel.findById(_id);
    if (!debtToDelete) {
      throw new BadRequestException('Debt not found');
    }
    if (![3, 2, 0].includes(debtToDelete.status)) {
      throw new BadRequestException('Cannot delete debt with current status');
    }
    await this.debtModel.findByIdAndDelete(_id);
  }

  async changeDebtStatus(dto: ChangeStatus): Promise<void> {
    const { _id, status } = dto;
    const validStatus = [0, 1, 2, 3];
    if (!validStatus.includes(status)) {
      throw new BadRequestException('Invalid status value');
    }
    await this.debtModel.findByIdAndUpdate(_id, { status: status });
  }
}
