# String Calculator TDD Kata

A robust string calculator implementation built using Test-Driven Development (TDD) principles. This calculator can parse strings of numbers with various delimiters and perform addition operations with comprehensive validation and error handling.

## 🚀 Quick Start

### Prerequisites
- Node.js (version 14 or higher)
- npm

### Installation
```bash
npm install
```

### Commands
```bash
# Run all tests
npm test

# Run tests in watch mode (auto-rerun on file changes)
npm run test:watch

# Run a single test file
npx jest stringCalculator.test.js

# Run tests with coverage
npx jest --coverage
```

## 📋 String Calculator Functionalities

### ✅ Basic Operations
- **Empty String**: Returns `0` for empty input
- **Single Number**: Returns the number itself (e.g., `"5"` → `5`)
- **Two Numbers**: Adds comma-separated numbers (e.g., `"1,2"` → `3`)
- **Multiple Numbers**: Handles unlimited comma-separated numbers (e.g., `"1,2,3,4"` → `10`)

### ✅ Delimiter Support
- **Default Delimiters**: Supports commas `,` and newlines `\n`
- **Mixed Delimiters**: Can mix commas and newlines (e.g., `"1\n2,3"` → `6`)
- **Custom Single Delimiters**: Specify custom delimiter (e.g., `"//;\n1;2"` → `3`)
- **Multi-Character Delimiters**: Support brackets notation (e.g., `"//[***]\n1***2***3"` → `6`)
- **Multiple Delimiters**: Multiple custom delimiters (e.g., `"//[*][%]\n1*2%3"` → `6`)

### ✅ Input Validation
- **Type Checking**: Ensures input is a string
- **Size Limits**: Maximum input length of 100,000 characters
- **Delimiter Validation**: Validates proper delimiter specification format
- **Bracket Matching**: Ensures proper bracket pairs in multi-delimiter specs

### ✅ Number Processing
- **Negative Number Detection**: Throws error for negative numbers with detailed message
- **Large Number Filtering**: Ignores numbers greater than 1000
- **Non-Numeric Filtering**: Handles and filters out non-numeric values
- **Safe Integer Range**: Validates numbers within JavaScript's safe integer range
- **Overflow Protection**: Prevents sum overflow beyond safe integer limits

### ✅ Error Handling
- **Custom Error Classes**: Specific error types for different failure scenarios
- **Descriptive Messages**: Clear, actionable error messages
- **Error Context**: Detailed error information for debugging
- **Input Validation Errors**: Type and size validation
- **Delimiter Errors**: Format and specification validation
- **Calculation Errors**: Negative numbers and overflow protection

### ✅ Advanced Features
- **Regex Escaping**: Properly handles special regex characters as literal delimiters
- **Empty Token Handling**: Filters out empty strings and whitespace-only tokens
- **Decimal Number Processing**: Handles decimal inputs (uses parseInt for integer conversion)
- **Performance Optimized**: Efficient parsing and validation pipeline

## 📖 Usage Examples

```javascript
const StringCalculator = require('./stringCalculator');
const calculator = new StringCalculator();

// Basic usage
calculator.add('');           // Returns: 0
calculator.add('1');          // Returns: 1
calculator.add('1,2');        // Returns: 3
calculator.add('1,2,3,4,5');  // Returns: 15

// With newlines
calculator.add('1\n2,3');     // Returns: 6

// Custom delimiters
calculator.add('//;\n1;2');   // Returns: 3
calculator.add('//*\n1*2*3'); // Returns: 6

// Multi-character delimiters
calculator.add('//[***]\n1***2***3');     // Returns: 6
calculator.add('//[abc]\n1abc2abc3');     // Returns: 6

// Multiple delimiters
calculator.add('//[*][%]\n1*2%3');        // Returns: 6
calculator.add('//[***][%%%]\n1***2%%%3'); // Returns: 6

// Large number filtering
calculator.add('2,1001');     // Returns: 2 (1001 ignored)
calculator.add('1000,1001,2'); // Returns: 1002 (1001 ignored)

// Error cases
calculator.add('1,-2,3');     // Throws: "negative numbers not allowed -2"
calculator.add('-1,-2,-3');   // Throws: "negative numbers not allowed -1,-2,-3"
```

## 🧪 Testing

The project includes comprehensive test coverage with 22 test cases covering:
- Basic functionality
- Edge cases
- Error scenarios
- Input validation
- Performance limits
- Custom delimiter configurations

All tests follow TDD principles and provide detailed validation of the calculator's behavior.

## 🏗️ Architecture

- **Clean Code**: Modular design with single responsibility principle
- **Error Handling**: Comprehensive custom error classes with detailed context
- **Performance**: Optimized for efficiency with input size limits
- **Maintainability**: Well-structured code with clear separation of concerns
- **Testability**: 100% test coverage with isolated test cases