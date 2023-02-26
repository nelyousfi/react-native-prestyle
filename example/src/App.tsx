import React, {useState} from 'react';
import {Button, SafeAreaView} from 'react-native';
import {usePrestyle} from 'react-native-prestyle';

import {ThemedText, ThemedView, ThemeProvider} from './theme';

const color = 'text';

const Component = () => {
  const [enabled, toggleEnabled] = useState(false);

  const {theme, breakPoint, viewVariants, textVariants} = usePrestyle();

  const spacing = theme.spacing.m;

  console.log({
    theme,
  });

  return (
    <ThemedView
      flex={1}
      backgroundColor="background"
      alignItems="center"
      justifyContent="center">
      <ThemedView
        variant={'card'}
        marginBottom={enabled ? 'm' : 'l'}
        borderRadius={8}>
        <ThemedText variant="bold">  Hello, I am working!</ThemedText>
      </ThemedView>
      <ThemedView
        variant="circle"
        backgroundColor="primary"
        marginBottom={enabled ? 'm' : 'l'}
        borderRadius={8}
      />
      <Button title="Toggle Enabled" onPress={() => toggleEnabled(e => !e)} />
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
              backgroundColor={backgroundColor}
            />
          );
        })}
      </ThemedView>
      <ThemedText color={color} fontWeight={'bold'}>
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
