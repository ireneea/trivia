import { StyleSheet } from "react-native";

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
});
