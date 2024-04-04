import { describe, expect, beforeEach, it, jest } from "@jest/globals";
import { act } from "@testing-library/react";
import StateValue from "../stateValue";

describe("useMotionValue", () => {
  let stateValue: StateValue<number>;

  beforeEach(() => {
    stateValue = new StateValue();
  });

  it("should initialize with the correct value", () => {
    expect(stateValue.get()).toBeUndefined();
  });

  it("should set the current value correctly", () => {
    act(() => {
      stateValue.set(10);
    });
    expect(stateValue.get()).toBe(10);
  });

  it("should update the previous value correctly when setting a new current value", () => {
    act(() => {
      stateValue.set(10);
      stateValue.set(20);
    });
    expect(stateValue.getPrevious()).toBe(10);
  });

  it("should notify subscribers when the current value changes", () => {
    const mockSubscriber = jest.fn();
    stateValue.subscribe(mockSubscriber);

    act(() => {
      stateValue.set(10);
    });

    expect(mockSubscriber).toHaveBeenCalledWith(10);
  });

  it("should not notify unsubscribed subscribers when the current value changes", () => {
    const mockSubscriber = jest.fn();
    const unsubscribe = stateValue.subscribe(mockSubscriber);
    unsubscribe();

    act(() => {
      stateValue.set(10);
    });

    expect(mockSubscriber).toBeCalledTimes(1);
  });

  it("should handle function as current value based on previous value correctly", () => {
    act(() => {
      stateValue.set(5);
      stateValue.set((prev) => prev * 2);
    });
    expect(stateValue.get()).toBe(10);
  });

  it("should not call the updater if call is set to false when subscribing", () => {
    const mockSubscriber = jest.fn();
    stateValue.subscribe(mockSubscriber, false);

    act(() => {
      stateValue.set(10);
    });

    expect(mockSubscriber).toBeCalledTimes(1);
  });
  it("should handle multiple subscribers correctly", () => {
    const mockSubscriber1 = jest.fn();
    const mockSubscriber2 = jest.fn();
    stateValue.subscribe(mockSubscriber1);
    stateValue.subscribe(mockSubscriber2);

    act(() => {
      stateValue.set(10);
    });

    expect(mockSubscriber1).toHaveBeenCalledWith(10);
    expect(mockSubscriber2).toHaveBeenCalledWith(10);
  });

  it("should handle unsubscribing one of multiple subscribers correctly", () => {
    const mockSubscriber1 = jest.fn();
    const mockSubscriber2 = jest.fn();
    stateValue.subscribe(mockSubscriber1);
    const unsubscribe = stateValue.subscribe(mockSubscriber2);
    unsubscribe();

    act(() => {
      stateValue.set(10);
    });

    expect(mockSubscriber1).toHaveBeenCalledWith(10);
    expect(mockSubscriber2).toBeCalledTimes(1);
  });
});
