class StringCalculator {
  add(numbers) {
    if (numbers === '') {
      return 0;
    }

    return numbers
      .split(/[,\n]/)
      .map(num => parseInt(num))
      .reduce((sum, num) => sum + num, 0);
  }
}

module.exports = StringCalculator;
