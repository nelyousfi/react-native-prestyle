import React, {
  ComponentType,
  createContext,
  ReactNode,
  useContext,
  useMemo,
} from "react";
import {
  Text,
  TextProps,
  TextStyle,
  useWindowDimensions,
  View,
  ViewProps,
  ViewStyle,
} from "react-native";

type BreakPoints = Record<string, number>;

export interface Theme<BP extends BreakPoints> {
  colors: Record<string, string | { [Key in keyof BP]: string }>;
  spacing: Record<string, number | { [Key in keyof BP]: number }>;
}

type ThemeContextType<BP extends BreakPoints, T extends Theme<BP>> = {
  theme: T;
  mode: keyof Themes<BP, T>;
  breakPoint: keyof BP;
};

const ThemeContext = createContext<ThemeContextType<any, any>>({} as any);

export const useTheme = <BP extends BreakPoints, T extends Theme<BP>>(): T => {
  const context = useContext<ThemeContextType<BP, T>>(ThemeContext);
  if (!context) {
    throw Error("Make sure to wrap your component with ThemeProvider!");
  }
  return context.theme;
};

type Themes<BP extends BreakPoints, T extends Theme<BP>> = {
  light: T;
  dark: T;
  breakPoints: BP;
};

const buildThemeProvider = <
  BP extends BreakPoints,
  T extends Theme<BP>,
  TS extends Themes<BP, T>
>(
  themes: TS
) => {
  return ({
    mode = "light",
    children,
  }: {
    mode?: Exclude<keyof Themes<BP, T>, "breakPoints">;
    children: ReactNode;
  }) => {
    const theme = useMemo<T>(() => {
      return themes[mode];
    }, [mode, themes]);

    const { width } = useWindowDimensions();

    const breakPoint = useMemo(() => {
      let breakPoint = Object.keys(themes.breakPoints)[0];
      for (const [key, value] of sortObjectByValue(themes.breakPoints)) {
        if (key === breakPoint) continue;
        if (value <= width) {
          breakPoint = key;
        } else {
          break;
        }
      }
      return breakPoint;
    }, [themes, width]);

    return (
      <ThemeContext.Provider value={{ mode, theme, breakPoint }}>
        {children}
      </ThemeContext.Provider>
    );
  };
};

function buildUseTheme<BP extends BreakPoints, T extends Theme<BP>>(): () => T {
  return useTheme;
}

function sortObjectByValue<T>(obj: Record<string, T>): Array<[string, T]> {
  return Object.entries(obj).sort((a, b) => {
    const [valueA, valueB] = [a[1], b[1]];
    if (valueA < valueB) {
      return -1;
    }
    if (valueA > valueB) {
      return 1;
    }
    return 0;
  });
}

export const useBreakPoint = <
  BP extends BreakPoints,
  T extends Theme<BP>
>(): keyof BP => {
  const context = useContext<ThemeContextType<BP, T>>(ThemeContext);
  if (!context) {
    throw Error("Make sure to wrap your component with ThemeProvider!");
  }
  return context.breakPoint;
};

function buildUseBreakPoint<BP extends BreakPoints>(): () => keyof BP {
  return useBreakPoint;
}

export const prestyle = <
  BP extends BreakPoints,
  L extends Theme<BP>,
  D
>(themes: {
  light: L;
  dark: L & D;
  breakPoints: BP;
}) => {
  return {
    useTheme: buildUseTheme<BP, L>(),
    useBreakPoint: buildUseBreakPoint<BP>(),
    ThemeProvider: buildThemeProvider<
      BP,
      L,
      { light: L; dark: L; breakPoints: BP }
    >(themes),
    ThemedView: View as unknown as ComponentType<
      ViewProps &
        ViewStyle &
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
          // paddings
          padding: keyof L["spacing"];
          paddingVertical: keyof L["spacing"];
          paddingHorizontal: keyof L["spacing"];
          paddingRight: keyof L["spacing"];
          paddingLeft: keyof L["spacing"];
          paddingTop: keyof L["spacing"];
          paddingBottom: keyof L["spacing"];
        }>
    >,
    ThemedText: Text as unknown as ComponentType<
      TextProps &
        TextStyle &
        Partial<{
          // colors
          backgroundColor: keyof L["colors"];
          color: keyof L["colors"];
          // margins
          margin: keyof L["spacing"];
          marginVertical: keyof L["spacing"];
          marginHorizontal: keyof L["spacing"];
          marginRight: keyof L["spacing"];
          marginLeft: keyof L["spacing"];
          marginTop: keyof L["spacing"];
          marginBottom: keyof L["spacing"];
          // paddings
          padding: keyof L["spacing"];
          paddingVertical: keyof L["spacing"];
          paddingHorizontal: keyof L["spacing"];
          paddingRight: keyof L["spacing"];
          paddingLeft: keyof L["spacing"];
          paddingTop: keyof L["spacing"];
          paddingBottom: keyof L["spacing"];
        }>
    >,
  };
};
