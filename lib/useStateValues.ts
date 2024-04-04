import { useMemo, useState } from "react";
import StateValue from "./stateValue";
import useMemoObject from "./hooks/useMemoObject";
import { Valid, validate } from "./utils";
import {
  StateValueState,
  StateValues,
  StateValueProxyHandler,
  ExtractStateValue,
} from "./types";

function isStateValue(x: any): x is StateValue<any> {
  return x instanceof StateValue;
}

/**
 * @description Creates a state management object with integrated validation and StateValue instances.
 *
 * This function takes an initial value object and returns an array containing two elements:
 *  - A proxy object that provides access to the state values.
 *  - An internal object holding the actual state values.
 *
 * The proxy object intercepts property access. When a property is accessed:
 *   - If the property exists in the initial value and is a StateValue instance, it's returned directly.
 *   - If the property exists but is not a StateValue, a new StateValue instance is created with the initial value.
 *   - If the property doesn't exist, an error is thrown.
 *
 * This function also performs validation on the initial value using the provided `validate` function.
 *
 * @param {T extends Valid<T>} initialValue - The initial state object. Must be a valid object according to the `Valid` type predicate.
 * @returns {[StateValueState<T>, StateValues<T>]} - An array containing the proxy object and the internal state values object.
 *
 * @typedef {object} StateValues
 * @property {ExtractStateValue<T[K]>} [K in keyof T] - Mapped properties from the initial value, wrapped in StateValue instances if necessary.
 *
 * @typedef {object} StateValueState
 * @property {T[K]} [K in keyof T] - The actual state values, unwrapped from StateValue instances.
 *
 * @typedef {object} StateValueProxyHandler
 * @property {function(target: StateValueState<T>, prop: keyof T | string | symbol): StateValue<T[keyof T]> | T[keyof T] | undefined} get - The handler for property access on the proxy.
 */

export default function useStateValues<T extends Valid<T>>(
  initialValue: T,
): [StateValueState<T>, StateValues<T>] {
  const StateValues = useMemoObject((initialValue) => {
    if (!initialValue) {
      throw new Error(
        `Initial value must be an object. Received: ${initialValue}`,
      );
    }
    const updatedStateValues: StateValues<T> = {} as StateValues<T>;

    const sanitisedInitialValues = validate<T>(initialValue);

    for (const key in sanitisedInitialValues) {
      const k = key as keyof T;
      const v = sanitisedInitialValues[k];

      if (isStateValue(v)) {
        updatedStateValues[k] = v;
      } else {
        updatedStateValues[k] = new StateValue(v) as ExtractStateValue<
          T[keyof T]
        >;
      }
    }
    return updatedStateValues;
  }, initialValue);

  const proxy = useMemo(() => {
    const proxyHandler: StateValueProxyHandler<T> = {
      get(target, prop: keyof T) {
        // eslint-disable-next-line
        if (!initialValue?.hasOwnProperty(prop)) {
          throw new Error(
            `Property '${prop.toString()}' does not exist in initial value.`,
          );
        }

        try {
          // create state when accessed property inside of the body of a function component and return state

          // eslint-disable-next-line
          const [state, setState] = useState(StateValues[prop].get());

          StateValues[prop].subscribe(setState, false);
          return state as typeof state;
        } catch (e) {
          // return corresponding StateValue when accessed elsewhere
          return StateValues[prop];
        }
      },
    };

    return new Proxy(StateValues as StateValueState<T>, proxyHandler);
  }, [StateValues, initialValue]);

  return [proxy, StateValues];
}
