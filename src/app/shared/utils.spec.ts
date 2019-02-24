import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IsNullOrWhiteSpace } from './utils';

describe('utils', () => {

    describe('IsNullOrWhiteSpace', () => {
        it('should be true when null is supplied', () => {
            const actual = IsNullOrWhiteSpace(null);

            expect(actual).toBe(true);
        });

        it('should be true when an empty string is supplied', () => {
            const actual = IsNullOrWhiteSpace('');

            expect(actual).toBe(true);
        });

        it('should be true when one or more whitespaces are supplied', () => {
            const actual = IsNullOrWhiteSpace(' ');

            expect(actual).toBe(true);
        });

        it('should be false when a non-null/non-empty value is supplied', () => {
            const actual = IsNullOrWhiteSpace('a');

            expect(actual).toBe(false);
        });
    });
});
