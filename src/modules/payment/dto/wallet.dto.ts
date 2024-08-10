import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsMongoId,
  IsOptional,
  IsEnum,
  ValidateIf,
} from 'class-validator';

import { WalletType } from '../schemas/wallet.schema';
import { PaginationDto } from 'src/shares/dtos/pagination.dto';

export class GetWalletDto extends PaginationDto {
  @ApiProperty({
    required: false,
    enum: WalletType,
    // default: WalletType.BANK_CARD,
  })
  @IsOptional()
  @IsEnum(WalletType)
  readonly type?: WalletType;
}

export class AddWalletDto {
  @ApiProperty({ required: true, default: 'Do Minh Duc' })
  @IsString()
  readonly name: string;

  @ApiProperty({
    required: true,
    enum: WalletType,
    default: WalletType.BANK_CARD,
  })
  @IsEnum(WalletType)
  readonly type: WalletType;

  @ApiProperty({ required: true, default: '970423' })
  @ValidateIf((o) => o.type === WalletType.BANK_CARD)
  @IsOptional()
  @IsString()
  readonly bank_bin: string;

  @ApiProperty({ required: true, default: 'Ngân hàng TMCP Tiên Phong' })
  @ValidateIf((o) => o.type === WalletType.BANK_CARD)
  @IsOptional()
  @IsString()
  readonly bank_name: string;

  @ApiProperty({
    required: false,
    default: 'https://api.vietqr.io/img/TPB.png',
  })
  @ValidateIf((o) => o.type === WalletType.BANK_CARD)
  @IsOptional()
  @IsString()
  readonly bank_logo: string;

  @ApiProperty({ required: false, default: '03639886616' })
  @ValidateIf((o) => o.type === WalletType.BANK_CARD)
  @IsOptional()
  @IsString()
  readonly account_no: string;

  @ApiProperty({ required: false, default: 'minhduc.gco@gmail.com' })
  @ValidateIf((o) => o.type === WalletType.PAYPAL)
  @IsOptional()
  @IsString()
  readonly paypal_email: string;
}

export class UpdateWalletDto {
  @ApiProperty({ required: true, default: '' })
  @IsOptional()
  @IsMongoId()
  readonly _id: string;

  // @ApiProperty({ required: true, default: '' })
  // @IsOptional()
  // @IsMongoId()
  // readonly user_id: string;

  @ApiProperty({ required: true, default: 'Do Minh Duc' })
  @IsString()
  readonly name: string;

  @ApiProperty({
    required: true,
    enum: WalletType,
    default: WalletType.BANK_CARD,
  })
  @IsEnum(WalletType)
  readonly type: WalletType;

  @ApiProperty({ required: true, default: '970423' })
  @ValidateIf((o) => o.type === WalletType.BANK_CARD)
  @IsOptional()
  @IsString()
  readonly bank_bin: string;

  @ApiProperty({ required: true, default: 'Ngân hàng TMCP Tiên Phong' })
  @ValidateIf((o) => o.type === WalletType.BANK_CARD)
  @IsOptional()
  @IsString()
  readonly bank_name: string;

  @ApiProperty({
    required: false,
    default: 'https://api.vietqr.io/img/TPB.png',
  })
  @ValidateIf((o) => o.type === WalletType.BANK_CARD)
  @IsOptional()
  @IsString()
  readonly bank_logo: string;

  @ApiProperty({ required: false, default: '03639886616' })
  @ValidateIf((o) => o.type === WalletType.BANK_CARD)
  @IsOptional()
  @IsString()
  readonly account_no: string;

  @ApiProperty({ required: false, default: 'minhduc.gco@gmail.com' })
  @ValidateIf((o) => o.type === WalletType.PAYPAL)
  @IsOptional()
  @IsString()
  readonly paypal_email: string;
}
