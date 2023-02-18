import React, {
  ComponentType,
  createContext,
  ReactNode,
  useContext,
} from "react";
import { Text, View, ViewProps, ViewStyle } from "react-native";

type BreakPoints = Record<string, number | { width: number; height: number }>;

export interface Theme<BP extends BreakPoints> {
  colors: Record<string, string | { [Key in keyof BP]: string }>;
  spacing: Record<string, number | { [Key in keyof BP]: number }>;
  breakPoints: BP;
}

const ThemeContext = createContext({} as any);

export const useTheme = <BP extends BreakPoints, T extends Theme<BP>>() => {
  const context = useContext<T>(ThemeContext);
  if (!context) {
    throw Error("Make sure to wrap your component with ThemeProvider!");
  }
  return context;
};

const buildThemeProvider = <
  BP extends BreakPoints,
  T extends Theme<BP>,
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

function buildUseTheme<BP extends BreakPoints, T extends Theme<BP>>(): () => T {
  return useTheme;
}

export const prestyle = <
  BP extends BreakPoints,
  L extends Theme<BP>,
  D
>(themes: {
  light: L & { breakPoints: BP };
  dark: L & D & { breakPoints: BP };
}) => {
  return {
    useTheme: buildUseTheme<BP, L>(),
    ThemeProvider: buildThemeProvider<BP, L, { light: L; dark: L }>(themes),
    ThemedView: View as unknown as ComponentType<
      ViewProps &
        Omit<ViewStyle, "backgroundColor"> &
        Partial<{
          // colors
          backgroundColor: keyof L["colors"];
          // margins
          margin: keyof L["spacing"];
          marginVertical: keyof L["spacing"];
          marginHorizontal: keyof L["spacing"];
          marginRight: keyof L["spacing"];
          marginLeft: keyof L["spacing"];
          marginTop: keyof L["spacing"];
          marginBottom: keyof L["spacing"];
          // paddins
          padding: keyof L["spacing"];
          paddingVertical: keyof L["spacing"];
          paddingHorizontal: keyof L["spacing"];
          paddingRight: keyof L["spacing"];
          paddingLeft: keyof L["spacing"];
          paddingTop: keyof L["spacing"];
          paddingBottom: keyof L["spacing"];
        }>
    >,
    Text,
  };
};
