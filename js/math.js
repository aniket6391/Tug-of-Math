/**
 * Math Question Generator for Tug of Math
 * Direct, clear questions only - no explanations.
 */

export const MathOperations = {
  ADD: 'add',
  SUB: 'sub',
  MUL: 'mul',
  DIV: 'div',
  SQUARE: 'square',
  SQRT: 'sqrt',
  CUBE: 'cube',
  CBRT: 'cbrt'
};

export class MathEngine {
  constructor(options = {}) {
    this.difficulty = options.difficulty || 'medium';
    this.activeOperations = options.activeOperations || [
      MathOperations.ADD,
      MathOperations.SUB,
      MathOperations.MUL,
      MathOperations.DIV,
      MathOperations.SQUARE,
      MathOperations.SQRT,
      MathOperations.CUBE,
      MathOperations.CBRT
    ];
  }

  setDifficulty(diff) {
    this.difficulty = diff;
  }

  setActiveOperations(ops) {
    if (Array.isArray(ops) && ops.length > 0) {
      this.activeOperations = [...ops];
    }
  }

  getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  generateQuestion() {
    if (!this.activeOperations || this.activeOperations.length === 0) {
      this.activeOperations = [
        MathOperations.ADD,
        MathOperations.SUB,
        MathOperations.MUL,
        MathOperations.DIV,
        MathOperations.SQUARE,
        MathOperations.SQRT,
        MathOperations.CUBE,
        MathOperations.CBRT
      ];
    }

    const op = this.activeOperations[Math.floor(Math.random() * this.activeOperations.length)];
    const diff = this.difficulty;

    switch (op) {
      case MathOperations.ADD:
        return this.generateAddition(diff);
      case MathOperations.SUB:
        return this.generateSubtraction(diff);
      case MathOperations.MUL:
        return this.generateMultiplication(diff);
      case MathOperations.DIV:
        return this.generateDivision(diff);
      case MathOperations.SQUARE:
        return this.generateSquare(diff);
      case MathOperations.SQRT:
        return this.generateSquareRoot(diff);
      case MathOperations.CUBE:
        return this.generateCube(diff);
      case MathOperations.CBRT:
        return this.generateCubeRoot(diff);
      default:
        return this.generateAddition(diff);
    }
  }

  generateAddition(diff) {
    let a, b;
    if (diff === 'easy') {
      a = this.getRandomInt(2, 20);
      b = this.getRandomInt(2, 20);
    } else if (diff === 'hard') {
      a = this.getRandomInt(25, 150);
      b = this.getRandomInt(25, 150);
    } else {
      a = this.getRandomInt(10, 60);
      b = this.getRandomInt(10, 60);
    }
    return {
      type: MathOperations.ADD,
      label: 'ADDITION',
      questionHtml: `${a} + ${b} = ?`,
      questionText: `${a} + ${b} = ?`,
      answer: a + b
    };
  }

  generateSubtraction(diff) {
    let a, b;
    if (diff === 'easy') {
      b = this.getRandomInt(2, 15);
      a = b + this.getRandomInt(1, 15);
    } else if (diff === 'hard') {
      b = this.getRandomInt(20, 100);
      a = b + this.getRandomInt(15, 120);
    } else {
      b = this.getRandomInt(8, 40);
      a = b + this.getRandomInt(8, 50);
    }
    return {
      type: MathOperations.SUB,
      label: 'SUBTRACTION',
      questionHtml: `${a} &minus; ${b} = ?`,
      questionText: `${a} - ${b} = ?`,
      answer: a - b
    };
  }

  generateMultiplication(diff) {
    let a, b;
    if (diff === 'easy') {
      a = this.getRandomInt(2, 9);
      b = this.getRandomInt(2, 9);
    } else if (diff === 'hard') {
      a = this.getRandomInt(6, 19);
      b = this.getRandomInt(6, 19);
    } else {
      a = this.getRandomInt(3, 12);
      b = this.getRandomInt(3, 12);
    }
    return {
      type: MathOperations.MUL,
      label: 'MULTIPLICATION',
      questionHtml: `${a} &times; ${b} = ?`,
      questionText: `${a} × ${b} = ?`,
      answer: a * b
    };
  }

  generateDivision(diff) {
    let divisor, answer;
    if (diff === 'easy') {
      divisor = this.getRandomInt(2, 8);
      answer = this.getRandomInt(2, 9);
    } else if (diff === 'hard') {
      divisor = this.getRandomInt(4, 15);
      answer = this.getRandomInt(6, 20);
    } else {
      divisor = this.getRandomInt(3, 10);
      answer = this.getRandomInt(3, 12);
    }
    const dividend = divisor * answer;
    return {
      type: MathOperations.DIV,
      label: 'DIVISION',
      questionHtml: `${dividend} &divide; ${divisor} = ?`,
      questionText: `${dividend} ÷ ${divisor} = ?`,
      answer: answer
    };
  }

  generateSquare(diff) {
    let base;
    if (diff === 'easy') {
      base = this.getRandomInt(2, 10);
    } else if (diff === 'hard') {
      base = this.getRandomInt(11, 25);
    } else {
      base = this.getRandomInt(3, 16);
    }
    return {
      type: MathOperations.SQUARE,
      label: 'SQUARE',
      questionHtml: `${base}<sup class="math-power">2</sup> = ?`,
      questionText: `${base}² = ?`,
      answer: base * base
    };
  }

  generateSquareRoot(diff) {
    let base;
    if (diff === 'easy') {
      base = this.getRandomInt(2, 9);
    } else if (diff === 'hard') {
      base = this.getRandomInt(10, 25);
    } else {
      base = this.getRandomInt(3, 15);
    }
    const squareVal = base * base;
    return {
      type: MathOperations.SQRT,
      label: 'SQUARE ROOT',
      questionHtml: `&radic;${squareVal} = ?`,
      questionText: `√${squareVal} = ?`,
      answer: base
    };
  }

  generateCube(diff) {
    let base;
    if (diff === 'easy') {
      base = this.getRandomInt(2, 5);
    } else if (diff === 'hard') {
      base = this.getRandomInt(5, 12);
    } else {
      base = this.getRandomInt(2, 8);
    }
    return {
      type: MathOperations.CUBE,
      label: 'CUBE',
      questionHtml: `${base}<sup class="math-power">3</sup> = ?`,
      questionText: `${base}³ = ?`,
      answer: base * base * base
    };
  }

  generateCubeRoot(diff) {
    let base;
    if (diff === 'easy') {
      base = this.getRandomInt(2, 5);
    } else if (diff === 'hard') {
      base = this.getRandomInt(4, 10);
    } else {
      base = this.getRandomInt(2, 7);
    }
    const cubeVal = base * base * base;
    return {
      type: MathOperations.CBRT,
      label: 'CUBE ROOT',
      questionHtml: `&#8731;${cubeVal} = ?`,
      questionText: `∛${cubeVal} = ?`,
      answer: base
    };
  }
}
