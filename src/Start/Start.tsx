import React from "react";
import { View, StyleSheet } from "react-native";

import Button from "../components/Button";
import BackgroundScreen from "../components/BackgroundScreen";

import { getCountryQuizGame } from "../generateQuiz/countryQuiz";
import { filterCountries } from "../generateQuiz/filterCountries";
import allCountries from "../../data/countries.json";

type Props = {
  navigation: any;
};

const Start: React.FC<Props> = (props) => {
  const onStart = () => {
    const { navigation } = props;
    const validCountries = filterCountries(allCountries, { withCapital: true });
    const game = getCountryQuizGame(validCountries);

    navigation.navigate("Game", { game });
  };

  return (
    <BackgroundScreen testID="startScreen">
      <View style={styles.btnContainer}>
        <Button testID="startBtn" onPress={onStart} label="Start" />
      </View>
    </BackgroundScreen>
  );
};

const styles = StyleSheet.create({
  btnContainer: {
    paddingHorizontal: 20,
    width: "100%",
  },
});

export default Start;
