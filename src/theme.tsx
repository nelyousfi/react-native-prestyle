import React, {
  ComponentType,
  createContext,
  ReactNode,
  useContext,
} from "react";
import { Text, View, ViewProps, ViewStyle } from "react-native";

export type BaseTheme = {
  colors: Record<string, string>;
};

const ThemeContext = createContext({} as any);

export const useTheme = <Theme extends BaseTheme>() => {
  const context = useContext<Theme>(ThemeContext);
  if (!context) {
    throw Error("Make sure to wrap your component with ThemeProvider!");
  }
  return context;
};

const buildThemeProvider = <Theme extends BaseTheme>(theme: Theme) => {
  return ({ children }: { children: ReactNode }) => (
    <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>
  );
};

export const prestyle = <Theme extends BaseTheme>(theme: Theme) => {
  return {
    // @ts-ignore
    useTheme: useTheme<Theme>,
    ThemeProvider: buildThemeProvider<Theme>(theme),
    ThemedView: View as unknown as ComponentType<
      ViewProps &
        Omit<ViewStyle, "backgroundColor"> &
        Partial<{
          backgroundColor: keyof Theme["colors"];
        }>
    >,
    Text,
  };
};
