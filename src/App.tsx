import React, { useState } from "react";
// import './App.css'

interface Question {
  quiz: string;
  choices: string[];
  answer: number;
  explanation: string;
}

const questions: Question[] = [
  {
    quiz: "地球上にはおよそ何種類の昆虫がいるでしょうか？",
    choices: ["約100万個", "約1000万個", "約1億個"],
    answer: 1,
    explanation: "地球上には推定約1000万種の昆虫が存在すると言われています。",
  },
  {
    quiz: "JavaScriptの変数宣言に使われるキーワードはどれですか？",
    choices: ["var", "let", "const"],
    answer: 3,
    explanation:
      "JavaScriptでは「var」「let」「const」を使って変数を宣言できます。",
  },
  {
    quiz: "CSSのフレームワークで有名なのはどれですか？",
    choices: ["Bootstrap", "Tailwind", "Bulma", "以上すべて"],
    answer: 3,
    explanation:
      "Bootstrap、Tailwind、Bulmaはすべて人気のあるCSSフレームワークです。",
  },
];

const App: React.FC = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [score, setScore] = useState<number>(0);
  const [showExplanation, setShowExplanation] = useState<boolean>(false);
  const [quizFinished, setQuizFinished] = useState<boolean>(false);
  const [quizStarted, setQuizStarted] = useState<boolean>(false);

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

  const startQuiz = (): void => {
    setQuizStarted(true);
  };

  if (!quizStarted) {
    return (
      <div className="start-screen">
        <h1>豆知識クイズ</h1>
        <p>クイズを開始するには、下のボタンをクリックしてください</p>
        <button onClick={startQuiz}>クイズを開始</button>
      </div>
    )
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
