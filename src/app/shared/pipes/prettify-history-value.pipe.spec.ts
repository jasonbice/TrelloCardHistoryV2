import { PrettifyHistoryValuePipe } from "./prettify-history-value.pipe";

describe('PrettifyHistoryValuePipe', () => {
  const MAX_LENGTH = 10;
  const EXAMPLE_LONG = 'This is a string that is too long.';
  const EXAMPLE_SHORT = 'Shorter';
  const EXAMPLE_EQUAL = 'Exactly 10';
  const REPLACE_WITH = '(None)';
  const APPEND_ELLIPSIS = '...';

  it('create an instance', () => {
    const pipe = new PrettifyHistoryValuePipe();
    expect(pipe).toBeTruthy();
  });

  it('should truncate a string that is longer than the maximum length and append an ellipsis', () => {
    const pipe = new PrettifyHistoryValuePipe();

    const expected = 'This is a ...';
    const actual = pipe.transform(EXAMPLE_LONG, MAX_LENGTH, APPEND_ELLIPSIS);

    expect(actual).toBe(expected);
  });

  it('should not alter a non-null/non-whitespace string that is shorter than the maximum length', () => {
    const pipe = new PrettifyHistoryValuePipe();

    const expected = EXAMPLE_SHORT;
    const actualWithoutAppend = pipe.transform(EXAMPLE_SHORT, MAX_LENGTH);
    const actualWithAppend = pipe.transform(EXAMPLE_SHORT, MAX_LENGTH, APPEND_ELLIPSIS, REPLACE_WITH);

    expect(actualWithAppend).toBe(expected);
    expect(actualWithoutAppend).toBe(expected);
  });

  it('should not truncate a string that is the same length as the maximum length', () => {
    const pipe = new PrettifyHistoryValuePipe();

    const expected = EXAMPLE_EQUAL;
    const actualWithoutAppend = pipe.transform(EXAMPLE_EQUAL, MAX_LENGTH);
    const actualWithAppend = pipe.transform(EXAMPLE_EQUAL, MAX_LENGTH, APPEND_ELLIPSIS);

    expect(actualWithAppend).toBe(expected);
    expect(actualWithoutAppend).toBe(expected);
  });

  it('should return the replacement value that was passed in if it was null', () => {
    const pipe = new PrettifyHistoryValuePipe();
    const actual = pipe.transform(null, MAX_LENGTH, APPEND_ELLIPSIS, REPLACE_WITH);

    expect(actual).toBe(REPLACE_WITH);
  });

  it('should return the replacement value that was passed in if it was empty', () => {
    const pipe = new PrettifyHistoryValuePipe();
    const actual = pipe.transform('', MAX_LENGTH, APPEND_ELLIPSIS, REPLACE_WITH);

    expect(actual).toBe(REPLACE_WITH);
  });

  it('should return the replacement value that was passed in if it was whitespace', () => {
    const pipe = new PrettifyHistoryValuePipe();
    const actual = pipe.transform('', MAX_LENGTH, APPEND_ELLIPSIS, REPLACE_WITH);

    expect(actual).toBe(REPLACE_WITH);
  });
});