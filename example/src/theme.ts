import {prestyle} from 'react-native-prestyle';

const theme = {
  colors: {
    primary: 'blueviolet',
    secondary: 'crimson',
  },
};

const {useTheme, ThemeProvider, ThemedView, Text} = prestyle(theme);

export {useTheme, ThemeProvider, ThemedView, Text};
