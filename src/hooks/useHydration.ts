import { useState, useEffect } from "react";

/**
 * A hook to deal with Next.js and Zustand persist hydration mismatch.
 * Returns true if the component is mounted and hydrated on the client.
 */
export function useHydration() {
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  return isHydrated;
}
