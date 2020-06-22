import React from "react";
import { View, Text, TouchableWithoutFeedback } from "react-native";

import { globalStyles } from "../styles/globals";
// import { getFullGame } from "../generateQuiz/generateQuiz";
import { getCapitalCountryGame } from "../generateQuiz/countryQuiz";
import { filterCountries } from "../generateQuiz/filterCountries";
import allCountries from "../../data/countries.json";

type Props = {
  navigation: any;
};

const Start: React.FC<Props> = (props) => {
  const onStart = () => {
    const { navigation } = props;
    const validCountries = filterCountries(allCountries, { withCapital: true });
    const game = getCapitalCountryGame(validCountries);
    navigation.navigate("Game", { game });
  };

  return (
    <View testID="startScreen" style={globalStyles.centredContainer}>
      <TouchableWithoutFeedback testID="startBtn" onPress={onStart}>
        <Text>Start</Text>
      </TouchableWithoutFeedback>
    </View>
  );
};

export default Start;
