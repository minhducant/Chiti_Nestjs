import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsMongoId, IsNotEmpty } from 'class-validator';

export class IdDto {
  @ApiProperty({
    required: true,
  })
  @IsNotEmpty()
  @IsMongoId()
  id: string;
}

export class IdsDto {
  @ApiProperty({
    required: true,
    type: [String],
  })
  @IsNotEmpty()
  @IsArray()
  ids: string[];
}
