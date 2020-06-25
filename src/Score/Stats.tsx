import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { colors, fontSize } from "../styles/globals";

type StatElementProps = {
  value: number;
  name: string;
};

const StatElement: React.FC<StatElementProps> = (props) => {
  const { value, name } = props;
  return (
    <View style={statElementStyles.container}>
      <Text testID={name} style={statElementStyles.valueText}>
        {value}
      </Text>
      <Text style={statElementStyles.nameText}>{name}</Text>
    </View>
  );
};

const statElementStyles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
  valueText: {
    color: colors.normal,
    ...fontSize.xl,
  },
  nameText: {
    color: colors.secondary,
    textTransform: "uppercase",
    marginTop: 5,
    ...fontSize.s,
  },
});

type Props = {
  correct: number;
  incorrect: number;
  unanswered: number;
};

const Stats: React.FC<Props> = (props) => {
  const { correct, incorrect, unanswered } = props;

  return (
    <View style={statsStyles.statsContainer}>
      <StatElement value={correct} name="correct" />
      <StatElement value={incorrect} name="incorrect" />
      <StatElement value={unanswered} name="unanswered" />
    </View>
  );
};

const statsStyles = StyleSheet.create({
  statsContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 20,
  },
});

export default Stats;
