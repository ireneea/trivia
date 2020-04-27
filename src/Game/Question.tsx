import React from "react";
import { View, Text, StyleSheet, AccessibilityProps } from "react-native";

import { globalStyles, fontSize } from "../styles/globals";
import { QuestionType } from "../ts/appTypes";

type Props = {
  question: QuestionType;
};

const Question: React.FC<Props & AccessibilityProps> = ({ question }) => {
  return (
    <View testID="question" style={styles.questionContainer}>
      <Text style={styles.questionText}>{question?.text}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  questionContainer: StyleSheet.flatten([
    globalStyles.centredContainer,
    { alignItems: "flex-start" },
  ]),
  questionText: StyleSheet.flatten([fontSize.l]),
});

export default Question;
