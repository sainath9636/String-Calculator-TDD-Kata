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
});
