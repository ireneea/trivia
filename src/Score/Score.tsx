import React from "react";
import { View, Text, TouchableWithoutFeedback, StyleSheet } from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RouteProp } from "@react-navigation/native";

import { globalStyles } from "../styles/globals";
import { RoutesStackParamList, GameResults, AnswerResult } from "../ts/appTypes";

type Props = {
  navigation: StackNavigationProp<RoutesStackParamList, "Score">;
  route: RouteProp<RoutesStackParamList, "Score">;
};

const Score: React.FC<Props> = (props) => {
  const { points, results } = props.route.params;
  return (
    <View testID="scoreScreen" style={globalStyles.centredContainer}>
      <Text testID="points">Points {points}</Text>
      <Text testID="accuracy">Accuracy {getAccuracy(results)} %</Text>
      <View style={{ flexDirection: "row", justifyContent: "space-between", width: "100%", marginVertical: 20 }}>
        <View style={globalStyles.centredContainer}>
          <Text>Correct</Text>
          <Text testID="correct">{getAnswerResultCount(results, AnswerResult.CORRECT)}</Text>
        </View>
        <View style={globalStyles.centredContainer}>
          <Text>Incorrect</Text>
          <Text testID="incorrect">{getAnswerResultCount(results, AnswerResult.INCORRECT)}</Text>
        </View>
        <View style={globalStyles.centredContainer}>
          <Text>Unanswered</Text>
          <Text testID="unanswered">{getAnswerResultCount(results, AnswerResult.NO_ANSWER)}</Text>
        </View>
      </View>

      <TouchableWithoutFeedback testID="newGameBtn" onPress={() => props.navigation.navigate("Game")}>
        <Text>New Game</Text>
      </TouchableWithoutFeedback>
      <TouchableWithoutFeedback testID="homeBtn" onPress={() => props.navigation.navigate("Start")}>
        <Text>Home</Text>
      </TouchableWithoutFeedback>
    </View>
  );
};

const getAccuracy = (results: GameResults = {}): number => {
  let accuracy = 0;

  const rounds = Object.keys(results);

  if (rounds.length > 0) {
    const correctAnswers = getAnswerResultCount(results, AnswerResult.CORRECT);

    accuracy = Math.round((correctAnswers * 100) / rounds.length);
  }

  return accuracy;
};

const getAnswerResultCount = (results: GameResults = {}, answerType: AnswerResult) => {
  let count = 0;
  const rounds = Object.keys(results);

  if (rounds.length > 0) {
    count = rounds.reduce((acc, round) => {
      const result = results[round];
      return result === answerType ? acc + 1 : acc;
    }, 0);
  }

  return count;
};

export default Score;
