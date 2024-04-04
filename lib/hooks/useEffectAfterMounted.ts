import { useRef, DependencyList, EffectCallback } from "react";
import useIsomorphicLayoutEffect from "./useIsomorphicLayoutEffect";
import { useSustain } from "./useSustain";

const useEffectAfterMounted = (fn: EffectCallback, dep: DependencyList) => {
  const isMounted = useRef(false);

  const fnRef = useSustain<EffectCallback>(fn);

  useIsomorphicLayoutEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  useIsomorphicLayoutEffect(() => {
    if (!isMounted.current) {
      isMounted.current = true;
      return;
    }
    return fnRef.current?.();
  }, dep);
};

export default useEffectAfterMounted;
