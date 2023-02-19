import React, {useState} from 'react';
import {Button, SafeAreaView} from 'react-native';

import {
  ThemedText,
  ThemedView,
  ThemeProvider,
  useBreakPoint,
  useTheme,
} from './theme';

const Component = () => {
  const theme = useTheme();

  const breakPoint = useBreakPoint();

  return (
    <ThemedView
      flex={1}
      backgroundColor={'background'}
      alignItems="center"
      justifyContent="center">
      <ThemedView
        marginBottom={'s'}
        style={{
          backgroundColor: theme.colors.secondary,
          padding: theme.spacing.s[breakPoint],
        }}
        borderRadius={8}>
        <ThemedText color={'text'}>Hello, I am working!</ThemedText>
      </ThemedView>
      <ThemedView
        flexDirection="row"
        flexWrap="wrap"
        gap={2}
        style={{margin: 20}}>
        {Array.from({length: 145}).map((_, i) => {
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
      <ThemedText color={'text'} fontWeight={'bold'}>
        Hello, I am another text!
      </ThemedText>
    </ThemedView>
  );
};

export default () => {
  const [mode, setMode] = useState<'light' | 'dark'>('light');

  const toggleTheme = () => {
    setMode(m => (m === 'light' ? 'dark' : 'light'));
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
