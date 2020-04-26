import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { AnswerType } from "../ts/appTypes";

type Props = {
  answer: AnswerType;
};

const Answer: React.FC<Props> = ({ answer }) => {
  return (
    <View style={styles.answerContainer}>
      <Text style={styles.answerText}>{answer.answer}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  answerContainer: {
    backgroundColor: "deepskyblue",
    marginVertical: 10,
    padding: 10,
    borderRadius: 5,
  },
  answerText: {
    color: "snow",
  },
});

export default Answer;
