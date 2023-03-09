# react-native-prestyle

Another react-native styling library but this time it transforms styles on build time using babel.

While the library is currently in development and not yet stable, it offers the potential for improved performance and reliability in styling. Please exercise caution when using this library and report any issues or unexpected behavior you may encounter.

## Philosophy

Building styles on build time allows the styles to be precomputed and optimized, which can improve the performance of the application. When styles are built on run time, the application has to calculate the styles every time the component is rendered, which can cause lag and reduce performance.

### Usage:

1. Install the library:

```
yarn add react-native-prestyle
```

2. Add the babel plugin into your babel config file:

```json
{
  "plugins": ["react-native-prestyle/plugin"]
}
```

3. Create a theme file:

```ts
import { TextStyle, ViewStyle } from "react-native";
import { prestyle } from "react-native-prestyle";

const { ThemedView, ThemedText, ThemeProvider } = prestyle<
  ViewStyle,
  TextStyle
>()({
  light: {
    colors: {
      primary: "white",
      text: "black",
    },
  },
  dark: {
    colors: {
      primary: "black",
      text: "white",
    },
  },
  spacing: {
    m: {
      small: 8,
      medium: 16,
    },
    l: 32,
  },
  breakPoints: {
    small: 0,
    medium: 768,
  },
  viewVariants: {
    card: {
      backgroundColor: "primary",
      padding: "m",
      flex: 1,
    },
  },
  textVariants: {
    bold: {
      color: "primary",
      fontWeight: "bold",
    },
  },
});

export { ThemedView, ThemedText, ThemeProvider };
```

4. Usage:

```jsx
<ThemedView
  variant="card"
  backgroundColor="primary"
  marginBottom="m"
  style={{ marginTop: 10 }}
>
  <ThemedText variant="bold" color="text" marginTop="l">
    Hello I am a text
  </ThemedText>
</ThemedView>
```

The components `ThemedView` and `ThemedText` must be named exactly as such, as they are statically searched for by name.

When parsing the props for the components, the order in which they are defined determines their priority, except for the style prop, which always takes precedence over everything else.

## API:

### Themes:

| Name           | Description                                                                    |
| -------------- | ------------------------------------------------------------------------------ |
| `light`        | Colors for the light mode                                                      |
| `dark`         | Colors for the dark mode                                                       |
| `breakPoints`  | Width breakpoints                                                              |
| `spacing`      | Spacing tokens (can be numbers or per breakpoint)                              |
| `viewVariants` | Shared styles for the `ThemedView` component, applied using the `variant` prop |
| `textVariants` | Shared styles for the `ThemedText` component, applied using the `variant` prop |

### Prestyle:

| Name            | Description                                                                                                                                                                                       |
| --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `ThemeProvider` | A higher-order component that wraps the entire application and provides the theme to all the child components. It takes a `mode` prop, which can be used to switch between light and dark themes. |
| `ThemedView`    | A themed version of the standard React Native `View` component. It inherits its styles from the current theme provided by the `ThemeProvider`.                                                    |
| `ThemedText`    | A themed version of the standard React Native `Text` component. It inherits its styles from the current theme provided by the `ThemeProvider`.                                                    |
| `useTheme`      | A hook that can be used to access the current theme object in any component.                                                                                                                      |
| `useSpacing`    | A hook that can be used to access the spacing values defined in the current theme. It can be used to add consistent padding and margins to components.                                            |
| `useBreakPoint` | A hook that can be used to access the current breakpoint in the application. It can be used to create responsive designs that adapt to different screen sizes.                                    |
| `usePrestyle`   | A hook that provides access to everything, including the current mode, theme, spacing, breakpoint, `viewVariant`, and `textVariants`.                                                             |

### Props:

| Theme Property | Name                                                                                                                                                                                                                                                                                                              |
| -------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| colors         | `backgroundColor`, `color`, `borderColor`, `borderTopColor`, `borderRightColor`, `borderBottomColor`, `borderLeftColor`, `borderStartColor`, `borderEndColor`, `shadowColor`, `textShadowColor`, `textDecorationColor`                                                                                            |
| spacing        | `margin`, `marginVertical`, `marginHorizontal`, `marginRight`, `marginLeft`, `marginTop`, `marginBottom`, `marginStart`, `marginEnd`, `padding`, `paddingVertical`, `paddingHorizontal`, `paddingRight`, `paddingLeft`, `paddingTop`, `paddingBottom`, `paddingStart`, `paddingEnd`, `gap`, `rowGap`, `columnGap` |

## Known Limitations

- The components `ThemedView` and `ThemedText` must be named exactly as such, as they are statically searched for by name.
- Limited props spreading.
