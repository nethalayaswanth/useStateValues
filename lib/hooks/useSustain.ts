import { useRef } from "react";

export function useSustain<T>(value: any) {
  const ref = useRef<T | null>(null);

  ref.current = value;

  return ref;
}
