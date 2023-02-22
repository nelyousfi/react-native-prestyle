import {prestyle} from 'react-native-prestyle';

const {useTheme, ThemeProvider, ThemedView, ThemedText, useBreakPoint} =
  prestyle({
    light: {
      colors: {
        primary: 'blueviolet',
        secondary: 'crimson',
        text: 'black',
        background: 'white',
      },
      spacing: {
        s: {
          phone: 10,
          tablet: 28,
        },
        m: 16,
        l: 32,
      },
    },
    dark: {
      colors: {
        primary: 'deepskyblue',
        secondary: 'orangered',
        text: 'white',
        background: 'black',
      },
      spacing: {
        s: {
          phone: 10,
          tablet: 50,
        },
        m: 16 * 2,
        l: 32 * 2,
      },
    },
    breakPoints: {
      phone: 0,
      tablet: 100,
    },
    viewVariants: {
      card: {
        borderRadius: 8,
        backgroundColor: 'primary',
        padding: 'l',
      },
      circle: {
        height: 100,
        width: 100,
        borderRadius: 50,
        backgroundColor: 'secondary',
      },
      bold: {
        fontWeight: 'bold',
        color: 'secondary',
      },
    },
  });

export {useTheme, ThemeProvider, ThemedView, ThemedText, useBreakPoint};
