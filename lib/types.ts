import StateValue from "./stateValue";

export type ExtractStateValue<T> =
  T extends StateValue<infer U> ? T : StateValue<T>;

export type StateValues<T extends object> = {
  [K in keyof T]: ExtractStateValue<T[K]>;
};

export type StateValueState<T extends object> = {
  [K in keyof T]: T[K] extends StateValue<infer U> ? U : T[K];
};

export type StateValueProxyHandler<T extends object> = {
  get(
    target: StateValueState<T>,
    prop: keyof T | string | symbol,
  ): StateValue<T[keyof T]> | T[keyof T] | undefined;
};
