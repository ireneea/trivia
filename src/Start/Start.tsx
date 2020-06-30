import React from "react";
import { View, StyleSheet, Image } from "react-native";
import Svg, { Defs, RadialGradient, Stop, Ellipse } from "react-native-svg";

import Button from "../components/Button";
import BackgroundScreen from "../components/BackgroundScreen";

import { getCountryQuizGame } from "../generateQuiz/countryQuiz";
import { filterCountries } from "../generateQuiz/filterCountries";
import allCountries from "../../data/countries.json";
import { globalStyles, colors } from "../styles/globals";

type Props = {
  navigation: any;
};

const Start: React.FC<Props> = (props) => {
  const onStart = () => {
    const { navigation } = props;
    const validCountries = filterCountries(allCountries, { withCapital: true, independent: true });
    const game = getCountryQuizGame(validCountries);

    navigation.navigate("Game", { game });
  };

  return (
    <BackgroundScreen testID="startScreen">
      <View style={styles.imageContainer}>
        <Image source={require("../../assets/img/trivia_icon.png")} style={{ width: 300, height: 300 }} />
        <Svg height="80" width="400">
          <Defs>
            <RadialGradient id="grad" cx="200" cy="40" rx="100" ry="10" fx="200" fy="40" gradientUnits="userSpaceOnUse">
              <Stop offset="0" stopColor="#000" stopOpacity="0.2" />
              <Stop offset="1" stopColor={colors.background} stopOpacity="0.2" />
            </RadialGradient>
          </Defs>
          <Ellipse cx="200" cy="40" rx="100" ry="10" fill="url(#grad)" />
        </Svg>
      </View>
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
    flex: 1,
  },
  imageContainer: {
    ...globalStyles.centredContainer,
    flex: 2,
  },
  iconShadow: {
    width: "25%",
    height: 40,
    backgroundColor: "black",
  },
});

export default Start;
