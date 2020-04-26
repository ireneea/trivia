import React, { useState, useEffect } from "react";
import { View, Text, TouchableWithoutFeedback } from "react-native";
import { globalStyles } from "../styles/globals";
import { QuestionType, RoutesStackParamList } from "../ts/appTypes";
import { StackNavigationProp } from "@react-navigation/stack";
import { RouteProp } from "@react-navigation/native";

import Answer from "./Answer";
import Question from "./Question";

type Props = {
  navigation: StackNavigationProp<RoutesStackParamList, "Game">;
  route: RouteProp<RoutesStackParamList, "Game">;
};

const Game: React.FC<Props> = (props) => {
  const game = props?.route?.params?.game;

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
    <View testID="gameScreen" style={globalStyles.centredContainer}>
      <TouchableWithoutFeedback testID="endGameBtn" onPress={onEndGame}>
        <Text>End Game</Text>
      </TouchableWithoutFeedback>
      <Question question={currentQuestion} />
      {currentQuestion?.choices.map((answer) => (
        <Answer key={answer.answer} answer={answer} />
      ))}
    </View>
  );
};

export default Game;
