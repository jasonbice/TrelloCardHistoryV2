import { StringTruncatePipe } from './string-truncate.pipe';

describe('StringTruncatePipe', () => {
  const MAX_LENGTH = 10;
  const EXAMPLE_LONG = 'This is a string that is too long.';
  const EXAMPLE_SHORT = 'Shorter';
  const EXAMPLE_EQUAL = 'Exactly 10';
  const APPEND_ELLIPSIS = '...';

  it('create an instance', () => {
    const pipe = new StringTruncatePipe();
    expect(pipe).toBeTruthy();
  });

  it('should truncate a string that is longer than the maximum length and not append anything', () => {
    const stringTruncatePipe = new StringTruncatePipe();

    const expected = 'This is a ';
    const actual = stringTruncatePipe.transform(EXAMPLE_LONG, MAX_LENGTH);

    expect(actual).toBe(expected);
  });

  it('should truncate a string that is longer than the maximum length and append an ellipsis', () => {
    const stringTruncatePipe = new StringTruncatePipe();

    const expected = 'This is a ...';
    const actual = stringTruncatePipe.transform(EXAMPLE_LONG, MAX_LENGTH, APPEND_ELLIPSIS);

    expect(actual).toBe(expected);
  });

  it('should not truncate a string that is shorter than the maximum length', () => {
    const stringTruncatePipe = new StringTruncatePipe();

    const expected = EXAMPLE_SHORT;
    const actualWithoutAppend = stringTruncatePipe.transform(EXAMPLE_SHORT, MAX_LENGTH);
    const actualWithAppend = stringTruncatePipe.transform(EXAMPLE_SHORT, MAX_LENGTH, APPEND_ELLIPSIS);

    expect(actualWithAppend).toBe(expected);
    expect(actualWithoutAppend).toBe(expected);
  });

  it('should not truncate a string that is the same length as the maximum length', () => {
    const stringTruncatePipe = new StringTruncatePipe();

    const expected = EXAMPLE_EQUAL;
    const actualWithoutAppend = stringTruncatePipe.transform(EXAMPLE_EQUAL, MAX_LENGTH);
    const actualWithAppend = stringTruncatePipe.transform(EXAMPLE_EQUAL, MAX_LENGTH, APPEND_ELLIPSIS);

    expect(actualWithAppend).toBe(expected);
    expect(actualWithoutAppend).toBe(expected);
  });
});
