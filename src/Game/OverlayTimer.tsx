import React from "react";
import { View, StyleSheet } from "react-native";
import _isNumber from "lodash/isNumber";

type Props = {
  timeLeft?: number;
  totalTime?: number;
};

const OverlayTimer: React.FC<Props> = (props) => {
  const height = { height: `${getTimeSpentPercentage(props)}%` };

  return <View style={StyleSheet.flatten([styles.overlay, height])} testID="overlay"></View>;
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
    opacity: 0.05,
    backgroundColor: "black",
    width: "100%",
    height: "0%",
  },
});

export default OverlayTimer;
