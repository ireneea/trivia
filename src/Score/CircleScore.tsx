import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { colors, fontSize } from "../styles/globals";

type Props = {
  value: number;
  radius: number;
  valueSize?: number;
  labelSize?: number;
  label: string;
  borderColor?: string;
  backgroundColor?: string;
  textColor?: string;
  testID?: string;
};

const CircleScore: React.FC<Props> = (props) => {
  const {
    value,
    label,
    radius,
    valueSize = 20,
    labelSize = 20,
    borderColor = colors.background,
    backgroundColor = colors.primary,
    textColor = colors.background,
    testID,
  } = props;
  return (
    <View style={{ ...styles.container, width: radius * 2, height: radius * 2, backgroundColor, borderColor }}>
      <Text style={{ fontSize: valueSize, color: textColor, fontWeight: "500" }} testID={testID}>
        {value}
      </Text>
      <Text style={{ ...styles.label, fontSize: labelSize, color: textColor }}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 1000,
    borderWidth: 5,
    borderStyle: "solid",
    justifyContent: "center",
    alignItems: "center",
  },
  label: {
    textTransform: "uppercase",
  },
});

export default CircleScore;
