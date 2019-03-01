import { HistoryItem } from './history-item.model';

describe('HistoryItem', () => {
    describe('newValue', () => {

    });

    describe('oldValue', () => {

    });

    describe('initialize', () => {

    });

    describe('getSanitizedTitle', () => {
        it('should return null if null is passed in', () => {
            const testTitle: string = null

            const actual: string = HistoryItem.getSanitizedTitle(testTitle);
            const expected: string = testTitle;

            expect(actual).toBe(expected);
        });

        it('should return an empty string if an empty string is passed in', () => {
            const testTitle: string = ''

            const actual: string = HistoryItem.getSanitizedTitle(testTitle);
            const expected: string = testTitle;

            expect(actual).toBe(expected);
        });

        it('should return the value passed in when the title does not contain any parened values', () => {
            const testTitle: string = 'Test Title'

            const actual: string = HistoryItem.getSanitizedTitle(testTitle);
            const expected: string = testTitle;

            expect(actual).toBe(expected);
        });

        it('should return the value passed in with any leading parened integer removed', () => {
            const testTitles: string[] = ['(1)Test Title', '(1) Test Title', ' (21) Test Title ', '(21)Test Title', '(21) Test Title', ' (1) Test Title '];
            const expected: string = 'Test Title';

            testTitles.forEach(testTitle => {
                const actual: string = HistoryItem.getSanitizedTitle(testTitle);

                expect(actual).toBe(expected);
            });
        });

        it('should return the value passed in with any leading parened integer removed and with any remaining parened integers intact', () => {
            const testTitle: string = '(1)Test(1)Title';
            const actual: string = HistoryItem.getSanitizedTitle(testTitle);
            const expected: string = 'Test(1)Title';
            
            expect(actual).toBe(expected);
        });

        it('should return the value passed in when parened values exist anywhere in the title other than a leading parened integer', () => {
            const testTitles: string[] = ['Test (1) Title', 'Test (A) Title', '(A)Test Title ', 'Test Title(1)', 'Test Title(A)', '2 Test Title', '2Test Title'];

            testTitles.forEach(testTitle => {
                const actual: string = HistoryItem.getSanitizedTitle(testTitle);
                const expected: string = testTitle;

                expect(actual).toBe(expected);
            });
        });
    });

    describe('getSanitizedPoints', () => {
        it('should return null if null is passed in', () => {
            const testTitle: string = null;

            const actual: number = HistoryItem.getSanitizedPoints(testTitle);

            expect(actual).toBeNull();
        });

        it('should return null if an empty string is passed in', () => {
            const testTitle: string = '';

            const actual: number = HistoryItem.getSanitizedPoints(testTitle);

            expect(actual).toBeNull();
        });

        it('should return null if a value containing only a non-parened integer is passed in', () => {
            const testTitle: string = '8';

            const actual: number = HistoryItem.getSanitizedPoints(testTitle);

            expect(actual).toBeNull();
        });

        it('should return the integer contained in a value containing a leading parened integer', () => {
            const testTitles: string[] = ['(13)Test Title', '(13) Test Title', ' (13) Test Title ', '(13)Test(8)Title', '(13) Test Title (5)', ' (13)(21) Test Title '];
            const expected: number = 13;

            testTitles.forEach(testTitle => {
                const actual: number = HistoryItem.getSanitizedPoints(testTitle);

                expect(actual).toBe(expected);
            });
        });

        it('should return null when the passed in value does not contain a leading parened integer', () => {
            const testTitles: string[] = ['Test (1) Title', 'Test (A) Title', '(A)Test Title ', 'Test Title(1)', 'Test Title(A)', '2 Test Title', '2Test Title'];

            testTitles.forEach(testTitle => {
                const actual: number = HistoryItem.getSanitizedPoints(testTitle);
                
                expect(actual).toBeNull();
            });
        });
    });

    describe('getSanitizedDescription', () => {

    });

    describe('getUpdateType', () => {

    });

    describe('sort', () => {

    });
});