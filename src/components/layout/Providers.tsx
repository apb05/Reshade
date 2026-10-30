"use client";

import { MotionConfig } from "motion/react";
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

type ServerFlags = { checkoutEnabled: boolean; turnstileSiteKey: string | null };
const FlagsContext = createContext<ServerFlags>({ checkoutEnabled: false, turnstileSiteKey: null });
const HydratedContext = createContext(false);

export const useServerFlags = () => useContext(FlagsContext);
/** True once persisted (localStorage) state has been loaded on the client. */
export const useHydrated = () => useContext(HydratedContext);

export function Providers({ children, flags }: { children: ReactNode; flags: ServerFlags }) {
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    // The shop stores (studio, collection, cart) are parked with the shop; see LAUNCH.md.
    setHydrated(true);
  }, []);
  return (
    <FlagsContext.Provider value={flags}>
      <HydratedContext.Provider value={hydrated}>
        <MotionConfig reducedMotion="user">{children}</MotionConfig>
      </HydratedContext.Provider>
    </FlagsContext.Provider>
  );
}
