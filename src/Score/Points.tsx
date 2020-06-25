import React from "react";
import { View, Text, StyleSheet } from "react-native";

import { globalStyles, colors, fontSize } from "../styles/globals";

import PercentageCircle from "./PercentageCircle";

type Props = {
  points: number;
  accuracy: number;
};

const Points: React.FC<Props> = (props) => {
  const { points, accuracy } = props;
  return (
    <View style={styles.container}>
      <PercentageCircle
        radius={90}
        percent={accuracy}
        color={colors.primary}
        bgcolor={colors.background}
        innerColor={colors.background}
      >
        <Text testID="points" style={styles.pointsText}>
          {points}
        </Text>
      </PercentageCircle>
      <View style={styles.accuracyContainer}>
        <Text testID="accuracy" style={styles.accuracyText}>
          {accuracy}%
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...globalStyles.centredContainer,
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
