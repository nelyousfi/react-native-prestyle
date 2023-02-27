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
        s: 1,
        m: {
          phone: 10,
          tablet: 16,
        },
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
        s: 2,
        m: {
          phone: 20,
          tablet: 32,
        },
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
    },
    textVariants: {
      bold: {
        fontWeight: 'bold',
        color: 'text',
      },
    },
  });

export {useTheme, ThemeProvider, ThemedView, ThemedText, useBreakPoint};
