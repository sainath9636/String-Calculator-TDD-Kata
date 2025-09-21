const { ErrorFactory } = require('./errors');

class StringCalculator {
  add(numbers) {
    this._validateInput(numbers);
    
    if (numbers === '') {
      return 0;
    }

    const { delimiter, numbersToProcess } = this._parseDelimiterSpec(numbers);
    const parsedNumbers = this._parseNumbers(numbersToProcess, delimiter);
    this._validateNegativeNumbers(parsedNumbers);
    
    return this._calculateSum(parsedNumbers);
  }

  _validateInput(numbers) {
    if (typeof numbers !== 'string') {
      throw ErrorFactory.createInputValidationError(numbers);
    }
    
    if (numbers.length > 100000) {
      throw ErrorFactory.createInputSizeError(numbers.length);
    }
  }

  _parseDelimiterSpec(numbers) {
    let delimiter = /[,\n]/;
    let numbersToProcess = numbers;

    if (numbers.startsWith('//')) {
      const delimiterEndIndex = numbers.indexOf('\n');
      
      if (delimiterEndIndex === -1) {
        throw ErrorFactory.createMissingNewlineError(numbers);
      }
      
      const delimiterSection = numbers.substring(2, delimiterEndIndex);
      numbersToProcess = numbers.substring(delimiterEndIndex + 1);
      
      delimiter = this._createDelimiterRegex(delimiterSection);
    }

    return { delimiter, numbersToProcess };
  }

  _createDelimiterRegex(delimiterSection) {
    const bracketRegex = /\[[^\]]*\]/;
    const hasBracketNotation = bracketRegex.test(delimiterSection);
    
    if (hasBracketNotation) {
      return this._parseBracketDelimiters(delimiterSection);
    } else {
      return this._parseSingleDelimiter(delimiterSection);
    }
  }

  _parseBracketDelimiters(delimiterSection) {
    this._validateBracketMatching(delimiterSection);
    
    const delimiters = [];
    const regex = /\[([^\]]*)\]/g;
    let match;

    while ((match = regex.exec(delimiterSection)) !== null) {
      const delimiterContent = match[1];
      this._validateDelimiterContent(delimiterContent);
      delimiters.push(delimiterContent);
    }

    this._validateDelimiterCount(delimiters);
    
    const escapedDelimiters = delimiters.map(d => this._escapeRegexChars(d));
    return new RegExp(escapedDelimiters.join('|'));
  }

  _parseSingleDelimiter(delimiterSection) {
    if (delimiterSection.trim() === '') {
      return /[,\n]/;
    }
    
    if (delimiterSection.length > 100) {
      throw ErrorFactory.createDelimiterTooLongError(delimiterSection);
    }
    
    const escapedDelimiter = this._escapeRegexChars(delimiterSection);
    return new RegExp(escapedDelimiter);
  }

  _validateBracketMatching(delimiterSection) {
    const openBrackets = (delimiterSection.match(/\[/g) || []).length;
    const closeBrackets = (delimiterSection.match(/\]/g) || []).length;
    
    if (openBrackets !== closeBrackets) {
      throw ErrorFactory.createUnmatchedBracketsError(delimiterSection, openBrackets, closeBrackets);
    }
  }

  _validateDelimiterContent(delimiterContent) {
    if (delimiterContent.length === 0) {
      throw ErrorFactory.createEmptyBracketError(delimiterContent);
    }
    
    if (delimiterContent.length > 100) {
      throw ErrorFactory.createDelimiterTooLongError(delimiterContent);
    }
  }

  _validateDelimiterCount(delimiters) {
    if (delimiters.length === 0) {
      throw ErrorFactory.createNoValidDelimitersError(delimiters);
    }
    
    if (delimiters.length > 50) {
      throw ErrorFactory.createTooManyDelimitersError(delimiters.length);
    }
  }

  _escapeRegexChars(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  _parseNumbers(numbersToProcess, delimiter) {
    return numbersToProcess
      .split(delimiter)
      .filter(token => token.trim() !== '')
      .map(num => this._parseAndValidateNumber(num))
      .filter(num => !isNaN(num))
      .filter(num => num <= 1000);
  }

  _parseAndValidateNumber(numStr) {
    const parsed = parseInt(numStr, 10);
    
    if (isNaN(parsed)) {
      return NaN;
    }
    
    if (parsed > Number.MAX_SAFE_INTEGER || parsed < Number.MIN_SAFE_INTEGER) {
      throw ErrorFactory.createNumberRangeError(parsed);
    }
    
    return parsed;
  }

  _validateNegativeNumbers(numbers) {
    const negativeNumbers = numbers.filter(num => num < 0);
    
    if (negativeNumbers.length > 0) {
      throw ErrorFactory.createNegativeNumbersError(negativeNumbers);
    }
  }

  _calculateSum(numbers) {
    return numbers.reduce((sum, num) => {
      const newSum = sum + num;
      
      if (newSum > Number.MAX_SAFE_INTEGER) {
        throw ErrorFactory.createSumOverflowError(sum, num);
      }
      
      return newSum;
    }, 0);
  }
}

module.exports = StringCalculator;
