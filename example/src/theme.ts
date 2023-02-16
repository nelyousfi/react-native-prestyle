import {prestyle} from 'react-native-prestyle';

const {useTheme, ThemeProvider, ThemedView, Text} = prestyle({
  light: {
    colors: {
      primary: 'blueviolet',
      secondary: 'crimson',
    },
    spacing: {
      s: 8,
      m: 16,
      l: 32,
    },
  },
  dark: {
    colors: {
      primary: 'deepskyblue',
      secondary: 'gold',
    },
    spacing: {
      s: 8 * 2,
      m: 16 * 2,
      l: 32 * 2,
    },
  },
});

export {useTheme, ThemeProvider, ThemedView, Text};
