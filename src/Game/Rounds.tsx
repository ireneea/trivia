import React from "react";
import { View } from "react-native";
import { FontAwesome } from "@expo/vector-icons";

import { AnswerResult, GameResults } from "../ts/appTypes";

type Prop = {
  rounds: number;
  currentRound: number;
  results: GameResults;
};

enum RoundType {
  CURRENT = "CURRENT",
  SUCCESS = "SUCCESS",
  FAIL = "FAIL",
  INACTIVE = "INACTIVE",
}

const Rounds: React.FC<Prop> = (props) => {
  const { rounds, currentRound, results } = props;
  const indicators = [];
  for (let i = 1; i <= rounds; i++) {
    const result = results[`${i}`];
    let type: RoundType = RoundType.INACTIVE;

    if (i > currentRound) {
      type = RoundType.INACTIVE;
    } else if (result === AnswerResult.CORRECT) {
      type = RoundType.SUCCESS;
    } else if (result === AnswerResult.INCORRECT || result === AnswerResult.NO_ANSWER) {
      type = RoundType.FAIL;
    } else {
      type = RoundType.CURRENT;
    }

    let indicatorsProps = {
      active: i <= currentRound,
      key: i,
      type,
    };

    indicators.push(indicatorsProps);
  }

  return (
    <View style={{ flex: 1, flexDirection: "row", justifyContent: "space-between", height: 15 }}>
      {indicators.map(({ active, key, type }) => {
        let res = null;

        if (type === RoundType.INACTIVE) {
          res = <Inactive key={key} />;
        } else if (type === RoundType.SUCCESS) {
          res = <Success key={key} />;
        } else if (type === RoundType.FAIL) {
          res = <Fail key={key} />;
        } else {
          res = <Current key={key} />;
        }

        return res;
      })}
    </View>
  );
};

const Current = () => <FontAwesome testID="current" name="circle" size={12} color="rgba(0, 0, 0, 0.1)" />;
const Inactive = () => <FontAwesome testID="inactive" name="circle-o" size={12} color="rgba(0, 0, 0, 0.1)" />;
const Success = () => <FontAwesome testID="success" name="circle" size={12} color="green" />;
const Fail = () => <FontAwesome testID="fail" name="times" size={12} color="red" />;

export default Rounds;
