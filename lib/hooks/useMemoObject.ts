import { useRef } from "react";
import { shallowCompare } from "../utils";
type Cache<T> = {
  commited?: boolean;
  result?: T;
};

export default function useMemoObject<T, K extends object>(
  createValue: (arg: K | undefined) => T,
  dep?: K,
): T {
  const cache = useRef<Cache<T>>({});
  const prevDep = useRef(dep);

  if (cache.current.commited) {
    const useCache = Boolean(
      dep && prevDep.current && shallowCompare(dep, prevDep.current),
    );
    if (!useCache) {
      cache.current.result = createValue(dep);
      prevDep.current = dep;
    }
  } else {
    cache.current.result = createValue(dep);
    cache.current.commited = true;
  }

  return cache.current.result!;
}
