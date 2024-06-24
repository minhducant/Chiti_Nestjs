import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';

import { UploadService } from './upload.service';
import { UploadController } from './upload.controller';
// import { GridFsMulterConfigService } from './multer-config.service';

@Module({
  // imports: [
  //   MulterModule.registerAsync({
  //     useClass: GridFsMulterConfigService,
  //   }),
  // ],
  controllers: [UploadController],
  providers: [UploadService],
  // providers: [UploadService, GridFsMulterConfigService],
})
export class UploadModule {}
