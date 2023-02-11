import {Text, ThemeProvider, ThemedView} from './theme';

const Component = () => {
  return (
    <ThemedView flex={1} alignItems="center" justifyContent="center">
      <ThemedView backgroundColor="primary" padding={20} borderRadius={8}>
        <Text>Hello, I am working!</Text>
      </ThemedView>
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
