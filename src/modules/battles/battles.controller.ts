import { ApiBearerAuth, ApiOperation, ApiTags, ApiBody } from '@nestjs/swagger';
import { Get, Post, Body, Query, Param, Controller } from '@nestjs/common';

import { IdDto } from 'src/shares/dtos/param.dto';
import { Battles } from './schemas/battles.schema';
import { BattlesService } from './battles.service';
import { PlayBattlesDto } from './dto/play-battles.dto';
import { GetBattlesDto } from './dto/get-battles.dto';
import { CreateBattlesDto } from './dto/create-battles.dto';
import { ResPagingDto } from 'src/shares/dtos/pagination.dto';
import { UserID } from 'src/shares/decorators/get-user-id.decorator';

@ApiTags('Battles - Numerics Battles')
@ApiBearerAuth()
@Controller('battles')
export class BattlesController {
  constructor(private battlesService: BattlesService) {}

  @Get()
  @ApiOperation({ summary: '[Battles] Get Battles' })
  async find(
    @UserID() userId: string,
    @Query() query: GetBattlesDto,
  ): Promise<ResPagingDto<Battles[]>> {
    return this.battlesService.find(query, userId);
  }

  @Get(':id')
  @ApiBearerAuth()
  @ApiOperation({
    summary: '[Battles] Get Battle',
  })
  async findOne(@Param() { id }: IdDto): Promise<Battles> {
    return this.battlesService.findById(id);
  }

  @Post()
  @ApiBearerAuth()
  @ApiOperation({ summary: '[Battles] Create Battle' })
  @ApiBody({ type: CreateBattlesDto })
  async create(@Body() createBattlesDto: CreateBattlesDto): Promise<Battles> {
    return this.battlesService.create(createBattlesDto);
  }

  @Post('play')
  @ApiBearerAuth()
  @ApiOperation({ summary: '[Battles] Play Numerics Battles' })
  @ApiBody({ type: PlayBattlesDto })
  async play(
    @Body() playBattlesDto: PlayBattlesDto,
    @UserID() userId: string,
  ): Promise<Battles> {
    return this.battlesService.play(playBattlesDto, userId);
  }
}
