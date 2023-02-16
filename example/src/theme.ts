import {prestyle} from 'react-native-prestyle';

const {useTheme, ThemeProvider, ThemedView, Text} = prestyle({
  light: {
    colors: {
      primary: 'blueviolet',
      secondary: 'crimson',
    },
  },
  dark: {
    colors: {
      primary: 'deepskyblue',
      secondary: 'gold',
    },
  },
});

export {useTheme, ThemeProvider, ThemedView, Text};
