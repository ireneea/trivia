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
import OverlayTimer from "./OverlayTimer";
import Rounds from "./Rounds";
import useCountdown from "./hooks/useCountdown";

export const READ_ANSWER_TIME = 1000;
export const ANSWER_TIME = 5000;

type Props = {
  navigation: StackNavigationProp<RoutesStackParamList, "Game">;
  route: RouteProp<RoutesStackParamList, "Game">;
};

const Game: React.FC<Props> = (props) => {
  const game = props?.route?.params?.game;
  // const game = {
  //   questions: [
  //     {
  //       text: "Kampala is the capital of?",
  //       correctAnswer: "Uganda",
  //       choices: [{ answer: "Kenya" }, { answer: "Bhutan" }, { answer: "Uganda" }, { answer: "Rwanda" }],
  //     },
  //     {
  //       text: "Mogadishu is the capital of?",
  //       correctAnswer: "Somalia",
  //       choices: [{ answer: "Somalia" }, { answer: "Azerbaijan" }, { answer: "Angola" }, { answer: "Djibouti" }],
  //     },
  //     {
  //       text: "Nairobi is the capital of?",
  //       correctAnswer: "Kenya",
  //       choices: [{ answer: "Ethiopia" }, { answer: "Kenya" }, { answer: "Sudan" }, { answer: "Togo" }],
  //     },
  //   ],
  // };

  const [gameState, sendGameEvent] = useMachine(
    gameMachine.machine.withContext({ rounds: game?.questions.length || 0, currentRound: 0 }),
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
    props?.navigation?.navigate("Score");
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
      <View style={{ flex: 3 }}>
        <OverlayTimer timeLeft={isPlaying() ? timeLeft : ANSWER_TIME} totalTime={ANSWER_TIME} />
        <View style={styles.closeBtnContainer}>
          <TouchableWithoutFeedback testID="endGameBtn" onPress={quit} accessibilityLabel="End Game">
            <MaterialCommunityIcons style={{ marginLeft: 8 }} name="close" size={18} color="grey" />
          </TouchableWithoutFeedback>
        </View>
        <View style={{ padding: 30, flex: 1 }}>
          <Question question={currentQuestion} />
        </View>
      </View>

      <View style={{ flex: 2, paddingHorizontal: 30 }}>
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
        <View style={{ height: 20, marginTop: 10 }}>
          <Rounds currentRound={gameState.context.currentRound} rounds={gameState.context.rounds} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  gameContainer: StyleSheet.flatten([globalStyles.container, { padding: 0 }]),
  closeBtnContainer: { marginTop: 50, height: 30 },
});

export default Game;
