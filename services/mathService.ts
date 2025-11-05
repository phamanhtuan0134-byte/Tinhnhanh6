import { Topic, Difficulty, Problem } from '../types';

const randInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
const randFrom = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

const createSpeakableExpression = (text: string): string => {
    return text
        .replace(/\+/g, 'cộng')
        .replace(/ - /g, ' trừ ')
        .replace(/\*/g, 'nhân')
        .replace(/\//g, 'chia')
        .replace(/-/g, 'âm ');
};

const generateIntegerProblem = (difficulty: Difficulty): Problem => {
    let a, b, op;
    const ops = ['+', '-', '*'];
    if (difficulty === Difficulty.Easy) {
        a = randInt(-10, 10);
        b = randInt(1, 10);
        op = randFrom(['+', '-']);
    } else if (difficulty === Difficulty.Medium) {
        a = randInt(-25, 25);
        b = randInt(-25, 25);
        op = randFrom(ops);
    } else { // Hard
        a = randInt(-50, 50);
        b = randInt(-50, 50);
        op = randFrom(ops.concat(['/']));
        if (op === '/') {
            b = randInt(-10, 10);
            if (b === 0) b = 1;
            a = a * b; // Ensure divisibility
        }
    }
    
    const questionText = `${a < 0 ? `(${a})` : a} ${op} ${b < 0 ? `(${b})` : b}`;
    const speakableText = createSpeakableExpression(questionText);
    
    let answer;
    // eslint-disable-next-line no-eval
    answer = eval(questionText);

    return { questionText, speakableText: `${speakableText} bằng mấy?`, answer };
};

const gcd = (a: number, b: number): number => b ? gcd(b, a % b) : Math.abs(a);

const generateFractionProblem = (difficulty: Difficulty): Problem => {
    let n1, d1, n2, d2, op;
    op = randFrom(['+', '-']);
    
    if (difficulty === Difficulty.Easy) {
        d1 = randInt(3, 10);
        d2 = d1;
        n1 = randInt(1, d1 - 1);
        n2 = randInt(1, d1 - 1);
    } else if (difficulty === Difficulty.Medium) {
        d1 = randInt(3, 10);
        d2 = randInt(3, 10);
        n1 = randInt(1, d1 * 2);
        n2 = randInt(1, d2 * 2);
        op = randFrom(['+', '-', '*']);
    } else { // Hard
        d1 = randInt(3, 15);
        d2 = randInt(3, 15);
        n1 = randInt(-d1 * 2, d1 * 2);
        if (n1 === 0) n1 = 1;
        n2 = randInt(-d2 * 2, d2 * 2);
        if (n2 === 0) n2 = 1;
        op = randFrom(['+', '-', '*', '/']);
    }

    const qText = `(${n1}/${d1}) ${op} (${n2}/${d2})`;

    const speakableNum = (n: number) => n.toString().replace('-', 'âm ');
    const opText = op === '*' ? 'nhân' : op === '/' ? 'chia' : op === '+' ? 'cộng' : 'trừ';
    const sText = `mở ngoặc ${speakableNum(n1)} phần ${d1} đóng ngoặc ${opText} mở ngoặc ${speakableNum(n2)} phần ${d2} đóng ngoặc`;
    
    let ans_n, ans_d;
    if (op === '+') { ans_n = n1 * d2 + n2 * d1; ans_d = d1 * d2; }
    else if (op === '-') { ans_n = n1 * d2 - n2 * d1; ans_d = d1 * d2; }
    else if (op === '*') { ans_n = n1 * n2; ans_d = d1 * d2; }
    else { ans_n = n1 * d2; ans_d = d1 * n2; } // op === '/'

    if(ans_d < 0) {
      ans_d = -ans_d;
      ans_n = -ans_n;
    }
    
    const numericAnswer = ans_n / ans_d;
    
    let answerDisplay;
    if (ans_n === 0) {
        answerDisplay = "0";
    } else {
        const commonDivisor = gcd(ans_n, ans_d);
        let simplified_n = ans_n / commonDivisor;
        let simplified_d = ans_d / commonDivisor;

        if (simplified_d < 0) {
            simplified_d *= -1;
            simplified_n *= -1;
        }

        answerDisplay = simplified_d === 1 ? `${simplified_n}` : `${simplified_n}/${simplified_d}`;
    }


    return { questionText: qText, speakableText: `${sText} bằng mấy?`, answer: numericAnswer, answerDisplay };
};


const generatePercentageProblem = (difficulty: Difficulty): Problem => {
    let p, n;
    if(difficulty === Difficulty.Easy) {
        p = randFrom([10, 20, 25, 50, 75]);
        n = randInt(2, 20) * 10;
    } else if (difficulty === Difficulty.Medium) {
        p = randInt(5, 95);
        n = randInt(10, 500);
    } else {
        p = randInt(1, 150);
        n = randInt(100, 10000);
    }

    const qText = `${p}% của ${n}`;
    const sText = `${p} phần trăm của ${n}`;
    const answer = (p / 100) * n;

    return { questionText: qText, speakableText: `${sText} là bao nhiêu?`, answer };
};

const generateExpressionProblem = (difficulty: Difficulty): Problem => {
    let qText, answer;
    const a = randInt(-10, 10);
    const b = randInt(-10, 10);
    const c = randInt(-5, 5);
    const d = randInt(-5, 5);
    
    if (difficulty === Difficulty.Easy) {
        qText = `${a} + (${b} * ${c})`;
        answer = a + (b * c);
    } else if (difficulty === Difficulty.Medium) {
        qText = `(${a} + ${b}) * (${c} - ${d})`;
        answer = (a + b) * (c - d);
    } else {
        const e = randInt(1, 5);
        qText = `(${a} * (${b} - ${c})) + (${d} * ${e})`;
        answer = (a * (b-c)) + (d*e);
    }
    
    const sText = createSpeakableExpression(qText);
    return { questionText: qText, speakableText: `${sText} bằng mấy?`, answer };
};


export const generateProblem = (topic: Topic, difficulty: Difficulty): Problem => {
    switch(topic) {
        case Topic.Integer: return generateIntegerProblem(difficulty);
        case Topic.Fraction: return generateFractionProblem(difficulty);
        case Topic.Percentage: return generatePercentageProblem(difficulty);
        case Topic.Expression: return generateExpressionProblem(difficulty);
        default: return generateIntegerProblem(Difficulty.Easy);
    }
};

export const checkAnswer = (userAnswer: string, correctAnswer: number): boolean => {
    const cleanedUserAnswer = userAnswer.trim().replace(',', '.');
    let userAnswerNum: number;

    if (cleanedUserAnswer.includes('/')) {
        const parts = cleanedUserAnswer.split('/');
        if (parts.length !== 2) return false;

        const n = parseFloat(parts[0]);
        const d = parseFloat(parts[1]);

        if (isNaN(n) || isNaN(d) || d === 0) {
            return false;
        }
        userAnswerNum = n / d;
    } else {
        userAnswerNum = parseFloat(cleanedUserAnswer);
    }

    if (isNaN(userAnswerNum)) return false;
    
    // Allow for small floating point inaccuracies
    return Math.abs(userAnswerNum - correctAnswer) < 0.001;
};