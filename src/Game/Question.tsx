import React from "react";
import { View, Text } from "react-native";

const Question = ({ question }) => {
  return (
    <View testID="question">
      <Text>{question?.text}</Text>
    </View>
  );
};

export default Question;
