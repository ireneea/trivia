import { StyleSheet } from "react-native";

export const colors = {
  background: "#56AFEA", // blue
  normal: "#ffffff", // white
  primary: "#FFC312", // yellow sunflower
  secondary: "#635D72", // grey
};

export const globalStyles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  centredContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export const fontSize = StyleSheet.create({
  xs: { fontSize: 10 },
  s: { fontSize: 13 },
  m: { fontSize: 16 },
  l: { fontSize: 20 },
  xl: { fontSize: 25 },
  xxl: { fontSize: 31 },
  xxxl: { fontSize: 39 },
  xxxxl: { fontSize: 49 },
});
