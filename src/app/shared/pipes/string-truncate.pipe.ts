import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'stringTruncate'
})
export class StringTruncatePipe implements PipeTransform {

  transform(value: string, length: number, append?: string): string {
    return (value && value.length > length) ? value.substring(0, length) + (append ? append : '') : value;
  }
}
