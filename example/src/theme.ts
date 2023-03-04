import {prestyle} from 'react-native-prestyle';

const {
  useTheme,
  useSpacing,
  ThemeProvider,
  ThemedView,
  ThemedText,
  useBreakPoint,
} = prestyle({
  light: {
    colors: {
      primary: 'blueviolet',
      secondary: 'crimson',
      text: 'black',
      background: 'white',
    },
  },
  dark: {
    colors: {
      primary: 'deepskyblue',
      secondary: 'orangered',
      text: 'white',
      background: 'black',
    },
  },
  spacing: {
    s: 2,
    m: {
      phone: 10,
      tablet: 20,
    },
    l: 32,
  },
  // TODO: when removing a breakpoint, spacing is not complaining
  breakPoints: {
    phone: 0,
    tablet: 100,
  },
  viewVariants: {
    card: {
      borderRadius: 8,
      // backgroundColor: 'primary',
      // padding: 'l',
      // height: 20,
      // width: 20,
      padding: 'l',
    },
    circle: {
      height: 100,
      width: 100,
      borderRadius: 50,
      backgroundColor: 'secondary',
    },
  },
  textVariants: {
    bold: {
      fontWeight: 'bold',
      color: 'text',
    },
  },
});

export {
  useTheme,
  useSpacing,
  ThemeProvider,
  ThemedView,
  ThemedText,
  useBreakPoint,
};
