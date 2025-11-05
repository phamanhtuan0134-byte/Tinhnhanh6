import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Topic, Difficulty, PracticeMode, Problem, QUIZ_LENGTH, ProblemAttempt } from '../types';
import { generateProblem, checkAnswer } from '../services/mathService';
import { speak } from '../services/geminiService';
import { SpeakerIcon } from './icons/SpeakerIcon';
import { LoadingSpinner } from './icons/LoadingSpinner';
import { Footer } from './Footer';

interface PracticeScreenProps {
    topic: Topic;
    difficulty: Difficulty;
    mode: PracticeMode;
    user: string;
    onFinish: (finalScore: number, attempts: ProblemAttempt[]) => void;
}

export const PracticeScreen: React.FC<PracticeScreenProps> = ({ topic, difficulty, mode, onFinish }) => {
    const [problem, setProblem] = useState<Problem | null>(null);
    const [userAnswer, setUserAnswer] = useState('');
    const [feedback, setFeedback] = useState<{ message: string; color: string } | null>(null);
    const [isChecking, setIsChecking] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);

    const [questionCount, setQuestionCount] = useState(0);
    const [score, setScore] = useState(0);
    const [isQuizOver, setIsQuizOver] = useState(false);
    const [attempts, setAttempts] = useState<ProblemAttempt[]>([]);
    
    const inputRef = useRef<HTMLInputElement>(null);

    const speakWithLoading = useCallback(async (text: string) => {
        setIsSpeaking(true);
        await speak(text);
        setIsSpeaking(false);
    }, []);

    const newProblem = useCallback(() => {
        if (mode === PracticeMode.Quiz && questionCount >= QUIZ_LENGTH) {
            setIsQuizOver(true);
            speakWithLoading(`Bạn đã hoàn thành bài thi với ${score} trên ${QUIZ_LENGTH} điểm. Giỏi lắm!`);
            return;
        }
        setProblem(generateProblem(topic, difficulty));
        setUserAnswer('');
        setFeedback(null);
        setIsChecking(false);
        setQuestionCount(prev => prev + 1);
        inputRef.current?.focus();
    }, [topic, difficulty, mode, questionCount, score, speakWithLoading]);

    useEffect(() => {
        newProblem();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (problem) {
            speakWithLoading(problem.speakableText);
        }
    }, [problem, speakWithLoading]);

    const handleCheck = async () => {
        if (!problem || isChecking) return;
        setIsChecking(true);
        const isCorrect = checkAnswer(userAnswer, problem.answer);

        const newAttempt: ProblemAttempt = {
            questionText: problem.questionText,
            userAnswer: userAnswer || '(bỏ trống)',
            correctAnswerDisplay: problem.answerDisplay ?? problem.answer.toLocaleString('vi-VN'),
            isCorrect,
        };
        setAttempts(prev => [...prev, newAttempt]);

        if (isCorrect) {
            setFeedback({ message: 'Đúng rồi, giỏi lắm!', color: 'text-green-500' });
            await speakWithLoading('Đúng rồi, giỏi lắm!');
            if (mode === PracticeMode.Quiz) {
                setScore(s => s + 1);
            }
        } else {
            const answerText = `Đáp án đúng là ${problem.answerDisplay ?? problem.answer.toLocaleString('vi-VN')}`;
            setFeedback({ message: `Sai rồi. ${answerText}`, color: 'text-red-500' });
            
            const speakableAnswer = problem.answerDisplay
                ? problem.answerDisplay.replace('/', ' phần ').replace('-', 'âm ')
                : problem.answer.toString().replace('-', 'âm ');

            await speakWithLoading(`Sai rồi, đáp án là ${speakableAnswer}`);
        }
        
        setTimeout(newProblem, 1500);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        handleCheck();
    };

    if (isQuizOver) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-100 to-indigo-200 p-4 relative">
                <div className="w-full max-w-md text-center bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8">
                    <h2 className="text-3xl font-bold text-indigo-800 mb-4">Kết thúc bài thi!</h2>
                    <p className="text-xl text-gray-700 mb-6">
                        Điểm của bạn: <span className="font-bold text-2xl text-indigo-600">{score} / {QUIZ_LENGTH}</span>
                    </p>
                    <button 
                        onClick={() => onFinish(score, attempts)}
                        className="w-full bg-indigo-600 text-white font-bold text-lg py-3 rounded-lg hover:bg-indigo-700 active:scale-95 transform transition duration-300 shadow-md"
                    >
                        Quay lại
                    </button>
                </div>
                <Footer className="absolute bottom-4 text-center w-full" />
            </div>
        );
    }


    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-yellow-100 to-orange-200 p-4 relative">
            <div className="w-full max-w-2xl bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 md:p-8 relative">
                <div className="absolute top-4 right-4 flex items-center space-x-4 text-gray-600 font-semibold">
                    <span>{mode}</span>
                    {mode === PracticeMode.Quiz && <span>{questionCount}/{QUIZ_LENGTH}</span>}
                    {mode === PracticeMode.Quiz && <span className="text-yellow-600">Điểm: {score}</span>}
                </div>

                <div className="text-center mt-12">
                    <div className="flex items-center justify-center gap-4 mb-6">
                        <p className="text-4xl md:text-6xl font-bold text-gray-800 tracking-wider">
                           {problem?.questionText} = ?
                        </p>
                        <button 
                            onClick={() => problem && speakWithLoading(problem.speakableText)}
                            className="p-2 rounded-full hover:bg-yellow-200 transition disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={isSpeaking}
                        >
                            {isSpeaking ? <LoadingSpinner className="w-8 h-8" /> : <SpeakerIcon className="w-8 h-8 text-yellow-600" />}
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="mt-8">
                        <input
                            ref={inputRef}
                            type="text"
                            value={userAnswer}
                            onChange={(e) => setUserAnswer(e.target.value)}
                            placeholder="Nhập đáp án..."
                            className="w-full max-w-sm mx-auto px-4 py-3 text-2xl text-center border-2 border-orange-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition duration-300"
                            disabled={isChecking}
                        />
                        <button
                            type="submit"
                            disabled={isChecking || !userAnswer}
                            className="w-full max-w-sm mx-auto mt-6 bg-orange-500 text-white font-bold text-xl py-3 rounded-lg hover:bg-orange-600 active:scale-95 transform transition duration-300 shadow-md disabled:bg-gray-400 disabled:cursor-not-allowed"
                        >
                            {isChecking ? 'Đang kiểm tra...' : 'Kiểm tra'}
                        </button>
                    </form>
                    
                    {feedback && (
                        <p className={`mt-4 text-xl font-semibold ${feedback.color} transition-opacity duration-300`}>
                            {feedback.message}
                        </p>
                    )}
                </div>
                 <button 
                    onClick={() => onFinish(score, attempts)}
                    className="absolute bottom-4 left-4 text-gray-500 hover:text-gray-800"
                >
                    &larr; Thoát
                </button>
            </div>
            <Footer className="absolute bottom-4 text-center w-full" />
        </div>
    );
};
