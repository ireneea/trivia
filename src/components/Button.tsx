import React from "react";
import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet, Text, View, TouchableWithoutFeedback, GestureResponderEvent } from "react-native";
import { colors, fontSize } from "../styles/globals";

type Props = {
  label: string;
  onPress: (event: GestureResponderEvent) => void;
  testID?: string;
};

const Button: React.FC<Props> = (props) => {
  const { label, onPress, testID } = props;
  return (
    <TouchableWithoutFeedback testID={testID} onPress={onPress}>
      <LinearGradient colors={[colors.secondary, colorLuminance(colors.secondary, -0.3)]} style={styles.button}>
        <Text style={styles.buttonText}>{label}</Text>
      </LinearGradient>
    </TouchableWithoutFeedback>
  );
};

function colorLuminance(hex: string, lum: number) {
  // validate hex string
  hex = String(hex).replace(/[^0-9a-f]/gi, "");

  // convert to decimal and change luminosity
  let rgb = "#";
  let c;

  for (let i = 0; i < 3; i++) {
    c = parseInt(hex.substr(i * 2, 2), 16);
    c = Math.round(Math.min(Math.max(0, c + c * lum), 255)).toString(16);
    rgb += ("00" + c).substr(c.length);
  }

  return rgb;
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: 15,
    paddingHorizontal: 50,
    borderRadius: 20,
    marginVertical: 5,
    width: "100%",
    alignItems: "center",
  },
  buttonText: {
    color: colors.normal,
    textTransform: "uppercase",
    ...fontSize.l,
  },
});

export default Button;
