import {Text, ThemeProvider, ThemedView} from './theme';

const Component = () => {
  return (
    <ThemedView
      flex={1}
      alignItems={'center'}
      justifyContent={'center'}
      backgroundColor="primary">
      <Text>Hello, I am working!</Text>
    </ThemedView>
  );
};

export default () => {
  return (
    <ThemeProvider>
      <Component />
    </ThemeProvider>
  );
};
