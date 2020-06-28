import React from "react";
import { View, StyleSheet } from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RouteProp } from "@react-navigation/native";

import Button from "../components/Button";
import BackgroundScreen from "../components/BackgroundScreen";
import Points from "./Points";
import Stats from "./Stats";

import { globalStyles } from "../styles/globals";
import { RoutesStackParamList, GameResults, AnswerResult } from "../ts/appTypes";

type Props = {
  navigation: StackNavigationProp<RoutesStackParamList, "Score">;
  route: RouteProp<RoutesStackParamList, "Score">;
};

const Score: React.FC<Props> = (props) => {
  const { points, results } = props.route.params;
  return (
    <BackgroundScreen testID="scoreScreen">
      <View style={{ flex: 2, width: "100%" }}>
        <Points points={points} bonus={getBonusPoints(points, results)} />
      </View>
      <View style={{ flex: 1, width: "100%", justifyContent: "flex-end" }}>
        <Stats
          correct={getAnswerResultCount(results, AnswerResult.CORRECT)}
          incorrect={getAnswerResultCount(results, AnswerResult.INCORRECT)}
          unanswered={getAnswerResultCount(results, AnswerResult.NO_ANSWER)}
        />
      </View>
      <View style={styles.btnContainers}>
        <Button testID="newGameBtn" onPress={() => props.navigation.navigate("Game")} label="New Game" />
        <Button testID="newGameBtn" onPress={() => props.navigation.navigate("Start")} label="Home" />
      </View>
    </BackgroundScreen>
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

const getBonusPoints = (points: number, results: GameResults = {}): number => {
  const correctCount = getAnswerResultCount(results, AnswerResult.CORRECT);
  const bonus = points - correctCount * 100; // TODO: use correct points constant

  return bonus;
};

const styles = StyleSheet.create({
  btnContainers: {
    ...globalStyles.centredContainer,
    width: "100%",
    paddingHorizontal: 20,
    justifyContent: "flex-start",
  },
});

export default Score;
