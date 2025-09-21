const StringCalculator = require('./stringCalculator');

describe('StringCalculator', () => {
  let calculator;

  beforeEach(() => {
    calculator = new StringCalculator();
  });

  test('should return 0 for empty string', () => {
    expect(calculator.add('')).toBe(0);
  });

  test('should return the number itself for single number input', () => {
    expect(calculator.add('1')).toBe(1);
    expect(calculator.add('5')).toBe(5);
  });

  test('should return sum of two comma-separated numbers', () => {
    expect(calculator.add('1,5')).toBe(6);
    expect(calculator.add('2,3')).toBe(5);
  });

  test('should return sum of multiple comma-separated numbers', () => {
    expect(calculator.add('1,2,3,4')).toBe(10);
    expect(calculator.add('1,2,3,4,5')).toBe(15);
    expect(calculator.add('10,20,30')).toBe(60);
  });

  test('should handle newlines as delimiters', () => {
    expect(calculator.add('1\n2,3')).toBe(6);
    expect(calculator.add('1\n2\n3')).toBe(6);
    expect(calculator.add('4\n5,6\n7')).toBe(22);
  });

  test('should support custom delimiters', () => {
    expect(calculator.add('//;\n1;2')).toBe(3);
    expect(calculator.add('//|\n1|2|3')).toBe(6);
    expect(calculator.add('//*\n1*2*3*4')).toBe(10);
  });

  test('should handle edge cases with custom delimiters', () => {
    expect(calculator.add('//;\n1')).toBe(1);
    expect(calculator.add('//,\n2,3,4')).toBe(9);
  });

  test('should throw exception for negative numbers', () => {
    expect(() => calculator.add('-1,2')).toThrow('negative numbers not allowed -1');
    expect(() => calculator.add('2,-4,3,-5')).toThrow('negative numbers not allowed -4,-5');
    expect(() => calculator.add('//;\n1;-2;3')).toThrow('negative numbers not allowed -2');
  });

  test('should handle multiple negative numbers in exception message', () => {
    expect(() => calculator.add('-1,-2,-3')).toThrow('negative numbers not allowed -1,-2,-3');
    expect(() => calculator.add('1,-2,3,-4,5,-6')).toThrow('negative numbers not allowed -2,-4,-6');
    expect(() => calculator.add('//[***]\n1***-2***3')).toThrow('negative numbers not allowed -2');
  });

  test('should handle empty strings and non-numeric values', () => {
    expect(calculator.add('1,,2')).toBe(3);
    expect(calculator.add('1,abc,2')).toBe(3);
    expect(calculator.add('//;\n')).toBe(0);
    expect(calculator.add('//;\n;')).toBe(0);
    expect(calculator.add('1,\n,2')).toBe(3);
  });

  test('should handle additional edge cases with filtering', () => {
    expect(calculator.add('1,  ,2')).toBe(3);
    expect(calculator.add('abc,def,ghi')).toBe(0);
    expect(calculator.add('1,2.5,3')).toBe(6);
    expect(calculator.add('//*\n1**2*3')).toBe(6);
  });

  test('should ignore numbers larger than 1000', () => {
    expect(calculator.add('2,1001')).toBe(2);
    expect(calculator.add('1000,1001,2')).toBe(1002);
    expect(calculator.add('999,1000,1001,1002')).toBe(1999);
    expect(calculator.add('//;\n5;1001;10')).toBe(15);
  });

  test('should support multi-character delimiters', () => {
    expect(calculator.add('//[***]\n1***2***3')).toBe(6);
    expect(calculator.add('//[abc]\n1abc2abc3')).toBe(6);
    expect(calculator.add('//[||]\n4||5||6')).toBe(15);
    expect(calculator.add('//[123]\n10123201234')).toBe(34);
  });

  test('should support multiple delimiters', () => {
    expect(calculator.add('//[*][%]\n1*2%3')).toBe(6);
    expect(calculator.add('//[;][|]\n1;2|3')).toBe(6);
    expect(calculator.add('//[*][%][#]\n1*2%3#4')).toBe(10);
    expect(calculator.add('//[a][b]\n1a2b3a4')).toBe(10);
  });

  test('should support multiple multi-character delimiters', () => {
    expect(calculator.add('//[***][%%%]\n1***2%%%3')).toBe(6);
    expect(calculator.add('//[abc][def]\n1abc2def3')).toBe(6);
    expect(calculator.add('//[||][&&]\n4||5&&6')).toBe(15);
    expect(calculator.add('//[xx][yy]\n1xx2yy3xx4')).toBe(10);
  });

  test('should handle comprehensive edge cases with all features', () => {
    expect(calculator.add('//[***][%%%]\n1***1001%%%2***3')).toBe(6);
    expect(() => calculator.add('//[*][%]\n1*-2%3')).toThrow('negative numbers not allowed -2');
    expect(() => calculator.add('1,-2,1001,3')).toThrow('negative numbers not allowed -2');
    expect(calculator.add('//[abc][def]\n1abc***def2')).toBe(3);
  });

  test('should handle edge cases with special regex characters', () => {
    expect(calculator.add('//.\n1.2.3')).toBe(6);
    expect(calculator.add('//+\n1+2+3')).toBe(6);
    expect(calculator.add('//*\n1*2*3')).toBe(6);
    expect(calculator.add('//?\n1?2?3')).toBe(6);
    expect(calculator.add('//.\n1.2')).toBe(3);
    expect(calculator.add('//[\n1[2[3')).toBe(6);
    expect(calculator.add('//]\n1]2]3')).toBe(6);
    expect(calculator.add('//(\n1(2(3')).toBe(6);
    expect(calculator.add('//)\n1)2)3')).toBe(6);
  });

  test('should handle malformed delimiter specifications', () => {
    expect(calculator.add('//\n1,2')).toBe(3);
    expect(calculator.add('//[ ]\n1 2 3')).toBe(6);
    expect(calculator.add('//[ ]\n1   2   3')).toBe(6);
    expect(calculator.add('//.\n1.2.3')).toBe(6);
    expect(calculator.add('//$\n1$2$3')).toBe(6);
  });

  test('should validate input types', () => {
    expect(() => calculator.add(null)).toThrow('Input must be a string');
    expect(() => calculator.add(undefined)).toThrow('Input must be a string');
    expect(() => calculator.add(123)).toThrow('Input must be a string');
    expect(() => calculator.add([1, 2, 3])).toThrow('Input must be a string');
    expect(() => calculator.add({})).toThrow('Input must be a string');
  });

  test('should validate input size limits', () => {
    const largeInput = '1,' + '2,'.repeat(50000) + '3';
    expect(() => calculator.add(largeInput)).toThrow('Input string too large');
  });

  test('should validate delimiter specifications', () => {
    expect(() => calculator.add('//;')).toThrow('Invalid delimiter specification: missing newline');
    expect(calculator.add('//[abc\n1[abc2')).toBe(3);
    expect(calculator.add('//abc]\n1abc]2')).toBe(3);
    expect(() => calculator.add('//[abc][def\n1abc2def3')).toThrow('Invalid delimiter specification: unmatched brackets');
    expect(() => calculator.add('//[]\n1,2')).toThrow('Invalid delimiter specification: empty bracket pair');
    const manyDelimiters = Array.from({length: 51}, (_, i) => `[${i}]`).join('');
    expect(() => calculator.add(`//${manyDelimiters}\n1`)).toThrow('Too many delimiters (max 50)');
    const longDelimiter = 'a'.repeat(101);
    expect(() => calculator.add(`//[${longDelimiter}]\n1${longDelimiter}2`)).toThrow('Delimiter too long (max 100 characters)');
    expect(() => calculator.add(`//${longDelimiter}\n1${longDelimiter}2`)).toThrow('Delimiter too long (max 100 characters)');
  });

  test('should handle number overflow scenarios', () => {
    const many999s = Array(15000).fill('999').join(',');
    const result = calculator.add('999,999,999');
    expect(result).toBe(2997);
    expect(calculator.add('1000,1001')).toBe(1000);
  });
});
