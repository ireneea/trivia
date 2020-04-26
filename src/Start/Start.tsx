import React from "react";
import { View, Text, TouchableWithoutFeedback } from "react-native";
import { globalStyles } from "../styles/globals";

type Props = {
  navigation: any;
};

const Start: React.FC<Props> = (props) => {
  const onStart = () => {
    const { navigation } = props;
    navigation.navigate("Game");
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
