import React from "react";
import { View, Text, TouchableWithoutFeedback } from "react-native";
import { globalStyles } from "../styles/globals";

type Props = {
  navigation: any;
};

const Score: React.FC<Props> = (props) => {
  const navigateTo = (page: string) => {
    const { navigation } = props;
    navigation.navigate(page);
  };

  return (
    <View testID="scoreScreen" style={globalStyles.centredContainer}>
      <TouchableWithoutFeedback
        testID="newGameBtn"
        onPress={() => navigateTo("Game")}
      >
        <Text>New Game</Text>
      </TouchableWithoutFeedback>
      <TouchableWithoutFeedback
        testID="homeBtn"
        onPress={() => navigateTo("Start")}
      >
        <Text>Home</Text>
      </TouchableWithoutFeedback>
    </View>
  );
};

export default Score;
