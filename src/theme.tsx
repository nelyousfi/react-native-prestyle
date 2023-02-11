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

const buildUseTheme = <Theme extends BaseTheme>() => {
  return useTheme<Theme>();
};

const buildThemeProvider = <Theme extends BaseTheme>(theme: Theme) => {
  return ({ children }: { children: ReactNode }) => (
    <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>
  );
};

export const enrichTheme = <Theme extends BaseTheme>(theme: Theme) => {
  return {
    useTheme: buildUseTheme<Theme>(),
    ThemeProvider: buildThemeProvider<Theme>(theme),
    ThemedView: View as unknown as ComponentType<
      ViewProps &
        Omit<ViewStyle, "backgroundColor"> & {
          backgroundColor?: keyof Theme["colors"];
        }
    >,
    Text,
  };
};
