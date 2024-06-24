import { BadRequestException } from '@nestjs/common';
import { contentType as detectContentType, extension } from 'mime-types';

export enum UploadFileTypes {
  IMAGE = 'image',
  VIDEO = 'video',
}

export const SupportedImageMIMETypes = [
  'image/apng',
  'image/png',
  'image/jpeg',
  'image/avif',
  'image/gif',
  'image/svg+xml',
  'image/webp',
  'image/bmp',
];

export const getContentType = (fileName: string): any => {
  const contentType = detectContentType(fileName);
  const ext = extension(contentType || '');
  if (!contentType || !ext) {
    throw new BadRequestException('File name is not valid');
  }
  return {
    ContentType: contentType,
    extension: ext,
  };
};
