import { useState, useCallback } from 'react';

import QUESTIONS from '../questions.js';
import quizCompleteImg from '../assets/quiz-complete.png';
import QuestionTimer from './QuestionTimer.jsx';

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

    const shuffledAnswers = [...QUESTIONS[activeQuestionIndex].answers];
    shuffledAnswers.sort(() => Math.random() - 0.5);

    return (
        <div id="quiz">
            <div id="question">
                <QuestionTimer
                    // kalo key bukan di list, dia bakal destroy old component
                    // lalu dia akan buat yang baru
                    key={activeQuestionIndex}
                    timeout={10000}
                    onTimeout={handleSkipAnswer}
                />
                <h2>{QUESTIONS[activeQuestionIndex].text}</h2>
                <ul id="answers">
                    {shuffledAnswers.map((answer) => {
                        const isSelected = userAnswers[userAnswers.length - 1] === answer;
                        let cssClass = '';

                        if(answerState === 'answered' && isSelected) {
                            cssClass ='selected';
                        }

                        if((answerState === 'correct' || answerState === 'wrong') && isSelected) {
                            cssClass = answerState;
                        }
                        return (
                            <li key={answer} className="answer">
                                <button 
                                    onClick={() => handleSelectAnswer(answer)}
                                    className = {cssClass}
                                >
                                    {answer}
                                </button>
                            </li>
                        );
                    })}
                </ul>
            </div>
        </div>
    );
}