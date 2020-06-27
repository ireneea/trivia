import React from "react";
import { useMachine } from "@xstate/react";

import { View, TouchableWithoutFeedback, StyleSheet, Text } from "react-native";

import { StackNavigationProp } from "@react-navigation/stack";
import { RouteProp } from "@react-navigation/native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import BackgroundScreen from "../components/BackgroundScreen";

import { globalStyles, colors, fontSize } from "../styles/globals";
import { AnswerType, RoutesStackParamList, QuestionType } from "../ts/appTypes";

import gameMachine from "./gameMachine";

import Answer from "./Answer";
import Question from "./Question";
import OverlayTimer from "./OverlayTimer";
import Rounds from "./Rounds";
import useCountdown from "./hooks/useCountdown";

export const READ_ANSWER_TIME = 1000;
export const ANSWER_TIME = 5000;
export const ANSWER_BONUS_TIME_LIMIT = 3000;

type Props = {
  navigation: StackNavigationProp<RoutesStackParamList, "Game">;
  route: RouteProp<RoutesStackParamList, "Game">;
};

const Game: React.FC<Props> = (props) => {
  const game = props?.route?.params?.game;

  const [gameState, sendGameEvent] = useMachine(
    gameMachine.machine.withContext({ rounds: game?.questions.length || 0, currentRound: 0, score: 0, results: {} }),
    gameMachine.options
  );
  const countdown = useCountdown();
  const [selectedAnswer, setSelectedAnswer] = React.useState((): AnswerType | undefined => undefined);
  const [timeLeft, setTimeLeft] = React.useState(() => ANSWER_TIME);

  React.useEffect(() => {
    sendGameEvent(gameMachine.events.START);
  }, []);

  React.useEffect(() => {
    if (isAnswering()) {
      setTimeLeft(countdown.timeLeft);
    }
  }, [countdown.timeLeft]);

  React.useEffect(() => {
    countdown.pause();
    if (isGameOver()) {
      quit();
    } else if (isAnswering() && gameState.changed) {
      countdown.start({
        time: ANSWER_TIME,
        onEnd: () => {
          setSelectedAnswer(undefined);
          sendGameEvent(gameMachine.events.NO_ANSWER);
        },
      });
    } else if (isFeedback() && gameState.changed) {
      countdown.start({
        time: READ_ANSWER_TIME,
        onEnd: () => {
          sendGameEvent(gameMachine.events.NEXT_ROUND);
        },
      });
    }
  }, [gameState.value]);

  const quit = () => {
    if (!isGameOver()) {
      sendGameEvent(gameMachine.events.QUIT);
    }
    props?.navigation?.navigate("Score", {
      points: gameState.context.score,
      results: gameState.context.results,
    });
  };

  const isPlaying = () => isAnswering() || isFeedback();
  const isAnswering = () => gameState.matches("answering");
  const isFeedback = () => gameState.matches("feedback");
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
      let bonus = 0;
      if (countdown.timeSpent < ANSWER_BONUS_TIME_LIMIT) {
        bonus = (ANSWER_BONUS_TIME_LIMIT - countdown.timeSpent) / 100;
      }
      const points = Math.round(100 + bonus);

      sendGameEvent(gameMachine.events.CORRECT_ANSWER, { points });
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
    <BackgroundScreen testID="gameScreen">
      <View style={{ flex: 1, width: "100%" }}>
        <OverlayTimer timeLeft={isPlaying() ? timeLeft : ANSWER_TIME} totalTime={ANSWER_TIME} />
        <View style={styles.gameStatusContainer}>
          <Text accessibilityHint="score" style={styles.score}>
            {gameState.context.score}
          </Text>
          <TouchableWithoutFeedback testID="endGameBtn" onPress={quit} accessibilityLabel="End Game">
            <MaterialCommunityIcons style={{ marginLeft: 8 }} name="close" size={20} color={colors.secondary} />
          </TouchableWithoutFeedback>
        </View>
        <View style={{ flex: 1, paddingHorizontal: 30 }}>
          <Question question={currentQuestion} />
        </View>
      </View>

      <View style={{ flex: 1, paddingHorizontal: 30, width: "100%" }}>
        {currentQuestion?.choices.map((answer: AnswerType) => (
          <Answer
            key={answer.answer}
            answer={answer}
            selected={isSelectedAnswer(answer)}
            isCorrect={isAnswerCorrect(answer)}
            isIncorrect={isAnswerIncorrect(answer)}
            feedback={isFeedback()}
            onSelect={() => onAnswer(answer)}
          />
        ))}
        <View style={{ height: 20, marginTop: 10, marginBottom: 50 }}>
          <Rounds
            currentRound={gameState.context.currentRound}
            rounds={gameState.context.rounds}
            results={gameState.context.results}
          />
        </View>
      </View>
    </BackgroundScreen>
  );
};

const styles = StyleSheet.create({
  gameContainer: StyleSheet.flatten([globalStyles.container, { padding: 0 }]),
  score: {
    color: colors.primary,
    ...fontSize.l,
  },
  gameStatusContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 50,
    height: 30,
    paddingHorizontal: 30,
  },
});

export default Game;
