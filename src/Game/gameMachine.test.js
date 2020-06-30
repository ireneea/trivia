import { interpret } from "xstate";
import gameMachine from "./gameMachine";

describe("gameMachine", () => {
  it(`reaches gameOver using all feedback states`, () => {
    const initialContext = { rounds: 0, currentRound: 0, score: 0, results: {} };
    let expectedContext = { ...initialContext };
    const validMachine = gameMachine.machine.withContext(initialContext);
    const service = interpret(validMachine);

    // initial state
    service.start();
    expect(service.state.value).toBe("answering");

    // cannot answer if context does not have rounds
    service.send(gameMachine.events.CORRECT_ANSWER, { points: 100 });
    expect(service.state.value).toBe("answering");

    service.send(gameMachine.events.INCORRECT_ANSWER);
    expect(service.state.value).toBe("answering");

    service.send(gameMachine.events.START, { rounds: -10 });
    service.send(gameMachine.events.NO_ANSWER);
    expect(service.state.value).toBe("answering");

    // reaches `answering` via `START`
    service.send(gameMachine.events.START, { rounds: 4 });
    expect(service.state.value).toBe("answering");
    expectedContext.rounds = 4;
    expectedContext.currentRound = 1;
    expectContextToMatch(service, expectedContext);

    // reaches `feedback.correct` via `CORRECT_ANSWER
    service.send(gameMachine.events.CORRECT_ANSWER, { points: 100 });
    expect(service.state.value).toMatchObject({ feedback: "correct" });
    expectedContext.score = 100;
    expectedContext.results = { "1": "correct" };
    expectContextToMatch(service, expectedContext);

    // reaches `answering` via `NEXT_ROUND`
    service.send(gameMachine.events.NEXT_ROUND);
    expect(service.state.value).toBe("answering");
    expectedContext.currentRound = 2;
    expectContextToMatch(service, expectedContext);

    // reaches `feedback.correct` via `INCORRECT_ANSWER
    service.send(gameMachine.events.INCORRECT_ANSWER);
    expect(service.state.value).toMatchObject({ feedback: "incorrect" });
    expectedContext.results["2"] = "incorrect";
    expectContextToMatch(service, expectedContext);

    // reaches `answering` via `NEXT_ROUND`
    service.send(gameMachine.events.NEXT_ROUND);
    expect(service.state.value).toBe("answering");
    expectedContext.currentRound = 3;
    expectContextToMatch(service, expectedContext);

    // reaches `feedback.correct` via `ANSWER_TIME` delay
    service.send(gameMachine.events.NO_ANSWER);
    expect(service.state.value).toMatchObject({ feedback: "noAnswer" });
    expectedContext.results["3"] = "noAnswer";
    expectContextToMatch(service, expectedContext);

    // reaches `answering` via `NEXT_ROUND`
    service.send(gameMachine.events.NEXT_ROUND);
    expect(service.state.value).toBe("answering");
    expectedContext.currentRound = 4;
    expectContextToMatch(service, expectedContext);

    // reaches `feedback.correct` via `CORRECT_ANSWER
    service.send(gameMachine.events.CORRECT_ANSWER, { points: 113 });
    expect(service.state.value).toMatchObject({ feedback: "correct" });
    expectedContext.score = 213;
    expectedContext.results["4"] = "correct";
    expectContextToMatch(service, expectedContext);

    // reaches `gameOver` via `NEXT_ROUND`
    service.send(gameMachine.events.NEXT_ROUND);
    expect(service.state.value).toBe("gameOver");
    expectContextToMatch(service, expectedContext);

    // reaches `answering` via `START`
    service.send(gameMachine.events.START, { rounds: 1 });
    expect(service.state.value).toBe("answering");
    expectedContext = { ...initialContext, rounds: 1, currentRound: 1 };
    expectContextToMatch(service, expectedContext);

    // reaches `gameOver` via `QUIT`
    service.send(gameMachine.events.QUIT);
    expect(service.state.value).toBe("gameOver");

    // reaches `gameOver` via `QUIT`
    service.send(gameMachine.events.START, { rounds: 1 });
    service.send(gameMachine.events.NO_ANSWER);
    service.send(gameMachine.events.QUIT);
    expect(service.state.value).toBe("gameOver");
  });
});

const expectContextToMatch = (service, expectedContext) => {
  expect(service.state.context).toMatchObject(expectedContext);
};
