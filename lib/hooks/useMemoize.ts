import { useRef } from "react";
import { shallowCompare, Valid } from "../utils";

export default function useMemoize<T>(
  prev: Valid<T>,
  current: Valid<T>,
): React.MutableRefObject<T> {
  const memoizedRef = useRef<T>(prev);
  if (!shallowCompare(prev, current)) {
    memoizedRef.current = current;
  }
  return memoizedRef;
}
