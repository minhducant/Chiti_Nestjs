import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEnum, IsOptional } from 'class-validator';

export enum Bank {
  Vietcombank = 'vietcombank',
  BIDV = 'bidv',
  VPBank = 'vpbank',
  HDBank = 'hdbank',
  Agribank = 'agribank',
  TPBank = 'tpbank',
  NHNN = 'nhnn', //Ngân hàng nhà nước
}

export enum TypeKQSX {
  kqsx = 'kqsx',
  vietlott = 'vietlott',
}

export enum TypeVietlott {
  mega645 = 'mega645',
  power655 = 'power655',
  max3d = 'max3d',
  keno = 'keno',
}

export enum ProvinceVN {
  MienBac = 'xsmb-mien-bac',
  MienTrung = 'xsmt-mien-trung',
  MienNam = 'xsmn-mien-nam',
  AnGiang = 'xsag-an-giang',
  BacLieu = 'xsbl-bac-lieu',
  BenTre = 'xsbt-ben-tre',
  BinhDinh = 'xsbdi-binh-dinh',
  BinhDuong = 'xsbd-binh-duong',
  BinhPhuoc = 'xsbp-binh-phuoc',
  BinhThuan = 'xsbth-binh-thuan',
  CaMau = 'xscm-ca-mau',
  CanTho = 'xsct-can-tho',
  DaLat = 'xsdl-da-lat',
  DaNang = 'xsdna-da-nang',
  DakLak = 'xsdlk-dak-lak',
  DakNong = 'xsdno-dak-nong',
  DongNai = 'xsdn-dong-nai',
  DongThap = 'xsdt-dong-thap',
  GiaLai = 'xsgl-gia-lai',
  HauGiang = 'xshg-hau-giang',
  ThuaThienHue = 'xstth-hue',
  KhanhHoa = 'xskh-khanh-hoa',
  KienGiang = 'xskg-kien-giang',
  KonTum = 'xskt-kon-tum',
  LongAn = 'xsla-long-an',
  NinhThuan = 'xsnt-ninh-thuan',
  PhuYen = 'xspy-phu-yen',
  QuangBinh = 'xsqb-quang-binh',
  QuangNam = 'xsqna-quang-nam',
  QuangNgai = 'xsqn-quang-ngai',
  QuangTri = 'xsqt-quang-tri',
  SocTrang = 'xsst-soc-trang',
  TayNinh = 'xstn-tay-ninh',
  TienGiang = 'xstg-tien-giang',
  Tphcm = 'xshcm-hcm',
  TraVinh = 'xstv-tra-vinh',
  VinhLong = 'xsvl-vinh-long',
  VungTau = 'xsvt-vung-tau',
}

export class ExchangeRateQueryDto {
  @ApiProperty({
    enum: Bank,
    example: Bank.Vietcombank,
    required: true,
  })
  @IsEnum(Bank)
  @IsOptional()
  bank?: Bank;
}

export class KQSXQueryDto {
  @ApiProperty({
    enum: TypeKQSX,
    example: TypeKQSX.kqsx,
    required: true,
  })
  @IsEnum(TypeKQSX)
  @IsOptional()
  type?: TypeKQSX;

  @ApiProperty({
    enum: ProvinceVN,
    example: ProvinceVN.MienBac,
    required: false,
  })
  @IsEnum(ProvinceVN)
  @IsOptional()
  province?: ProvinceVN;

  @ApiProperty({
    enum: TypeVietlott,
    required: false,
  })
  @IsEnum(TypeVietlott)
  @IsOptional()
  type_vietlott?: TypeVietlott;

  @ApiProperty({ required: false })
  @IsOptional()
  date?: string;
}

export class LogTelegramDto {
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  readonly message: string;
}
