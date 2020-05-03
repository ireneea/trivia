import React from "react";
import { View, Text, StyleSheet, TouchableWithoutFeedback, StyleProp } from "react-native";

import { AnswerType } from "../ts/appTypes";
import { fontSize } from "../styles/globals";

type Props = {
  answer: AnswerType;
  onSelect(): void;
  isCorrect?: boolean;
  isIncorrect?: boolean;
};

const Answer: React.FC<Props> = (props) => {
  const { answer, onSelect } = props;

  const appliedStyle = getContainerStyle(props);

  return (
    <TouchableWithoutFeedback onPress={onSelect}>
      <View style={appliedStyle.container} testID={`answer-${answer.answer}`}>
        <Text style={appliedStyle.text} accessibilityLabel={answer.answer}>
          {answer.answer}
        </Text>
      </View>
    </TouchableWithoutFeedback>
  );
};

const getContainerStyle = (props: Props): any => {
  const { isCorrect = false, isIncorrect = false } = props;

  let container: StyleProp<{}> | [StyleProp<{}>];
  let text: StyleProp<{}> | [StyleProp<{}>];

  if (isCorrect) {
    container = correctAnswerContainer;
    text = correctAnswerText;
  } else if (isIncorrect) {
    container = incorrectAnswerContainer;
    text = incorrectAnswerText;
  } else {
    container = styles.answerContainer;
    text = styles.answerText;
  }

  return { container, text };
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
  answerText: fontSize.m,
  correctAnswerContainer: {
    backgroundColor: "#02c39a",
  },
  incorrectAnswerContainer: {
    backgroundColor: "#e63946",
  },
  correctAnswerText: {
    color: "snow",
  },
  incorrectAnswerText: {
    color: "snow",
  },
});

export const correctAnswerContainer = StyleSheet.compose(styles.answerContainer, styles.correctAnswerContainer);

export const incorrectAnswerContainer = StyleSheet.compose(styles.answerContainer, styles.incorrectAnswerContainer);

const correctAnswerText = StyleSheet.flatten([styles.answerText, styles.correctAnswerText]);

const incorrectAnswerText = StyleSheet.flatten([styles.answerText, styles.incorrectAnswerText]);

export default Answer;
