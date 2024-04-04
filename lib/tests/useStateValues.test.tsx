import {
  render,
  renderHook,
  act,
  waitFor,
  screen,
} from "@testing-library/react";
import { useEffect, useRef } from "react";
import { describe, expect, it, jest, afterEach } from "@jest/globals";
import StateValue from "../stateValue";
import useStateValues from "../useStateValues";
import { removeProperty } from "./utils";

describe("useStateValues", () => {
  it("testing stateValues return by useStateValues as in [state,stateValues]. ", () => {
    const initialValue = { x: 10, y: "hello" };
    const { result } = renderHook(() => useStateValues(initialValue));
    const [_, stateValues] = result.current;
    expect(stateValues).toEqual({
      x: new StateValue(initialValue.x),

      y: new StateValue(initialValue.y),
    });
  });

  it("properties of statevalue in intialValue should be same in stateValues returned", async () => {
    const initialValue = { x: 10, y: new StateValue("hello") };

    const { result } = renderHook(() => useStateValues(initialValue));
    const [_, { y }] = result.current;
    expect(y).toBe(initialValue.y);
  });

  it("render stateValues return by useStateValues", async () => {
    const initialValue = { x: 10, y: "hello" };

    const Test = () => {
      const [state] = useStateValues(initialValue);
      const text = `${state.x}${state.y}`;
      return <div>{text}</div>;
    };
    const { getByText } = render(<Test />);
    await waitFor(() => {
      const el = getByText("10hell");
    });
  });

  afterEach(() => {
    jest.useRealTimers();
  });
  it("should rerender only when the values are updated using stateValue api ", async () => {
    jest.useFakeTimers();
    const initialValue = { x: 0, y: "hello" };
    let renderCount = 0;
    const delay = 1000;
    const Test = () => {
      const [state, values] = useStateValues(initialValue);
      const { x } = state;
      renderCount++;
      const intervalRef = useRef<NodeJS.Timeout>();

      useEffect(() => {
        intervalRef.current = setTimeout(() => {
          values.x.set((x) => x + 1);
        }, delay);

        return () => {
          clearInterval(intervalRef.current);
        };
      }, [values]);
      return <div>{x}</div>;
    };

    const { findByText } = render(<Test />);

    act(() => {
      jest.advanceTimersByTime(delay);
    });
    await waitFor(() => {
      const el = findByText("1");
    });

    expect(renderCount).toBe(2);
  });

  it("generate new state values when initial value is changed ", async () => {
    const initialValue = { x: 0, y: "hello" };
    let renderCount = 0;
    const delay = 1000;
    const Test = ({ initialValue }: { initialValue: any }) => {
      const [state, values] = useStateValues(initialValue);
      const { y } = state;
      renderCount++;
      return <div>{y}</div>;
    };

    const { findByText, rerender } = render(
      <Test initialValue={initialValue} />,
    );

    rerender(<Test initialValue={{ x: 1, y: "bye" }} />);

    await waitFor(() => {
      const el = findByText("bye");
    });

    expect(renderCount).toBe(2);
  });
});
