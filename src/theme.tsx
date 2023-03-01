import React, {
  ComponentType,
  createContext,
  forwardRef,
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
}

type ThemeContextType<
  BP extends BreakPoints,
  T extends Theme<BP>,
  S extends Record<string, number | { [Key in keyof BP]: number }>,
  VV extends Record<string, ThemedViewStyleProps<BP, T, S>>,
  TV extends Record<string, ThemedTextStyleProps<BP, T, S>>
> = {
  theme: T;
  mode: keyof Themes<BP, T, S, VV, TV>;
  spacing: S;
  breakPoint: keyof BP;
  viewVariants: VV;
  textVariants: TV;
};

const ThemeContext = createContext<ThemeContextType<any, any, any, any, any>>(
  {} as any
);

export const useTheme = <
  BP extends BreakPoints,
  T extends Theme<BP>,
  S extends Record<string, number | { [Key in keyof BP]: number }>,
  VV extends Record<string, ThemedViewStyleProps<BP, T, S>>,
  TV extends Record<string, ThemedTextStyleProps<BP, T, S>>
>(): T => {
  const context = useContext<ThemeContextType<BP, T, S, VV, TV>>(ThemeContext);
  if (!context) {
    throw Error("Make sure to wrap your component with ThemeProvider!");
  }
  return context.theme;
};

export const useSpacing = <
  BP extends BreakPoints,
  T extends Theme<BP>,
  S extends Record<string, number | { [Key in keyof BP]: number }>,
  VV extends Record<string, ThemedViewStyleProps<BP, T, S>>,
  TV extends Record<string, ThemedTextStyleProps<BP, T, S>>
>(): S => {
  const context = useContext<ThemeContextType<BP, T, S, VV, TV>>(ThemeContext);
  if (!context) {
    throw Error("Make sure to wrap your component with ThemeProvider!");
  }
  return context.spacing;
};

export const usePrestyle = <
  BP extends BreakPoints,
  T extends Theme<BP>,
  S extends Record<string, number | { [Key in keyof BP]: number }>,
  VV extends Record<string, ThemedViewStyleProps<BP, T, S>>,
  TV extends Record<string, ThemedTextStyleProps<BP, T, S>>
>(): ThemeContextType<BP, T, S, VV, TV> => {
  const context = useContext<ThemeContextType<BP, T, S, VV, TV>>(ThemeContext);
  if (!context) {
    throw Error("Make sure to wrap your component with ThemeProvider!");
  }
  return context;
};

type Themes<
  BP extends BreakPoints,
  T extends Theme<BP>,
  S extends Record<string, number | { [Key in keyof BP]: number }>,
  VV extends Record<string, ThemedViewStyleProps<BP, T, S>>,
  TV extends Record<string, ThemedTextStyleProps<BP, T, S>>
> = {
  light: T;
  dark: T;
  spacing: S;
  breakPoints: BP;
  viewVariants: VV;
  textVariants: TV;
};

const buildThemeProvider = <
  BP extends BreakPoints,
  T extends Theme<BP>,
  S extends Record<string, number | { [Key in keyof BP]: number }>,
  VV extends Record<string, ThemedViewStyleProps<BP, T, S>>,
  TV extends Record<string, ThemedTextStyleProps<BP, T, S>>,
  TS extends Themes<BP, T, S, VV, TV>
>(
  themes: TS
) => {
  return function ThemeProvider({
    mode = "light",
    children,
  }: {
    mode?: Exclude<
      keyof Themes<BP, T, S, VV, TV>,
      "breakPoints" | "viewVariants" | "textVariants" | "spacing"
    >;
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
        value={{
          mode,
          theme,
          spacing: themes.spacing,
          breakPoint,
          viewVariants: themes.viewVariants,
          textVariants: themes.textVariants,
        }}
      >
        {children}
      </ThemeContext.Provider>
    );
  };
};

function buildUseTheme<BP extends BreakPoints, T extends Theme<BP>>(): () => T {
  return useTheme;
}

function buildUseSpacing<
  BP extends BreakPoints,
  S extends Record<string, number | { [Key in keyof BP]: number }>
>(): () => S {
  return useSpacing;
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
  S extends Record<string, number | { [Key in keyof BP]: number }>,
  VV extends Record<string, ThemedViewStyleProps<BP, T, S>>,
  TV extends Record<string, ThemedTextStyleProps<BP, T, S>>
>(): keyof BP => {
  const context = useContext<ThemeContextType<BP, T, S, VV, TV>>(ThemeContext);
  if (!context) {
    throw Error("Make sure to wrap your component with ThemeProvider!");
  }
  return context.breakPoint;
};

function buildUseBreakPoint<BP extends BreakPoints>(): () => keyof BP {
  return useBreakPoint;
}

type ThemedViewStyleProps<
  BP extends BreakPoints,
  T extends Theme<BP>,
  S extends Record<string, number | { [Key in keyof BP]: number }>
> = ViewStyle &
  Partial<{
    // colors
    backgroundColor: keyof T["colors"];
    // margins
    margin: keyof S;
    marginVertical: keyof S;
    marginHorizontal: keyof S;
    marginRight: keyof S;
    marginLeft: keyof S;
    marginTop: keyof S;
    marginBottom: keyof S;
    // paddings
    padding: keyof S;
    paddingVertical: keyof S;
    paddingHorizontal: keyof S;
    paddingRight: keyof S;
    paddingLeft: keyof S;
    paddingTop: keyof S;
    paddingBottom: keyof S;
  }>;

type ThemedTextStyleProps<
  BP extends BreakPoints,
  T extends Theme<BP>,
  S extends Record<string, number | { [Key in keyof BP]: number }>
> = TextStyle &
  Partial<{
    // colors
    color: keyof T["colors"];
    backgroundColor: keyof T["colors"];
    // margins
    margin: keyof S;
    marginVertical: keyof S;
    marginHorizontal: keyof S;
    marginRight: keyof S;
    marginLeft: keyof S;
    marginTop: keyof S;
    marginBottom: keyof S;
    // paddings
    padding: keyof S;
    paddingVertical: keyof S;
    paddingHorizontal: keyof S;
    paddingRight: keyof S;
    paddingLeft: keyof S;
    paddingTop: keyof S;
    paddingBottom: keyof S;
  }>;

const NativeThemedView = forwardRef(
  (
    props: {
      buildStyle: (
        context: ThemeContextType<any, any, any, any, any>
      ) => ViewStyle;
    },
    ref: any
  ) => {
    const context = usePrestyle();

    const style = props.buildStyle(context);

    return <View {...props} ref={ref} style={style} />;
  }
);
NativeThemedView.displayName = "NativeThemedView";

const NativeThemedText = forwardRef(
  (
    props: {
      buildStyle: (
        context: ThemeContextType<any, any, any, any, any>
      ) => TextStyle;
    },
    ref: any
  ) => {
    const context = usePrestyle();

    const style = props.buildStyle(context);

    return <Text {...props} ref={ref} style={style} />;
  }
);
NativeThemedText.displayName = "NativeThemedText";

export const prestyle = <
  BP extends BreakPoints,
  L extends Theme<BP>,
  S extends Record<string, number | { [Key in keyof BP]: number }>,
  VV extends Record<string, ThemedViewStyleProps<BP, L, S>>,
  TV extends Record<string, ThemedTextStyleProps<BP, L, S>>,
  D
>(themes: {
  light: L;
  dark: L & D;
  spacing: S;
  breakPoints: BP;
  viewVariants: VV;
  textVariants: TV;
}) => {
  return {
    useTheme: buildUseTheme<BP, L>(),
    useSpacing: buildUseSpacing<BP, S>(),
    useBreakPoint: buildUseBreakPoint<BP>(),
    ThemeProvider: buildThemeProvider<
      BP,
      L,
      S,
      VV,
      TV,
      {
        light: L;
        dark: L;
        spacing: S;
        breakPoints: BP;
        viewVariants: VV;
        textVariants: TV;
      }
    >(themes),
    ThemedView: NativeThemedView as unknown as ComponentType<
      ViewProps &
        ThemedViewStyleProps<BP, L, S> &
        Partial<{ variant: keyof VV }>
    >,
    ThemedText: NativeThemedText as unknown as ComponentType<
      TextProps &
        ThemedTextStyleProps<BP, L, S> &
        Partial<{ variant: keyof TV }>
    >,
  };
};
