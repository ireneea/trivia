import React, { useState, useEffect } from "react";
import { View, Text, TouchableWithoutFeedback, StyleSheet } from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RouteProp } from "@react-navigation/native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import { globalStyles } from "../styles/globals";
import { QuestionType, RoutesStackParamList } from "../ts/appTypes";

import Answer from "./Answer";
import Question from "./Question";

type Props = {
  navigation: StackNavigationProp<RoutesStackParamList, "Game">;
  route: RouteProp<RoutesStackParamList, "Game">;
};

const fakeGame = {
  questions: [
    {
      text: "Kampala is the capital of",
      correctAnswer: "Uganda",
      choices: [
        { answer: "Kenya" },
        { answer: "Bhutan" },
        { answer: "Uganda" },
        { answer: "Rwanda" },
      ],
    },
  ],
};

const Game: React.FC<Props> = (props) => {
  const game = props?.route?.params?.game;
  // const game = fakeGame;

  const [currentQuestion, setCurrentQuestion] = useState(():
    | QuestionType
    | undefined => {
    return undefined;
  });

  useEffect(() => {
    let firstQuestion;
    if (game && Array.isArray(game.questions)) {
      firstQuestion = game.questions[0];
    }

    setCurrentQuestion(firstQuestion);
  }, [game]);

  const onEndGame = () => {
    const { navigation } = props;
    navigation.navigate("Score");
  };

  return (
    <View testID="gameScreen" style={styles.gameContainer}>
      <View style={{ marginTop: 20, height: 30 }}>
        <TouchableWithoutFeedback
          testID="endGameBtn"
          onPress={onEndGame}
          accessibilityLabel="End Game"
        >
          <MaterialCommunityIcons
            style={{ marginLeft: 8 }}
            name="close"
            size={29}
            color="grey"
          />
        </TouchableWithoutFeedback>
      </View>
      {currentQuestion ? (
        <>
          <View style={{ flex: 3 }}>
            <Question question={currentQuestion} />
          </View>
          <View style={{ flex: 2 }}>
            {currentQuestion?.choices.map((answer) => (
              <Answer key={answer.answer} answer={answer} />
            ))}
          </View>
        </>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  gameContainer: StyleSheet.flatten([
    globalStyles.container,
    {
      padding: 30,
    },
  ]),
});

export default Game;
