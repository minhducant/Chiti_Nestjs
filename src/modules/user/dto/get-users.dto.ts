import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsMongoId, IsOptional, IsString } from 'class-validator';

import { PaginationDto } from 'src/shares/dtos/pagination.dto';
import { Trim } from 'src/shares/decorators/transforms.decorator';

export class GetUsersDto extends PaginationDto {
  @ApiProperty({ required: false, type: String })
  @IsOptional()
  @IsMongoId()
  @Trim()
  readonly id?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  readonly name?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  readonly user_id?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsEmail()
  readonly email?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsEmail()
  readonly phone?: string;
}
