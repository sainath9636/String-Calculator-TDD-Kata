class StringCalculatorError extends Error {
  constructor(message, code, context = {}) {
    super(message);
    this.name = this.constructor.name;
    this.code = code;
    this.context = context;
    this.timestamp = new Date().toISOString();
    
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      code: this.code,
      context: this.context,
      timestamp: this.timestamp,
      stack: this.stack
    };
  }

  getUserMessage() {
    return this.message;
  }
}

class InputValidationError extends StringCalculatorError {
  constructor(message, inputValue, expectedType = 'string') {
    super(message, 'INVALID_INPUT', {
      inputValue,
      expectedType,
      receivedType: typeof inputValue
    });
  }

  getUserMessage() {
    return `Invalid input: ${this.message}`;
  }
}

class InputSizeError extends StringCalculatorError {
  constructor(actualSize, maxSize = 100000) {
    const message = `Input string too large (${actualSize} characters, max ${maxSize} characters)`;
    super(message, 'INPUT_SIZE_ERROR', {
      actualSize,
      maxSize,
      exceededBy: actualSize - maxSize
    });
  }

  getUserMessage() {
    return `Input is too large. Please provide a smaller input string.`;
  }
}

class DelimiterError extends StringCalculatorError {
  constructor(message, delimiterSpec, issue) {
    super(message, 'DELIMITER_ERROR', {
      delimiterSpec,
      issue
    });
  }

  getUserMessage() {
    return `Delimiter configuration error: ${this.message}`;
  }
}

class MissingNewlineError extends DelimiterError {
  constructor(delimiterSpec) {
    super(
      'Invalid delimiter specification: missing newline',
      delimiterSpec,
      'MISSING_NEWLINE'
    );
  }
}

class UnmatchedBracketsError extends DelimiterError {
  constructor(delimiterSpec, openCount, closeCount) {
    super(
      'Invalid delimiter specification: unmatched brackets',
      delimiterSpec,
      'UNMATCHED_BRACKETS'
    );
    this.context.openBrackets = openCount;
    this.context.closeBrackets = closeCount;
  }
}

class EmptyBracketError extends DelimiterError {
  constructor(delimiterSpec) {
    super(
      'Invalid delimiter specification: empty bracket pair',
      delimiterSpec,
      'EMPTY_BRACKET'
    );
  }
}

class DelimiterTooLongError extends DelimiterError {
  constructor(delimiter, maxLength = 100) {
    super(
      `Delimiter too long (max ${maxLength} characters)`,
      delimiter,
      'TOO_LONG'
    );
    this.context.actualLength = delimiter.length;
    this.context.maxLength = maxLength;
  }
}

class TooManyDelimitersError extends DelimiterError {
  constructor(delimiterCount, maxCount = 50) {
    super(
      `Too many delimiters (max ${maxCount})`,
      null,
      'TOO_MANY'
    );
    this.context.actualCount = delimiterCount;
    this.context.maxCount = maxCount;
  }
}

class NoValidDelimitersError extends DelimiterError {
  constructor(delimiterSpec) {
    super(
      'Invalid delimiter specification: no valid delimiters found in brackets',
      delimiterSpec,
      'NO_VALID_DELIMITERS'
    );
  }
}

class NumberProcessingError extends StringCalculatorError {
  constructor(message, value, errorType) {
    super(message, 'NUMBER_PROCESSING_ERROR', {
      value,
      errorType,
      valueType: typeof value
    });
  }

  getUserMessage() {
    switch (this.context.errorType) {
      case 'OUT_OF_RANGE':
        return 'One or more numbers are too large to process safely.';
      case 'SUM_OVERFLOW':
        return 'The sum of numbers is too large to calculate safely.';
      default:
        return this.message;
    }
  }
}

class NumberRangeError extends StringCalculatorError {
  constructor(number, min = Number.MIN_SAFE_INTEGER, max = Number.MAX_SAFE_INTEGER) {
    super(`Number out of safe range: ${number}`, 'NUMBER_OUT_OF_RANGE', {
      number,
      min,
      max
    });
  }

  getUserMessage() {
    const { number, min, max } = this.context;
    return `Number ${number} is outside the valid range (${min} to ${max})`;
  }
}

class SumOverflowError extends NumberProcessingError {
  constructor(currentSum, attemptedValue) {
    super(
      'Sum exceeds maximum safe integer',
      attemptedValue,
      'SUM_OVERFLOW'
    );
    this.context.currentSum = currentSum;
    this.context.attemptedValue = attemptedValue;
    this.context.maxSafeInteger = Number.MAX_SAFE_INTEGER;
  }
}

class NegativeNumberError extends StringCalculatorError {
  constructor(negativeNumbers) {
    const message = `negative numbers not allowed ${negativeNumbers.join(',')}`;
    super(message, 'NEGATIVE_NUMBERS', {
      negativeNumbers,
      count: negativeNumbers.length
    });
  }

  getUserMessage() {
    const { negativeNumbers } = this.context;
    if (negativeNumbers.length === 1) {
      return `Negative number ${negativeNumbers[0]} is not allowed`;
    }
    return `Negative numbers are not allowed: ${negativeNumbers.join(', ')}`;
  }
}

class ErrorFactory {
  static createInputValidationError(inputValue, expectedType = 'string') {
    return new InputValidationError('Input must be a string', inputValue, expectedType);
  }

  static createInputSizeError(actualSize, maxSize = 100000) {
    return new InputSizeError(actualSize, maxSize);
  }

  static createMissingNewlineError(delimiterSpec) {
    return new MissingNewlineError(delimiterSpec);
  }

  static createUnmatchedBracketsError(delimiterSpec, openCount, closeCount) {
    return new UnmatchedBracketsError(delimiterSpec, openCount, closeCount);
  }

  static createEmptyBracketError(delimiterSpec) {
    return new EmptyBracketError(delimiterSpec);
  }

  static createDelimiterTooLongError(delimiter, maxLength = 100) {
    return new DelimiterTooLongError(delimiter, maxLength);
  }

  static createTooManyDelimitersError(count, maxCount = 50) {
    return new TooManyDelimitersError(count, maxCount);
  }

  static createNoValidDelimitersError(delimiterSpec) {
    return new NoValidDelimitersError(delimiterSpec);
  }

  static createNumberRangeError(value) {
    return new NumberRangeError(value);
  }

  static createSumOverflowError(currentSum, attemptedValue) {
    return new SumOverflowError(currentSum, attemptedValue);
  }

  static createNegativeNumbersError(negativeNumbers) {
    return new NegativeNumberError(negativeNumbers);
  }
}

class ErrorHandler {
  static log(error, context = '') {
    const timestamp = new Date().toISOString();
    const contextStr = context ? ` [${context}]` : '';
    
    if (error instanceof StringCalculatorError) {
      console.error(`${timestamp}${contextStr} ${error.name}: ${error.message}`, {
        code: error.code,
        context: error.context
      });
    } else {
      console.error(`${timestamp}${contextStr} ${error.name}: ${error.message}`, {
        stack: error.stack
      });
    }
  }

  static handle(error, includeStack = false) {
    const response = {
      success: false,
      error: {
        message: error.message,
        type: error.constructor.name
      }
    };

    if (error instanceof StringCalculatorError) {
      response.error.code = error.code;
      response.error.userMessage = error.getUserMessage();
      response.error.context = error.context;
      
      if (includeStack) {
        response.error.stack = error.stack;
      }
    } else {
      response.error.code = 'UNKNOWN_ERROR';
      response.error.userMessage = 'An unexpected error occurred';
      
      if (includeStack) {
        response.error.stack = error.stack;
      }
    }

    return response;
  }

  static isErrorType(error, errorClass) {
    return error instanceof errorClass;
  }

  static getUserMessage(error) {
    if (error instanceof StringCalculatorError) {
      return error.getUserMessage();
    }
    return 'An unexpected error occurred. Please try again.';
  }
}

module.exports = {
  StringCalculatorError,
  InputValidationError,
  InputSizeError,
  DelimiterError,
  MissingNewlineError,
  UnmatchedBracketsError,
  EmptyBracketError,
  DelimiterTooLongError,
  TooManyDelimitersError,
  NoValidDelimitersError,
  NumberProcessingError,
  NumberRangeError,
  SumOverflowError,
  NegativeNumberError,
  ErrorFactory,
  ErrorHandler
};
