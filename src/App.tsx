import React, { useState, useEffect } from "react";
// import  "./Quiz.scss";

type Question = {
    quiz: string;
    choices: string[];
    answer: number;
    explanation: string;
}

const Quiz: React.FC = () => {
    const [questions, setQuestions] = useState<Question[]>([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
    const [score, setScore] = useState(0);
    const [showExplanation, setShowExplanation] = useState(false);
    const [quizFinished, setQuizFinished] = useState(false);
    const [quizStarted, setQuizStarted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [dots, setDots] = useState(".");
    const [error, setError] = useState<string | null>(null);
    const [category, setCategory] = useState("");
    const [selectingCategory, setSelectingCategory] = useState(false);

    useEffect(() => {
        let interval: number;
        if (loading) {
            interval = setInterval(() => {
                setDots((prev) => (prev.length === 3 ? "." : prev + "."));
            }, 500);
        }
        return () => clearInterval(interval);
    }, [loading]);

    const currentQuestion = questions[currentQuestionIndex] || {};

    const handleNextQuestion = () => {
        if (selectedAnswer === null) return;
        if (selectedAnswer === currentQuestion.answer) {
            setScore((prev) => prev + 1);
        }
        setShowExplanation(true);
    };

    const handleCotinue = () => {
        setShowExplanation(false);
        setSelectedAnswer(null);
        if(currentQuestionIndex + 1 < questions.length) {
            setCurrentQuestionIndex((prev) => prev + 1);
        } else {
            setQuizFinished(true);
        }
    };

    const startQuiz = async () => {
        setQuizStarted(true);
        setLoading(true);
        const fetchedQuestions: Question[] = [];

        try{
            for (let i = 0; i < 1; i++) {
                const body = category.trim() ? JSON.stringify({ category }) : undefined;
                const response = await fetch("http://127.0.0.1:8000/trivia_quiz", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body,
                });

                if(!response.ok) {
                    throw new Error(`API Error: ${response.statusText}`);
                }

                const data = await response.json();
                fetchedQuestions.push({
                    quiz: data.item.quiz,
                    choices: data.item.choices,
                    answer: data.item.answer,
                    explanation: data.item.explanation,
                });
            }

            setQuestions(fetchedQuestions);
        } catch (err) {
            setError("エラーが発生しました");
        } finally {
            setLoading(false);
        }
    };

    const resetQuiz = () => {
        setQuestions([]);
        setCurrentQuestionIndex(0);
        setSelectedAnswer(null);
        setScore(0);
        setShowExplanation(false);
        setQuizFinished(false);
        setQuizStarted(false);
    };

    return (
        <div id="app">
            <h1>豆知識クイズ</h1>

            {error && (
                <div className="error-screen">
                    <h1>エラーが発生しました</h1>
                    <p>{error}</p>
                    <p>リロードしてやりなおしてください</p>
                </div>
            )}

            {!quizStarted && (
                <div className="start-screen">
                    <p>クイズのスタートの方法を選んでください</p>
                    <button onClick={() => setSelectingCategory(true)}>クイズのジャンルを指定する</button>
                    <button onClick={startQuiz}>おまかせでスタート</button>

                    {selectingCategory && (
                        <div>
                        <p>クイズのジャンルを入力してください</p>
                        <input type="text" placeholder="日本の歴史" value={category} onChange={(e) => setCategory(e.target.value)} />
                        <button disabled={!category.trim()} onClick={startQuiz}>このジャンルで開始</button>
                        <button onClick={() => setSelectingCategory(false)}>戻る</button>
                        </div>
                    )}
                </div>
            )}

            {loading && <div className="loading-screen"><h1>クイズを読み込み中{dots}</h1></div>}

            {quizFinished && (
                <div className="result">
                    <h1>クイズ終了</h1>
                    <p>あなたのスコアは {score} / {questions.length} です</p>
                    <button onClick={resetQuiz}>もう一度ゲームをする</button>
                </div>
            )}
        </div>
    )
}

export default Quiz;