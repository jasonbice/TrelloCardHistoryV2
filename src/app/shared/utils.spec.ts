import { Utils } from './utils';

describe('utils', () => {

    describe('IsNullOrWhiteSpace', () => {
        it('should be true when null is supplied', () => {
            const actual = Utils.isNullOrWhiteSpace(null);

            expect(actual).toBe(true);
        });

        it('should be true when an empty string is supplied', () => {
            const actual = Utils.isNullOrWhiteSpace('');

            expect(actual).toBe(true);
        });

        it('should be true when one or more whitespaces are supplied', () => {
            const actual = Utils.isNullOrWhiteSpace(' ');

            expect(actual).toBe(true);
        });

        it('should be false when a non-null/non-empty value is supplied', () => {
            const actual = Utils.isNullOrWhiteSpace('a');

            expect(actual).toBe(false);
        });
    });

    describe('getSanitizedTitle', () => {
      it('should return null if null is passed in', () => {
        const testTitle: string = null
  
        const actual: string = Utils.getSanitizedTitle(testTitle);
        const expected: string = testTitle;
  
        expect(actual).toBe(expected);
      });
  
      it('should return an empty string if an empty string is passed in', () => {
        const testTitle: string = ''
  
        const actual: string = Utils.getSanitizedTitle(testTitle);
        const expected: string = testTitle;
  
        expect(actual).toBe(expected);
      });
  
      it('should return the value passed in when the title does not contain any parened values', () => {
        const testTitle: string = 'Test Title'
  
        const actual: string = Utils.getSanitizedTitle(testTitle);
        const expected: string = testTitle;
  
        expect(actual).toBe(expected);
      });
  
      it('should return the value passed in with any leading parened integer removed', () => {
        const testTitles: string[] = ['(1)Test Title', '(1) Test Title', ' (21) Test Title ', '(21)Test Title', '(21) Test Title', ' (1) Test Title '];
        const expected: string = 'Test Title';
  
        testTitles.forEach(testTitle => {
          const actual: string = Utils.getSanitizedTitle(testTitle);
  
          expect(actual).toBe(expected);
        });
      });
  
      it('should return the value passed in with any leading parened integer removed and with any remaining parened integers intact', () => {
        const testTitle: string = '(1)Test(1)Title';
        const actual: string = Utils.getSanitizedTitle(testTitle);
        const expected: string = 'Test(1)Title';
  
        expect(actual).toBe(expected);
      });
  
      it('should return the value passed in when parened values exist anywhere in the title other than a leading parened integer', () => {
        const testTitles: string[] = ['Test (1) Title', 'Test (A) Title', '(A)Test Title ', 'Test Title(1)', 'Test Title(A)', '2 Test Title', '2Test Title'];
  
        testTitles.forEach(testTitle => {
          const actual: string = Utils.getSanitizedTitle(testTitle);
          const expected: string = testTitle;
  
          expect(actual).toBe(expected);
        });
      });
    });
  
    describe('getSanitizedPoints', () => {
      it('should return null if null is passed in', () => {
        const testTitle: string = null;
  
        const actual: number = Utils.getSanitizedPoints(testTitle);
  
        expect(actual).toBeNull();
      });
  
      it('should return null if an empty string is passed in', () => {
        const testTitle: string = '';
  
        const actual: number = Utils.getSanitizedPoints(testTitle);
  
        expect(actual).toBeNull();
      });
  
      it('should return null if a value containing only a non-parened integer is passed in', () => {
        const testTitle: string = '8';
  
        const actual: number = Utils.getSanitizedPoints(testTitle);
  
        expect(actual).toBeNull();
      });
  
      it('should return the integer contained in a value containing a leading parened integer', () => {
        const testTitles: string[] = ['(13)Test Title', '(13) Test Title', ' (13) Test Title ', '(13)Test(8)Title', '(13) Test Title (5)', ' (13)(21) Test Title '];
        const expected: number = 13;
  
        testTitles.forEach(testTitle => {
          const actual: number = Utils.getSanitizedPoints(testTitle);
  
          expect(actual).toBe(expected);
        });
      });
  
      it('should return null when the passed in value does not contain a leading parened integer', () => {
        const testTitles: string[] = ['Test (1) Title', 'Test (A) Title', '(A)Test Title ', 'Test Title(1)', 'Test Title(A)', '2 Test Title', '2Test Title'];
  
        testTitles.forEach(testTitle => {
          const actual: number = Utils.getSanitizedPoints(testTitle);
  
          expect(actual).toBeNull();
        });
      });
    });
  
    describe('getSanitizedDescription', () => {
  
    });
});
