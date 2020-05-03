import React, { useState, useEffect } from "react";
import { View, Text, TouchableWithoutFeedback, StyleSheet } from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RouteProp } from "@react-navigation/native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import _get from "lodash/get";
import _has from "lodash/has";

import { globalStyles } from "../styles/globals";
import { QuestionType, AnswerType, RoutesStackParamList } from "../ts/appTypes";

import Answer from "./Answer";
import Question from "./Question";
import useCountdown from "./hooks/useCountdown";

type Props = {
  navigation: StackNavigationProp<RoutesStackParamList, "Game">;
  route: RouteProp<RoutesStackParamList, "Game">;
};

const fakeGame = {
  questions: [
    {
      text: "Kampala is the capital of",
      correctAnswer: "Uganda",
      choices: [{ answer: "Kenya" }, { answer: "Bhutan" }, { answer: "Uganda" }, { answer: "Rwanda" }],
    },
    {
      text: "Mogadishu is the capital of",
      correctAnswer: "Somalia",
      choices: [{ answer: "Somalia" }, { answer: "Azerbaijan" }, { answer: "Angola" }, { answer: "Djibouti" }],
    },
  ],
};

type CheckQuestion = {
  question: QuestionType;
  answer?: AnswerType;
};

type OptionalAnswer = AnswerType | undefined;
type OptionalQuestion = QuestionType | undefined;

type CheckShowQuestion = { selectedAnswer?: AnswerType } & CheckQuestion;

const isAnswerCorrect = (props: CheckQuestion): boolean => {
  const { question, answer } = props;
  return !!answer && question.correctAnswer === answer.answer;
};

const isAnswerIncorrect = (props: CheckQuestion): boolean => {
  const { question, answer } = props;
  return !!answer && question.correctAnswer !== answer.answer;
};

const isShownAsCorrect = (props: CheckShowQuestion): boolean => {
  let showAsCorrect = false;
  const { question, answer, selectedAnswer } = props;

  if (selectedAnswer) {
    showAsCorrect = isAnswerCorrect({ question, answer });
  }

  return showAsCorrect;
};

const isShownAsIncorrect = (props: CheckShowQuestion): boolean => {
  let showAsIncorrect = false;
  const { question, answer, selectedAnswer } = props;

  if (selectedAnswer && answer) {
    showAsIncorrect = isAnswerIncorrect({ question, answer }) && selectedAnswer.answer === answer.answer;
  }

  return showAsIncorrect;
};

export const READ_ANSWER_TIME = 500;
export const ANSWER_TIME = 2000;

const Game: React.FC<Props> = (props) => {
  const game = props?.route?.params?.game;
  // const game = fakeGame;

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(-1);
  const [selectedAnswer, setSelectedAnswer] = useState((): OptionalAnswer => undefined);

  const countDown = useCountdown();

  useEffect(() => {
    if (game && Array.isArray(game.questions) && game.questions.length > 0) {
      setCurrentQuestionIndex(0);
    } else {
      setCurrentQuestionIndex(-1);
    }
  }, [game]);

  useEffect(() => {
    const hasGameEnded = hasGameStarted() && currentQuestionIndex >= game.questions.length;
    if (hasGameEnded) {
      onEndGame();
    } else if (currentQuestionIndex >= 0) {
      countDown.start({
        time: ANSWER_TIME,
        onEnd: () => {
          const correctAnswer = getCorrectAnswer();
          onSelectAnswer(correctAnswer);
        },
      });
    }
  }, [currentQuestionIndex]);

  const getCorrectAnswer = (): OptionalAnswer => {
    let correctAnswer;
    const currentQuestion = getCurrentQuestion();
    if (currentQuestion) {
      correctAnswer = currentQuestion.choices.find(({ answer }) => answer === currentQuestion.correctAnswer);
    }

    return correctAnswer;
  };

  const onEndGame = () => {
    props?.navigation?.navigate("Score");
  };

  const hasGameStarted = () => currentQuestionIndex > -1;

  const getCurrentQuestion = (): OptionalQuestion => {
    let question;

    if (hasGameStarted()) {
      question = _get(game, `questions[${currentQuestionIndex}]`);
    }

    return question;
  };

  const onSelectAnswer = (answer?: OptionalAnswer) => {
    setSelectedAnswer(answer);
    countDown.start({ time: READ_ANSWER_TIME, onEnd: nextQuestion });
  };

  const nextQuestion = () => {
    if (hasGameStarted()) {
      setSelectedAnswer(undefined);
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  const currentQuestion = getCurrentQuestion();
  return (
    <View testID="gameScreen" style={styles.gameContainer}>
      <View style={styles.closeBtnContainer}>
        <TouchableWithoutFeedback testID="endGameBtn" onPress={onEndGame} accessibilityLabel="End Game">
          <MaterialCommunityIcons style={{ marginLeft: 8 }} name="close" size={29} color="grey" />
        </TouchableWithoutFeedback>
      </View>
      {currentQuestion ? (
        <>
          <View style={{ flex: 3 }}>
            <Question question={currentQuestion} />
            {/*<View> <Text>{selectedAnswer ? "" : countDown.timeLeft}</Text> </View>*/}
          </View>
          <View style={{ flex: 2 }}>
            {currentQuestion?.choices.map((answer) => (
              <Answer
                key={answer.answer}
                answer={answer}
                isCorrect={isShownAsCorrect({
                  question: currentQuestion,
                  answer,
                  selectedAnswer,
                })}
                isIncorrect={isShownAsIncorrect({
                  question: currentQuestion,
                  answer,
                  selectedAnswer,
                })}
                onSelect={() => {
                  onSelectAnswer(answer);
                }}
              />
            ))}
          </View>
        </>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  gameContainer: StyleSheet.flatten([globalStyles.container, { padding: 30 }]),
  closeBtnContainer: { marginTop: 20, height: 30 },
});

export default Game;
