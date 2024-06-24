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

import { StatusEnum } from 'src/shares/enums/note.enum';
import { MemberDto, NoteLineDto } from './create-note.dto';

export class ChangeMemberDto {
  @ApiProperty({
    required: true,
  })
  @IsNotEmpty()
  @IsMongoId()
  _id: string;

  @ApiProperty({ required: false, type: MemberDto, isArray: true })
  @IsOptional()
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => Object)
  readonly members: MemberDto[];
}

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

export class UpdateNoteDto {
  @ApiProperty({ required: true })
  @IsMongoId()
  _id?: string;

  @ApiProperty({ required: false })
  @IsMongoId()
  user_id?: string;

  @ApiProperty({ required: true })
  @IsString()
  readonly title: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  readonly desc: string;

  @ApiProperty({ required: false, example: '#FFFFFF' })
  @IsOptional()
  @IsString()
  readonly color: string;

  @ApiProperty({ required: true, type: Number, example: 1 })
  @IsNumber()
  status: Number;

  @ApiProperty({ required: false, type: Number, example: 0 })
  @IsOptional()
  @IsNumber()
  currency: Number;

  @ApiProperty({ required: false, type: MemberDto, isArray: true })
  @IsOptional()
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => Object)
  readonly members: MemberDto[];

  @ApiProperty({ required: false, type: NoteLineDto, isArray: true })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Object)
  readonly note_line?: NoteLineDto[];
}
