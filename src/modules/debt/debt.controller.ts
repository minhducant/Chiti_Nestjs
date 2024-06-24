import {
  Get,
  Put,
  Post,
  Body,
  Query,
  Param,
  Patch,
  Delete,
  Controller,
} from '@nestjs/common';

import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { Debt } from './schemas/debt.schema';
import { DebtService } from './debt.service';
import { GetDebtDto } from './dto/get-debt.dto';
import { IdDto } from 'src/shares/dtos/param.dto';
import { ChangeStatus } from './dto/update-debt.dto';
import { CreateDebtDto } from './dto/create-debt.dto';
import { ResPagingDto } from 'src/shares/dtos/pagination.dto';
import { UserID } from 'src/shares/decorators/get-user-id.decorator';

@ApiTags('Debt - Sổ ghi nợ')
@Controller('debt')
export class DebtController {
  constructor(private readonly debtService: DebtService) {}

  @ApiBearerAuth()
  @Get()
  @ApiOperation({ summary: '[Debt] Get debts', description: 'Display debts' })
  async find(
    @UserID() userId: string,
    @Query() query: GetDebtDto,
  ): Promise<ResPagingDto<Debt[]>> {
    return this.debtService.geDebts(query, userId);
  }

  @Get(':id')
  @ApiBearerAuth()
  @ApiOperation({
    summary: '[Debt] Get debt',
  })
  async findOne(@Param() { id }: IdDto): Promise<ResPagingDto<Debt>> {
    return this.debtService.findDebtById(id);
  }

  @Post('/create')
  @ApiBearerAuth()
  @ApiOperation({
    summary: '[Debt] Create debt',
  })
  async createNote(
    @Body() body: CreateDebtDto,
    @UserID() userId: string,
  ): Promise<void> {
    await this.debtService.createDebt(body, userId);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @ApiOperation({
    summary: '[Debt] Delete debt',
  })
  async delete(@Param() { id }: IdDto): Promise<void> {
    await this.debtService.deleteDebt(id);
  }

  @Patch('/change_status')
  @ApiBearerAuth()
  @ApiOperation({
    summary: '[Debt] Change status debt',
  })
  async changeStatusById(@Body() body: ChangeStatus): Promise<void> {
    await this.debtService.changeDebtStatus(body);
  }
}
