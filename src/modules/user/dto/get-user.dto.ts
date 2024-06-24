import { IsEmail, IsMongoId } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GetUserDto {
  @ApiProperty({
    description: 'User ID',
    example: '6440d750376fd29eb0a33c41',
  })
  @IsMongoId()
  id?: string;

  @ApiProperty({
    required: true,
    example: 'Ha Noi',
  })
  address?: string;

  @ApiProperty({
    example: 'john.doe@example.com',
    description: 'The email address of the user',
    format: 'email',
  })
  @IsEmail({}, { message: 'Invalid email address' })
  email?: string;
}
