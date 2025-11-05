export const QUIZ_LENGTH = 5;

export enum Screen {
    Login = 'Login',
    Topic = 'Topic',
    Practice = 'Practice',
    Leaderboard = 'Leaderboard',
    History = 'History',
}

export enum Topic {
    Integer = 'Số nguyên',
    Fraction = 'Phân số',
    Percentage = 'Phần trăm',
    Expression = 'Biểu thức',
}

export enum Difficulty {
    Easy = 'Dễ',
    Medium = 'Trung bình',
    Hard = 'Khó',
}

export enum PracticeMode {
    Practice = 'Luyện tập',
    Quiz = 'Thi nhanh',
}

export interface Problem {
    questionText: string;
    speakableText: string;
    answer: number;
    answerDisplay?: string;
}

export interface ProblemAttempt {
    questionText: string;
    userAnswer: string;
    correctAnswerDisplay: string;
    isCorrect: boolean;
}

export interface ScoreEntry {
    user: string;
    score: number;
    topic: Topic;
    difficulty: Difficulty;
    timestamp: number;
}

export interface HistoryEntry {
    user: string;
    topic: Topic;
    difficulty: Difficulty;
    mode: PracticeMode;
    score: number;
    timestamp: number;
    attempts: ProblemAttempt[];
}
