import {enrichTheme} from 'react-native-prestyle';

const theme = {
  colors: {
    primary: 'blueviolet',
    secondary: 'crimson',
  },
};

const {useTheme, ThemeProvider, ThemedView, Text} = enrichTheme(theme);

export {useTheme, ThemeProvider, ThemedView, Text};
