import { interpret } from "xstate";
import gameMachine from "./gameMachine";

describe("gameMachine", () => {
  it(`reaches gameOver using all feedback states`, () => {
    const validMachine = gameMachine.machine.withContext({ rounds: 4, currentRound: 0, score: 0 });
    const service = interpret(validMachine);

    // initial state
    service.start();
    expect(service.state.value).toBe("idling");

    // reaches `answering` via `START`
    service.send(gameMachine.events.START);
    expect(service.state.value).toBe("answering");
    expect(service.state.context).toMatchObject({ rounds: 4, currentRound: 1, score: 0 });

    // reaches `feedback.correct` via `CORRECT_ANSWER
    service.send(gameMachine.events.CORRECT_ANSWER, { points: 100 });
    expect(service.state.value).toMatchObject({ feedback: "correct" });
    expect(service.state.context).toMatchObject({ rounds: 4, currentRound: 1, score: 100 });

    // reaches `answering` via `NEXT_ROUND`
    service.send(gameMachine.events.NEXT_ROUND);
    expect(service.state.value).toBe("answering");
    expect(service.state.context).toMatchObject({ rounds: 4, currentRound: 2, score: 100 });

    // reaches `feedback.correct` via `INCORRECT_ANSWER
    service.send(gameMachine.events.INCORRECT_ANSWER);
    expect(service.state.value).toMatchObject({ feedback: "incorrect" });
    expect(service.state.context).toMatchObject({ rounds: 4, currentRound: 2, score: 100 });

    // reaches `answering` via `NEXT_ROUND`
    service.send(gameMachine.events.NEXT_ROUND);
    expect(service.state.value).toBe("answering");
    expect(service.state.context).toMatchObject({ rounds: 4, currentRound: 3, score: 100 });

    // reaches `feedback.correct` via `ANSWER_TIME` delay
    service.send(gameMachine.events.NO_ANSWER);
    expect(service.state.value).toMatchObject({ feedback: "noAnswer" });
    expect(service.state.context).toMatchObject({ rounds: 4, currentRound: 3, score: 100 });

    // reaches `answering` via `NEXT_ROUND`
    service.send(gameMachine.events.NEXT_ROUND);
    expect(service.state.value).toBe("answering");
    expect(service.state.context).toMatchObject({ rounds: 4, currentRound: 4, score: 100 });

    // reaches `feedback.correct` via `CORRECT_ANSWER
    service.send(gameMachine.events.CORRECT_ANSWER, { points: 113 });
    expect(service.state.value).toMatchObject({ feedback: "correct" });
    expect(service.state.context).toMatchObject({ rounds: 4, currentRound: 4, score: 213 });

    // reaches `gameOver` via `NEXT_ROUND`
    service.send(gameMachine.events.NEXT_ROUND);
    expect(service.state.value).toBe("gameOver");
    expect(service.state.context).toMatchObject({ rounds: 4, currentRound: 4, score: 213 });
  });

  it("does not start invalid game", () => {
    const zeroRoundMachine = gameMachine.machine.withContext({ rounds: 0, currentRound: 0 });
    const service = interpret(zeroRoundMachine);

    // initial state
    service.start();
    service.send(gameMachine.events.START);
    expect(service.state.value).toBe("idling");
  });
});
