
import { PipeTransform, Injectable } from '@nestjs/common';

@Injectable()
export class FileTypeValidationPipe implements PipeTransform {
  transform(value: any) {
    if (value.mimetype === 'image/jpeg' || value.mimetype === 'image/png')
      return value;
    return (false);
  }
}
