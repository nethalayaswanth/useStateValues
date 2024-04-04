import {  useRef } from "react";
import useIsomorphicLayoutEffect from "./useIsomorphicLayoutEffect";
export function usePrev<T>(value: T): React.MutableRefObject<T> {
  const prevRef = useRef<T>(value);
  useIsomorphicLayoutEffect(() => {
    prevRef.current = value;
  });
  return prevRef;
}
