import React from "react";
import { View, StyleSheet } from "react-native";

import { globalStyles, colors } from "../styles/globals";

type Props = {
  testID?: string;
  style?: any;
};

const BackgroundScreen: React.FC<Props> = (props) => {
  const { testID, children } = props;
  return (
    <View testID={testID} style={StyleSheet.flatten([styles.blueContainer, props.style || {}])}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  blueContainer: {
    ...globalStyles.centredContainer,
    backgroundColor: colors.background,
  },
});

export default BackgroundScreen;
