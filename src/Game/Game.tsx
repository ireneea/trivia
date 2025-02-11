import React from "react";
import { useMachine } from "@xstate/react";

import { View, TouchableWithoutFeedback, StyleSheet, Text } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

import { StackNavigationProp } from "@react-navigation/stack";
import { RouteProp, useFocusEffect } from "@react-navigation/native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import { globalStyles, colors, fontSize } from "../styles/globals";
import { AnswerType, RoutesStackParamList, QuestionType } from "../ts/appTypes";

import gameMachine from "./gameMachine";

import Answer from "./Answer";
import BackgroundScreen from "../components/BackgroundScreen";
import Question from "./Question";
import OverlayTimer from "./OverlayTimer";
import Rounds from "./Rounds";
import useCountdown from "./hooks/useCountdown";

import { CORRECT_ANSWER_POINTS, READ_ANSWER_TIME, ANSWER_TIME, ANSWER_BONUS_TIME_LIMIT } from "./GameParameters";

type Props = {
  navigation: StackNavigationProp<RoutesStackParamList, "Game">;
  route: RouteProp<RoutesStackParamList, "Game">;
};

const Game: React.FC<Props> = (props) => {
  const game = props?.route?.params?.game;
  const { navigation } = props;

  const [gameState, sendGameEvent] = useMachine(gameMachine.machine, gameMachine.options);
  const countdown = useCountdown();
  const [selectedAnswer, setSelectedAnswer] = React.useState((): AnswerType | undefined => undefined);
  const [timeLeft, setTimeLeft] = React.useState(() => ANSWER_TIME);

  React.useEffect(() => {
    let unsubscribe = () => {};

    if (navigation && navigation.addListener) {
      // this code allow to start the game every time there is a navigation to the game screen
      // @see https://reactnavigation.org/docs/navigation-lifecycle
      unsubscribe = navigation.addListener("focus", () => {
        sendGameEvent(gameMachine.events.START, { rounds: game?.questions.length || 0 });
      });
    } else {
      // this is useful for testing when we don't have a proper navigation property
      sendGameEvent(gameMachine.events.START, { rounds: game?.questions.length || 0 });
    }

    // Return the function to unsubscribe from the event so it gets removed on unmount
    return unsubscribe;
  }, [navigation, game]);

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
        bonus = (ANSWER_BONUS_TIME_LIMIT - countdown.timeSpent) / CORRECT_ANSWER_POINTS;
      }
      const points = Math.round(CORRECT_ANSWER_POINTS + bonus);

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
      <View style={styles.questionContainer}>
        <OverlayTimer timeLeft={isPlaying() ? timeLeft : ANSWER_TIME} totalTime={ANSWER_TIME} />
        <View style={styles.gameStatusContainer}>
          <Text accessibilityHint="score" style={styles.score}>
            {gameState.context.score}
          </Text>
          {/* <TouchableWithoutFeedback onPress={() => countdown.pause()}>
            <MaterialCommunityIcons style={{ marginLeft: 8 }} name="pause" size={20} color={colors.secondary} />
          </TouchableWithoutFeedback> */}
          <TouchableWithoutFeedback testID="endGameBtn" onPress={quit} accessibilityLabel="End Game">
            <MaterialCommunityIcons style={{ marginLeft: 8 }} name="close" size={20} color={colors.secondary} />
          </TouchableWithoutFeedback>
        </View>
        <View style={{ flex: 1, paddingHorizontal: 30 }}>
          <Question question={currentQuestion} />
        </View>
      </View>

      <LinearGradient colors={[colors.overlay, "rgba(0,0,0,0)"]} style={styles.separator} />

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
  questionContainer: {
    flex: 1,
    width: "100%",
  },
  separator: {
    width: "100%",
    height: 10,
  },
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
