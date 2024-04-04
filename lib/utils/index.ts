import StateValue from "../stateValue";
export type Primitive = string | number | boolean | null | undefined;

export type Valid<T> = {
  [P in keyof T]: T[P] extends Primitive | StateValue<any> ? T[P] : never;
};
export function validate<T>(obj: T): Valid<T> {
  const validKeys = {} as Valid<T>;
  for (const key in obj) {
    const k = key as keyof T;
    if (
      typeof obj[key] === "string" ||
      typeof obj[key] === "number" ||
      typeof obj[key] === "boolean" ||
      obj[key] === null ||
      obj[key] === undefined ||
      obj[key] instanceof StateValue
    ) {
      validKeys[k] = obj[k] as T[keyof T] extends Primitive | StateValue<any>
        ? T[keyof T]
        : never;
    } else {
      throw new Error(
        `Invalid property type for key '${key}'. Only primitives and MotionValues allowed.`,
      );
    }
  }

  // Return the object with narrowed type based on valid keys
  return validKeys;
}

export function shallowCompare<T>(
  obj1: Valid<T> | null | undefined,
  obj2: Valid<T> | null | undefined,
): boolean {
  // Handle null or undefined cases
  if (
    obj1 === null ||
    obj1 === undefined ||
    obj2 === null ||
    obj2 === undefined
  ) {
    return obj1 === obj2;
  }

  // Check if the number of keys is the same
  if (Object.keys(obj1).length !== Object.keys(obj2).length) {
    return false;
  }

  for (const key in obj1) {
    if (!(key in obj2) || obj1[key] !== obj2[key]) {
      return false;
    }
  }

  // If none of the previous checks failed, the objects are equal
  return true;
}
