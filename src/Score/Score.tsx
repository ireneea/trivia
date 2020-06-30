import React from "react";
import { View, StyleSheet } from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RouteProp } from "@react-navigation/native";
import _max from "lodash/max";

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

import { getCountryQuizGame } from "../generateQuiz/countryQuiz";
import { filterCountries } from "../generateQuiz/filterCountries";
import allCountries from "../../data/countries.json";

const Score: React.FC<Props> = (props) => {
  const { points, results } = props.route.params;

  const startNewGame = () => {
    const validCountries = filterCountries(allCountries, { withCapital: true });
    const game = getCountryQuizGame(validCountries);

    props.navigation.navigate("Game", { game });
  };

  return (
    <BackgroundScreen testID="scoreScreen">
      <View style={{ flex: 3, width: "100%" }}>
        <Points points={points} bonus={getBonusPoints(points, results)} streak={getStreak(results)} />
      </View>
      <View style={{ flex: 1, width: "100%", justifyContent: "flex-end" }}>
        <Stats
          correct={getAnswerResultCount(results, AnswerResult.CORRECT)}
          incorrect={getAnswerResultCount(results, AnswerResult.INCORRECT)}
          unanswered={getAnswerResultCount(results, AnswerResult.NO_ANSWER)}
        />
      </View>
      <View style={styles.btnContainers}>
        <Button testID="newGameBtn" onPress={startNewGame} label="New Game" />
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

const getStreak = (results: GameResults = {}): number => {
  let streak = 0;
  const rounds = Object.keys(results);

  if (rounds.length > 0) {
    const { max } = rounds.reduce(
      (acc, round) => {
        const result = results[round];
        const newAcc = { ...acc };
        if (result === AnswerResult.CORRECT) {
          newAcc.current = newAcc.current + 1;
          newAcc.max = _max([newAcc.current, newAcc.max]) || 0;
        } else {
          newAcc.current = 0;
        }
        return newAcc;
      },
      { current: 0, max: 0 }
    );
    streak = max;
  }

  return streak;
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
