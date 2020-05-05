import { interpret } from "xstate";
import gameMachine, { READ_ANSWER_TIME, ANSWER_TIME } from "./gameMachine";

jest.useFakeTimers();

describe("gameMachine", () => {
  it(`reaches gameOver using all feedback states`, () => {
    const validMachine = gameMachine.machine.withContext({ rounds: 3, currentRound: 0 });
    const service = interpret(validMachine);

    // initial state
    service.start();
    expect(service.state.value).toBe("idling");

    // reaches `answering` via `START`
    service.send(gameMachine.events.START);
    expect(service.state.value).toBe("answering");
    expect(service.state.context).toMatchObject({ rounds: 3, currentRound: 1 });

    // reaches `feedback.correct` via `CORRECT_ANSWER
    service.send(gameMachine.events.CORRECT_ANSWER);
    expect(service.state.value).toMatchObject({ feedback: "correct" });
    expect(service.state.context).toMatchObject({ rounds: 3, currentRound: 1 });

    // reaches `answering` via `NEXT_ROUND`
    service.send(gameMachine.events.NEXT_ROUND);
    expect(service.state.value).toBe("answering");
    expect(service.state.context).toMatchObject({ rounds: 3, currentRound: 2 });

    // reaches `feedback.correct` via `INCORRECT_ANSWER
    service.send(gameMachine.events.INCORRECT_ANSWER);
    expect(service.state.value).toMatchObject({ feedback: "incorrect" });
    expect(service.state.context).toMatchObject({ rounds: 3, currentRound: 2 });

    // reaches `answering` via `NEXT_ROUND`
    service.send(gameMachine.events.NEXT_ROUND);
    expect(service.state.value).toBe("answering");
    expect(service.state.context).toMatchObject({ rounds: 3, currentRound: 3 });

    // reaches `feedback.correct` via `ANSWER_TIME` delay
    service.send(gameMachine.events.NO_ANSWER);
    expect(service.state.value).toMatchObject({ feedback: "noAnswer" });
    expect(service.state.context).toMatchObject({ rounds: 3, currentRound: 3 });

    // reaches `gameOver` via `NEXT_ROUND`
    service.send(gameMachine.events.NEXT_ROUND);
    expect(service.state.value).toBe("gameOver");
    expect(service.state.context).toMatchObject({ rounds: 3, currentRound: 3 });
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
