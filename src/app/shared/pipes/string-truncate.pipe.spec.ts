import { StringTruncatePipe } from './string-truncate.pipe';

describe('StringTruncatePipe', () => {
  it('create an instance', () => {
    const pipe = new StringTruncatePipe();
    expect(pipe).toBeTruthy();
  });
});
