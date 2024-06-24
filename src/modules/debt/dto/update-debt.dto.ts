import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsDate,
  IsEnum,
  IsString,
  IsArray,
  IsNumber,
  IsObject,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  ArrayMinSize,
  ValidateNested,
} from 'class-validator';

import { StatusEnum } from '../enum/debt.enum';

export class ChangeStatus {
  @ApiProperty({
    required: true,
  })
  @IsNotEmpty()
  @IsMongoId()
  _id: string;

  @ApiProperty({ required: true, enum: StatusEnum })
  @IsEnum(StatusEnum)
  status: StatusEnum;
}
