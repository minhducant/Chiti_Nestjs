import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsString, IsMongoId, ValidateNested } from 'class-validator';

export class DataDto {
  [key: string]: string;
}

export class SendNotificationDto {
  @ApiProperty({ required: true, example: '65e1711ef5f60e3a0f3ce603' })
  @IsMongoId()
  readonly user_id: string;

  @ApiProperty({ required: true })
  @IsString()
  readonly title: string;

  @ApiProperty({ required: false })
  @IsString()
  readonly body: string;

  @ApiProperty({
    required: false,
    type: DataDto,
    example: { type: 'note', id: '65f2cd9fd8c74ec326027960' },
  })
  @ValidateNested({ each: false })
  @Type(() => DataDto)
  data: DataDto;
}
