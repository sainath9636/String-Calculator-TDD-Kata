class StringCalculator {
  add(numbers) {
    if (numbers === '') {
      return 0;
    }

    let delimiter = /[,\n]/; 
    let numbersToProcess = numbers;

    if (numbers.startsWith('//')) {
      const delimiterEndIndex = numbers.indexOf('\n');
      const customDelimiter = numbers.substring(2, delimiterEndIndex);
      numbersToProcess = numbers.substring(delimiterEndIndex + 1);
      delimiter = customDelimiter;
    }

    const parsedNumbers = numbersToProcess
      .split(delimiter)
      .map(num => parseInt(num));

    const negativeNumbers = parsedNumbers.filter(num => num < 0);
    if (negativeNumbers.length > 0) {
      throw new Error(`negative numbers not allowed ${negativeNumbers.join(',')}`);
    }

    return parsedNumbers.reduce((sum, num) => sum + num, 0);
  }
}

module.exports = StringCalculator;
