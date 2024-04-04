import { useRef } from "react";
import useIsomorphicLayoutEffect from "./useIsomorphicLayoutEffect";

const useIsMounted = () => {
  const isMounted = useRef(false);

  useIsomorphicLayoutEffect(() => {
    isMounted.current = true;

    return () => {
      isMounted.current = false;
    };
  }, []);

  return isMounted.current;
};

export default useIsMounted;
