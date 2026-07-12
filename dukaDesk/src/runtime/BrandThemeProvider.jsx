import { createContext, useContext, createElement } from "react";
import * as baseTheme from "../theme";

const BrandContext = createContext(null);

export function useBrand() {
  return useContext(BrandContext) || baseTheme;
}

export function BrandThemeProvider({ theme, children }) {
  const merged = theme
    ? { ...baseTheme, ...theme }
    : baseTheme;

  return createElement(BrandContext.Provider, { value: merged }, children);
}
