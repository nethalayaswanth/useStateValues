import { useEffect, useLayoutEffect } from "react";

const useIsomorphicLayoutEffect =
  window !== undefined ? useEffect : useLayoutEffect;
export default useIsomorphicLayoutEffect;
