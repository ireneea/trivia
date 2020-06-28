import React from "react";
import { View, StyleSheet } from "react-native";
import _isNumber from "lodash/isNumber";
import { colors } from "../styles/globals";

type Props = {
  timeLeft?: number;
  totalTime?: number;
};

const OverlayTimer: React.FC<Props> = (props) => {
  const width = { width: `${getTimeSpentPercentage(props)}%` };

  return <View style={StyleSheet.flatten([styles.overlay, width])} testID="overlay"></View>;
};

const getTimeSpentPercentage = (props: Props) => {
  let percent = 0;
  const { timeLeft, totalTime } = props;
  if (_isNumber(timeLeft) && _isNumber(totalTime) && totalTime > 0 && timeLeft >= 0) {
    if (timeLeft > totalTime) {
      percent = 0;
    } else {
      percent = Math.round(100 - (timeLeft * 100) / totalTime);
    }
  }

  return percent;
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    position: "absolute",
    left: 0,
    top: 0,
    backgroundColor: colors.overlay,
    width: "0%",
    height: "100%",
  },
});

export default OverlayTimer;
