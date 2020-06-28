import React from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";

import { globalStyles, colors, fontSize } from "../styles/globals";

import PercentageCircle from "./PercentageCircle";
import CircleScore from "./CircleScore";

type Props = {
  points: number;
  bonus: number;
  streak: number;
};

const Points: React.FC<Props> = (props) => {
  const { points, bonus, streak } = props;

  const xCentre = Math.round(Dimensions.get("window").width) / 2;

  return (
    <View style={styles.container}>
      <View style={{ position: "absolute", left: xCentre - 30, top: 310 }}>
        <CircleScore
          value={streak}
          label="Highest streak"
          radius={80}
          valueSize={49}
          labelSize={13}
          borderColor={colors.primary}
          backgroundColor={colors.background}
          textColor={colors.primary}
          testID="streak"
        />
      </View>
      <View style={{ position: "absolute", left: xCentre - 80, top: 100 }}>
        <CircleScore value={points} label="Total Score" radius={120} valueSize={76} labelSize={20} testID="points" />
      </View>
      <View style={{ position: "absolute", left: xCentre - 150, top: 260 }}>
        <CircleScore value={bonus} label="Bonus Points" radius={75} valueSize={49} labelSize={13} testID="bonus" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...globalStyles.centredContainer,
    // flex: 1,
  },
  pointsText: {
    marginTop: 20,
    color: colors.primary,
    ...fontSize.xxxxl,
  },
  accuracyContainer: {
    marginTop: 20,
  },
  accuracyText: {
    color: colors.normal,
    ...fontSize.xl,
  },
});

export default Points;
