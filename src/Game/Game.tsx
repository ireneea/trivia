import React from "react";
import { useMachine } from "@xstate/react";

import { View, TouchableWithoutFeedback, StyleSheet } from "react-native";

import { StackNavigationProp } from "@react-navigation/stack";
import { RouteProp } from "@react-navigation/native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import { globalStyles } from "../styles/globals";
import { AnswerType, RoutesStackParamList, QuestionType } from "../ts/appTypes";

import gameMachine from "./gameMachine";

import Answer from "./Answer";
import Question from "./Question";
import useCountdown from "./hooks/useCountdown";

type Props = {
  navigation: StackNavigationProp<RoutesStackParamList, "Game">;
  route: RouteProp<RoutesStackParamList, "Game">;
};

const Game: React.FC<Props> = (props) => {
  const game = props?.route?.params?.game;

  const [gameState, sendGameEvent] = useMachine(
    gameMachine.machine.withContext({ rounds: game?.questions.length || 0, currentRound: 0 }),
    gameMachine.options
  );
  const [selectedAnswer, setSelectedAnswer] = React.useState((): AnswerType | undefined => undefined);

  React.useEffect(() => {
    sendGameEvent(gameMachine.events.START);
  }, []);

  React.useEffect(() => {
    if (isGameOver()) {
      quit();
    }
  }, [gameState.value]);

  const quit = () => {
    if (!isGameOver()) {
      sendGameEvent(gameMachine.events.QUIT);
    }
    props?.navigation?.navigate("Score");
  };

  const isPlaying = () => isAnswering() || isFeedback();
  const isAnswering = () => gameState.matches("answering");
  const hasAnswered = () => isFeedback() && !hasNotAnswered();
  const isFeedback = () => gameState.matches("feedback");
  const hasNotAnswered = () => gameState.matches("feedback.noAnswer");
  const isGameOver = () => gameState.matches("gameOver");

  const getCurrentQuestion = (): QuestionType | undefined => {
    let question;
    const { currentRound } = gameState.context;
    if (isPlaying() && currentRound && game?.questions[currentRound - 1]) {
      question = game.questions[currentRound - 1];
    }

    return question;
  };

  const onAnswer = (answer: AnswerType) => {
    if (isAnswerCorrect(answer)) {
      sendGameEvent(gameMachine.events.CORRECT_ANSWER);
    } else {
      sendGameEvent(gameMachine.events.INCORRECT_ANSWER);
    }
    setSelectedAnswer(answer);
  };

  const isSelectedAnswer = (answer: AnswerType) => {
    return !!selectedAnswer && !!answer && selectedAnswer.answer === answer.answer;
  };

  const isAnswerCorrect = (answer: AnswerType): boolean => {
    const question = getCurrentQuestion();
    return !!question && question.correctAnswer === answer.answer;
  };

  const isAnswerIncorrect = (answer: AnswerType): boolean => {
    const question = getCurrentQuestion();
    return !!question && question.correctAnswer !== answer.answer;
  };

  const currentQuestion = getCurrentQuestion();

  return (
    <View testID="gameScreen" style={styles.gameContainer}>
      <View style={styles.closeBtnContainer}>
        <TouchableWithoutFeedback testID="endGameBtn" onPress={quit} accessibilityLabel="End Game">
          <MaterialCommunityIcons style={{ marginLeft: 8 }} name="close" size={29} color="grey" />
        </TouchableWithoutFeedback>
      </View>
      <View style={{ flex: 3 }}>
        <Question question={currentQuestion} />
      </View>
      <View style={{ flex: 2 }}>
        {currentQuestion?.choices.map((answer: AnswerType) => (
          <Answer
            key={answer.answer}
            answer={answer}
            isCorrect={isFeedback() && isAnswerCorrect(answer)}
            isIncorrect={isFeedback() && hasAnswered() && isSelectedAnswer(answer) && isAnswerIncorrect(answer)}
            onSelect={() => onAnswer(answer)}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  gameContainer: StyleSheet.flatten([globalStyles.container, { padding: 30 }]),
  closeBtnContainer: { marginTop: 20, height: 30 },
});

export default Game;
