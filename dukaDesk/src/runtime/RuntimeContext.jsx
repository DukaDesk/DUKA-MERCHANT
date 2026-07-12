import { createContext, useContext } from "react";

export const RuntimeContext = createContext(null);

export function useRuntimeContext() {
  return useContext(RuntimeContext);
}

export function useDispatchAction() {
  const ctx = useContext(RuntimeContext);
  return ctx?.dispatchAction || (() => {});
}
