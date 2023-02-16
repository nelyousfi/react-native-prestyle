import React, {
  ComponentType,
  createContext,
  ReactNode,
  useContext,
} from "react";
import { Text, View, ViewProps, ViewStyle } from "react-native";

export type Theme = {
  colors: Record<string, string>;
};

const ThemeContext = createContext({} as any);

export const useTheme = <T extends Theme>() => {
  const context = useContext<T>(ThemeContext);
  if (!context) {
    throw Error("Make sure to wrap your component with ThemeProvider!");
  }
  return context;
};

const buildThemeProvider = <
  T extends Theme,
  Themes extends { light: T; dark: T }
>(
  themes: Themes
) => {
  return ({
    mode = "light",
    children,
  }: {
    mode?: keyof Themes;
    children: ReactNode;
  }) => {
    return (
      <ThemeContext.Provider value={themes[mode]}>
        {children}
      </ThemeContext.Provider>
    );
  };
};

function buildUseTheme<T extends Theme>(): () => T {
  return useTheme;
}

export const prestyle = <L extends Theme, D>(themes: {
  light: L;
  dark: L & D;
}) => {
  return {
    useTheme: buildUseTheme<L>(),
    ThemeProvider: buildThemeProvider<L, { light: L; dark: L }>(themes),
    ThemedView: View as unknown as ComponentType<
      ViewProps &
        Omit<ViewStyle, "backgroundColor"> &
        Partial<{
          backgroundColor: keyof L["colors"];
        }>
    >,
    Text,
  };
};
