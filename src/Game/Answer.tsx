import React from "react";
import { View, Text } from "react-native";

const Answer = ({ answer }) => {
  return (
    <View>
      <Text>{answer?.answer}</Text>
    </View>
  );
};

export default Answer;
