import React from "react";
import { View, Text, TouchableWithoutFeedback } from "react-native";
import { globalStyles } from "../styles/globals";

type Props = {
  navigation: any;
};

const Game: React.FC<Props> = (props) => {
  const onEndGame = () => {
    const { navigation } = props;
    navigation.navigate("Score");
  };

  return (
    <View style={globalStyles.centredContainer}>
      <TouchableWithoutFeedback testID="endGameBtn" onPress={onEndGame}>
        <Text>End Game</Text>
      </TouchableWithoutFeedback>
    </View>
  );
};

export default Game;
