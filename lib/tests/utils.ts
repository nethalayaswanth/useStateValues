export function removeProperty<T extends object,k extends keyof T>(
  obj: T,
  prop:k,
): Omit<T, k> {
  const { [prop]: _, ...rest } = obj;
  return rest;
}
