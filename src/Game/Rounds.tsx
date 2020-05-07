import React from "react";
import { View, Text, Image } from "react-native";
import { FontAwesome } from "@expo/vector-icons";

type Prop = {
  rounds: number;
  currentRound: number;
};

const Rounds: React.FC<Prop> = (props) => {
  const { rounds, currentRound } = props;
  const indicators = [];
  for (let i = 1; i <= rounds; i++) {
    indicators.push({ active: i <= currentRound, key: i });
  }

  return (
    <View style={{ flex: 1, flexDirection: "row", justifyContent: "space-between", height: 15 }}>
      {indicators.map(({ active, key }) => (
        <FontAwesome
          testID={active ? "playedRound" : "remainingRound"}
          name={active ? "circle" : "circle-o"}
          size={12}
          color="rgba(0, 0, 0, 0.1)"
          key={key}
        />
      ))}
    </View>
  );
};

export default Rounds;
