import React, {useState} from 'react';
import {Button, SafeAreaView, useWindowDimensions} from 'react-native';

import {
  Text,
  ThemeProvider,
  ThemedView,
  useTheme,
  useBreakPoint,
} from './theme';

const Component = () => {
  const theme = useTheme();

  const breakPoint = useBreakPoint();

  return (
    <ThemedView flex={1} alignItems="center" justifyContent="center">
      <ThemedView
        backgroundColor="primary"
        padding={'s'}
        style={{
          backgroundColor: theme.colors.secondary,
        }}
        borderRadius={8}>
        <Text>Hello, I am working!</Text>
      </ThemedView>
      <ThemedView
        flexDirection="row"
        flexWrap="wrap"
        gap={2}
        style={{margin: 20}}>
        {Array.from({length: 100}).map((_, i) => {
          const backgroundColor = i % 2 === 0 ? 'primary' : 'secondary';
          return (
            <ThemedView
              key={`key_${i}`}
              height={10}
              aspectRatio="1"
              backgroundColor={backgroundColor}
            />
          );
        })}
      </ThemedView>
    </ThemedView>
  );
};

export default () => {
  const [mode, setMode] = useState<'light' | 'dark'>('light');

  const toggleTheme = () => {
    setMode(m => (mode === 'light' ? 'dark' : 'light'));
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <ThemeProvider mode={mode}>
        <Component />
        <Button title={'Toggle Theme'} onPress={toggleTheme} />
      </ThemeProvider>
    </SafeAreaView>
  );
};
