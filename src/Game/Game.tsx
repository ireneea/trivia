import React, { useState, useEffect } from "react";
import { View, Text, TouchableWithoutFeedback } from "react-native";
import { globalStyles } from "../styles/globals";

import Answer from "./Answer";
import Question from "./Question";

type Props = {
  navigation: any;
  route: any;
};

type Game = {
  questions: Question[];
};

type Question = {
  text: string;
  choices: Answer[];
};

type Answer = {
  answer: string;
};

const Game: React.FC<Props> = (props) => {
  const game: Game = props?.route?.params?.game;

  const [currentQuestion, setCurrentQuestion] = useState(():
    | Question
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
    <View style={globalStyles.centredContainer}>
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
