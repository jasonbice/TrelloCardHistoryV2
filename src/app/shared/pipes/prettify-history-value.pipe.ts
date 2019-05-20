import { Pipe, PipeTransform } from '@angular/core';
import { Utils } from '../utils';

@Pipe({
  name: 'prettifyHistoryValue'
})
export class PrettifyHistoryValuePipe implements PipeTransform {

  static readonly DEFAULT_MAX_LENGTH: number = 65;
  static readonly DEFAULT_REPLACE_EMPTY_WITH: string = '(None)';
  static readonly DEFAULT_TRUNCATE_APPEND: string = '...';

  transform(value: string, maxLength?: number, truncateAppend?: string, replaceWithIfNullOrEmpty?: string): string {
    const _maxLength = maxLength ? maxLength: PrettifyHistoryValuePipe.DEFAULT_MAX_LENGTH;
    const _truncateAppend = truncateAppend ? truncateAppend : PrettifyHistoryValuePipe.DEFAULT_TRUNCATE_APPEND;
    const _replaceWithIfNullOrEmpty = replaceWithIfNullOrEmpty ? replaceWithIfNullOrEmpty : PrettifyHistoryValuePipe.DEFAULT_REPLACE_EMPTY_WITH;

    let retVal = this.truncateIfTooLong(value, _maxLength, _truncateAppend);

    return this.replaceNullOrWhiteSpace(retVal, _replaceWithIfNullOrEmpty);
  }

  truncateIfTooLong(value: string, maxLength: number, append?: string): string {
    return (value && value.length > maxLength) ? value.substring(0, maxLength) + (append ? append : '') : value;
  }

  replaceNullOrWhiteSpace(value: string, replaceWithIfNullOrEmpty: string): string {
    return Utils.isNullOrWhiteSpace(value) ? replaceWithIfNullOrEmpty : value;
  }
}
