import React, { useState } from 'react';
import { Screen, Topic, Difficulty, PracticeMode, ScoreEntry, HistoryEntry, ProblemAttempt } from './types';
import { useLocalStorage } from './hooks/useLocalStorage';
import { LoginScreen } from './components/LoginScreen';
import { TopicScreen } from './components/TopicScreen';
import { PracticeScreen } from './components/PracticeScreen';
import { LeaderboardScreen } from './components/LeaderboardScreen';
import { HistoryScreen } from './components/HistoryScreen';

const App: React.FC = () => {
    const [screen, setScreen] = useState<Screen>(Screen.Login);
    const [user, setUser] = useState<string | null>(null);
    
    const [practiceSettings, setPracticeSettings] = useState<{
        topic: Topic;
        difficulty: Difficulty;
        mode: PracticeMode;
    } | null>(null);

    const [scores, setScores] = useLocalStorage<ScoreEntry[]>('tinhnhanh6-scores', []);
    const [history, setHistory] = useLocalStorage<HistoryEntry[]>('tinhnhanh6-history', []);

    const handleLogin = (name: string) => {
        setUser(name);
        setScreen(Screen.Topic);
    };

    const handleStart = (topic: Topic, difficulty: Difficulty, mode: PracticeMode) => {
        setPracticeSettings({ topic, difficulty, mode });
        setScreen(Screen.Practice);
    };

    const handleShowLeaderboard = () => {
        setScreen(Screen.Leaderboard);
    };

    const handleShowHistory = () => {
        setScreen(Screen.History);
    };

    const handleBackToTopics = () => {
        setPracticeSettings(null);
        setScreen(Screen.Topic);
    };
    
    const handleFinishPractice = (finalScore: number, attempts: ProblemAttempt[]) => {
        if (!user || !practiceSettings) {
            handleBackToTopics();
            return;
        }

        // Add to personal history for all modes
        const newHistoryEntry: HistoryEntry = {
            user,
            topic: practiceSettings.topic,
            difficulty: practiceSettings.difficulty,
            mode: practiceSettings.mode,
            score: finalScore,
            timestamp: Date.now(),
            attempts,
        };
        setHistory(prev => [...prev, newHistoryEntry]);

        // Add to leaderboard scores only for quiz mode
        if (practiceSettings.mode === PracticeMode.Quiz) {
            const newScore: ScoreEntry = {
                user,
                score: finalScore,
                topic: practiceSettings.topic,
                difficulty: practiceSettings.difficulty,
                timestamp: Date.now()
            };
            setScores(prevScores => [...prevScores, newScore]);
        }
        
        handleBackToTopics();
    };


    const renderScreen = () => {
        switch (screen) {
            case Screen.Login:
                return <LoginScreen onLogin={handleLogin} />;
            case Screen.Topic:
                if (!user) { // Should not happen, but as a fallback
                    setScreen(Screen.Login);
                    return null;
                }
                return <TopicScreen user={user} onStart={handleStart} onShowLeaderboard={handleShowLeaderboard} onShowHistory={handleShowHistory} />;
            case Screen.Practice:
                if (!user || !practiceSettings) { // Fallback
                    setScreen(Screen.Topic);
                    return null;
                }
                return <PracticeScreen {...practiceSettings} user={user} onFinish={handleFinishPractice} />;
            case Screen.Leaderboard:
                return <LeaderboardScreen scores={scores} onBack={handleBackToTopics} />;
            case Screen.History:
                 if (!user) { // Fallback
                    setScreen(Screen.Login);
                    return null;
                }
                return <HistoryScreen history={history} user={user} onBack={handleBackToTopics} />;
            default:
                return <LoginScreen onLogin={handleLogin} />;
        }
    };

    return (
        <div className="antialiased">
            <div key={screen} className="screen-transition">
                {renderScreen()}
            </div>
        </div>
    );
};

export default App;
