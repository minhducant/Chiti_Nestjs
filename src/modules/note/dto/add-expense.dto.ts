import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  ValidateNested,
} from 'class-validator';

import { NoteLineDto } from './create-note.dto';

export class AddExpenseDto {
  @ApiProperty({
    required: true,
  })
  @IsNotEmpty()
  @IsMongoId()
  _id: string;

  @ApiProperty({ required: true })
  @ValidateNested({ each: true })
  @Type(() => Object)
  expense: NoteLineDto;
}
