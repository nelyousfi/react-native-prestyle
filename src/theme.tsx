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

type ThemeContextType<
  BP extends BreakPoints,
  T extends Theme<BP>,
  VV extends Record<string, ThemedViewStyleProps<BP, T>>
> = {
  theme: T;
  mode: keyof Themes<BP, T, VV>;
  breakPoint: keyof BP;
  viewVariants: VV;
};

const ThemeContext = createContext<ThemeContextType<any, any, any>>({} as any);

export const useTheme = <
  BP extends BreakPoints,
  T extends Theme<BP>,
  VV extends Record<string, ThemedViewStyleProps<BP, T>>
>(): T => {
  const context = useContext<ThemeContextType<BP, T, VV>>(ThemeContext);
  if (!context) {
    throw Error("Make sure to wrap your component with ThemeProvider!");
  }
  return context.theme;
};

type Themes<
  BP extends BreakPoints,
  T extends Theme<BP>,
  VV extends Record<string, ThemedViewStyleProps<BP, T>>
> = {
  light: T;
  dark: T;
  breakPoints: BP;
  viewVariants: VV;
};

const buildThemeProvider = <
  BP extends BreakPoints,
  T extends Theme<BP>,
  VV extends Record<string, ThemedViewStyleProps<BP, T>>,
  TS extends Themes<BP, T, VV>
>(
  themes: TS
) => {
  return function ThemeProvider({
    mode = "light",
    children,
  }: {
    mode?: Exclude<keyof Themes<BP, T, VV>, "breakPoints" | "viewVariants">;
    children: ReactNode;
  }) {
    const theme = useMemo<T>(() => {
      return themes[mode];
    }, [mode]);

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
    }, [width]);

    return (
      <ThemeContext.Provider
        value={{ mode, theme, breakPoint, viewVariants: themes.viewVariants }}
      >
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
  T extends Theme<BP>,
  VV extends Record<string, ThemedViewStyleProps<BP, T>>
>(): keyof BP => {
  const context = useContext<ThemeContextType<BP, T, VV>>(ThemeContext);
  if (!context) {
    throw Error("Make sure to wrap your component with ThemeProvider!");
  }
  return context.breakPoint;
};

function buildUseBreakPoint<BP extends BreakPoints>(): () => keyof BP {
  return useBreakPoint;
}

export const useViewVariants = <
  BP extends BreakPoints,
  T extends Theme<BP>,
  VV extends Record<string, ThemedViewStyleProps<BP, T>>
>(): Record<string, ThemedViewStyleProps<BP, T>> => {
  const context = useContext<ThemeContextType<BP, T, VV>>(ThemeContext);
  if (!context) {
    throw Error("Make sure to wrap your component with ThemeProvider!");
  }
  return context.viewVariants;
};

type ThemedViewStyleProps<
  BP extends BreakPoints,
  T extends Theme<BP>
> = ViewStyle &
  Partial<{
    // colors
    backgroundColor: keyof T["colors"];
    // margins
    margin: keyof T["spacing"];
    marginVertical: keyof T["spacing"];
    marginHorizontal: keyof T["spacing"];
    marginRight: keyof T["spacing"];
    marginLeft: keyof T["spacing"];
    marginTop: keyof T["spacing"];
    marginBottom: keyof T["spacing"];
    // paddings
    padding: keyof T["spacing"];
    paddingVertical: keyof T["spacing"];
    paddingHorizontal: keyof T["spacing"];
    paddingRight: keyof T["spacing"];
    paddingLeft: keyof T["spacing"];
    paddingTop: keyof T["spacing"];
    paddingBottom: keyof T["spacing"];
  }>;

export const prestyle = <
  BP extends BreakPoints,
  L extends Theme<BP>,
  VV extends Record<string, ThemedViewStyleProps<BP, L>>,
  D
>(themes: {
  light: L;
  dark: L & D;
  breakPoints: BP;
  viewVariants: VV;
}) => {
  return {
    useTheme: buildUseTheme<BP, L>(),
    useBreakPoint: buildUseBreakPoint<BP>(),
    ThemeProvider: buildThemeProvider<
      BP,
      L,
      VV,
      {
        light: L;
        dark: L;
        breakPoints: BP;
        viewVariants: VV;
      }
    >(themes),
    ThemedView: View as unknown as ComponentType<
      ViewProps & ThemedViewStyleProps<BP, L> & Partial<{ variant?: keyof VV }>
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
