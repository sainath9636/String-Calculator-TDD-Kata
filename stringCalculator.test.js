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
  });
});
