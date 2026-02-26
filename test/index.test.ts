import { describe, expect, it } from 'bun:test'
import { mult10, getcode } from '../src/index'
import { ElysiaCustomStatusResponse } from 'elysia';

describe('mult10', () => {
    it('should multiply the input by 10', () => {
        expect(mult10(5)).toBe(50);
        expect(mult10(-3)).toBe(-30);
        expect(mult10(0)).toBe(0);
    });

    it('should handle decimal numbers', () => {
        expect(mult10(2.5)).toBe(25);
        expect(mult10(-1.5)).toBe(-15);
        expect(mult10(0.00)).toBe(0);
    });

    it('should throw an error if input is not a number', () => {
        expect(() => (mult10("not a number" as any))).toThrow("Input must be a number");
        expect(() => (mult10("" as any))).toThrow("Input must be a number");
        expect(() => (mult10("  " as any))).toThrow("Input must be a number");
        expect(() => (mult10(null as any))).toThrow("Input must be a number");
        expect(() => (mult10(undefined as any))).toThrow("Input must be a number");   
    });
});

// describe('getcode', () => {
//     it('should return the code string', () => {
//         expect(getcode()).toBe("Hello, CE");
//     });
// });