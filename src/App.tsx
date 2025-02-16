import React, { useEffect, useState } from "react";
import './App.css'

interface Question {
  quiz: string;
  choices: string[];
  answer: number;
  explanation: string;
}

const App: React.FC = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [score, setScore] = useState<number>(0);
  const [showExplanation, setShowExplanation] = useState<boolean>(false);
  const [quizFinished, setQuizFinished] = useState<boolean>(false);
  const [quizStarted, setQuizStarted] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [dots, setDots] = useState<string>(".");
  const [error, setError] = useState<string | null>(null);

  const API_URL = import.meta.env.VITE_LLM_INTERACTION_API_URL;

  useEffect(() => {
    if (loading) {
      const interval = setInterval(() => {
        setDots((prevDots) => {
          if (prevDots.length === 3) {
            return ".";
          }
          return prevDots + ".";
        });
      }, 500);

      return () => clearInterval(interval);
    }
  }, [loading]);

  const handleNextQuestion = (): void => {
    if (selectedAnswer === null) return;

    if (selectedAnswer === questions[currentQuestionIndex].answer) {
      setScore(score + 1);
    }
    setShowExplanation(true);
  };

  const handleContinue = (): void => {
    setShowExplanation(false);
    setSelectedAnswer(null);
    if (currentQuestionIndex + 1 < questions.length) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setQuizFinished(true);
    }
  };

  const startQuiz = async (): Promise<void> => {
    setQuizStarted(true);
    setLoading(true);
    const fetchedQuestions: Question[] = [];

    try {
      for (let i = 0; i < 1; i++) {
        const response = await fetch(`${API_URL}/trivia_quiz`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
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
    } catch (error: any) {
      setError("エラーが発生しました");
    } finally {
      setLoading(false);
    }
  };

  if(error) {
    return (
      <div className="error-screen">
        <h1>エラーが発生しました</h1>
        <p>{error}</p>
        <p>リロードしてやり直してください</p>
      </div>
    );
  }

  if (!quizStarted) {
    return (
      <div className="start-screen">
        <h1>豆知識クイズ</h1>
        <p>クイズを開始するには、下のボタンをクリックしてください</p>
        <button onClick={startQuiz}>クイズを開始</button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="loading-screen">
        <h1>クイズを読み込み中{dots}</h1>
      </div>
    );
  }

  if (quizFinished) {
    return (
      <div className="result">
        <h1>クイズ終了</h1>
        <p>
          あなたのスコアは {score} / {questions.length}です
        </p>
      </div>
    );
  }

  const { quiz, choices, explanation, answer } =
    questions[currentQuestionIndex];

  return (
    <div className="App">
      <h1>豆知識クイズ</h1>
      <div className="question">
        <h2>{quiz}</h2>
        <div className="choices">
          {choices.map((choice, index) => (
            <button
              key={index}
              onClick={() => setSelectedAnswer(index)}
              style={{
                backgroundColor: selectedAnswer === index ? "lightblue" : "",
              }}
              disabled={showExplanation}
            >
              {choice}
            </button>
          ))}
        </div>
      </div>
      <div className="next-button">
        {!showExplanation ? (
          <button
            onClick={handleNextQuestion}
            disabled={selectedAnswer === null}
          >
            解答
          </button>
        ) : (
          <button onClick={handleContinue}>次の問題へ</button>
        )}
      </div>
      {showExplanation && (
        <div className="explanation">
          <h3>正解: {answer}</h3>
          <p>{explanation}</p>
        </div>
      )}
    </div>
  );
};

export default App;
