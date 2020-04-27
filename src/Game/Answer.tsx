import React from "react";
import { View, Text, StyleSheet } from "react-native";

import { AnswerType } from "../ts/appTypes";
import { fontSize } from "../styles/globals";

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
    backgroundColor: "whitesmoke",
    marginVertical: 10,
    paddingVertical: 15,
    paddingHorizontal: 15,
    borderRadius: 2,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,

    elevation: 3,
  },
  answerText: StyleSheet.flatten([fontSize.m]),
});

export default Answer;
