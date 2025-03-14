import { useState, useCallback, useRef } from 'react';

import QUESTIONS from '../questions.js';
import quizCompleteImg from '../assets/quiz-complete.png';
import QuestionTimer from './QuestionTimer.jsx';
import Answers from './Answers.jsx';
import Question from './Question.jsx';

export default function Quiz() {
    const [answerState, setAnswerState] = useState('');
    const [userAnswers, setUserAnswers] = useState([]);

    /*
    The difference between userAnswers.length and userAnswers.length - 1 in this code affects 
    how the current active question is determined.

    If answerState === '' (No answer in progress)
    Use userAnswers.length ->This means the next question should be active.

    If answerState !== '' (An answer is being processed, in 'answered', 'correct', or 'wrong' state)
    Use userAnswers.length - 1 -> This means the current question should stay the same while processing the answer.

    Scenario 1: Before the user selects an answer
        userAnswers = []
        answerState = ''
        activeQuestionIndex = userAnswers.length = 0
        The first question (QUESTIONS[0]) is shown.

    Scenario 2: User selects an answer, and it's being processed
        userAnswers = ['A'] (Let's say they chose 'A')
        answerState = 'answered'
        activeQuestionIndex = userAnswers.length - 1 = 1 - 1 = 0
        The question does not change while processing the answer.

    Scenario 3: Answer processing is finished
        answerState is reset to '' after the timeout.
        userAnswers = ['A'] remains the same.
        Now, activeQuestionIndex = userAnswers.length = 1
        The quiz moves to the next question (QUESTIONS[1]).

    Intinya biar mastiin question selanjutnya ga langsung muncul ketika ada jawaban yang dipilih
    */

    const activeQuestionIndex = answerState === '' ? userAnswers.length : userAnswers.length - 1;

    const quizIsComplete = activeQuestionIndex === QUESTIONS.length;


    // memastikan handleSelectAnswer tidak dirender ulang ketika app rerender
    const handleSelectAnswer = useCallback(function handleSelectAnswer(selectedAnswer) {
        setAnswerState('answered');
        setUserAnswers((prevUserAnswers) => {
            return [...prevUserAnswers, selectedAnswer];
        });

        setTimeout(() => {
            if (selectedAnswer === QUESTIONS[activeQuestionIndex].answers[0]) {
                setAnswerState('correct');
            } else {
                setAnswerState('wrong');
            }

            setTimeout(() => {
                setAnswerState('');
            }, 2000);
        }, 1000);
    }, [activeQuestionIndex]);


    /* 
    Mekanismenya ketika QuestionTimer selesai, handleSkipAnswer akan diexecuted
    handleSkipAnswer() dipanggil, lalu memanggil handleSelectAnswer(null) karna gaada jawaban waktu uda habis
    quiz berjalan ke selanjutnya karna userAnswer.length (di QuestionTimer)

    Notes : 
    handleskipAnswer pake callback menandakan handleSkipAnswer bergahtung pada handleSelectAnswer.
    karena handleSelectAnswer gaperna berubah (karena useCallback dengan []), handleSkipAnswer juga ga berubah.

    */
    const handleSkipAnswer = useCallback(() => handleSelectAnswer(null), [handleSelectAnswer]);

    if (quizIsComplete) {
        return <div id="summary">
            <img src={quizCompleteImg} alt="Trophy Icon" />
            <h2>Quiz Completed!</h2>
        </div>
    }

    return (
        <div id="quiz">
            <Question 
                // kalo key bukan di list, dia bakal destroy old component
                // lalu dia akan buat yang baru
                // kalo 2 component di 1 div pake key, bakal error, solusinya jadiin aja 1 component
                key={activeQuestionIndex}
                questionText={QUESTIONS[activeQuestionIndex].text}
                answers={QUESTIONS[activeQuestionIndex].answers}
                answerState={answerState}
                selectedAnswer={userAnswers[userAnswers.length - 1]}
                onSelectAnswer={handleSelectAnswer}
                onSkipAnswer={handleSkipAnswer}
            />
        </div>
    );
}