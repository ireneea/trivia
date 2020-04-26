import React from "react";
import { View, Text, StyleSheet, AccessibilityProps } from "react-native";

import { globalStyles } from "../styles/globals";
import { QuestionType } from "../ts/appTypes";

type Props = {
  question: QuestionType;
};

const Question: React.FC<Props & AccessibilityProps> = ({ question }) => {
  return (
    <View testID="question" style={globalStyles.centredContainer}>
      <Text>{question?.text}</Text>
    </View>
  );
};

const styles = StyleSheet.create({});

export default Question;
