import React, {ComponentProps, useState} from 'react';
import {Button, SafeAreaView, StyleSheet} from 'react-native';

import {ThemedText, ThemedView, ThemeProvider, useTheme} from './theme';

const color = 'text';

const ThemedTextCustom = (props: ComponentProps<typeof ThemedText>) => {
  return <ThemedText {...props} fontWeight="bold" marginTop="m" />;
};

const Circle = ({radius}: {radius: number}) => (
  <ThemedView
    variant="circle"
    backgroundColor="primary"
    height={radius}
    width={radius}
  />
);

const Component = () => {
  const [enabled, toggleEnabled] = useState(false);

  const theme = useTheme();

  const renderCard = () => {
    return (
      <ThemedView
        variant={'card'}
        backgroundColor="secondary"
        style={{marginVertical: 20}}
      />
    );
  };

  return (
    <ThemedView
      flex={1}
      alignItems="center"
      justifyContent="center"
      style={{backgroundColor: theme.colors.background}}>
      <Circle radius={20} />
      {renderCard()}
      <ThemedView
        variant={'card'}
        marginBottom={enabled ? 'm' : 'l'}
        padding="m"
        margin="m"
        borderRadius={8}
        style={{
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <ThemedText variant="bold" style={{}}>
          Hello, I am working!
        </ThemedText>
      </ThemedView>
      <ThemedView
        variant="circle"
        backgroundColor="secondary"
        marginBottom={enabled ? 'm' : 'l'}
      />
      <Button title="Toggle Enabled" onPress={() => toggleEnabled(e => !e)} />
      <ThemedView
        flexDirection="row"
        flexWrap="wrap"
        gap={'s'}
        style={{margin: 20}}>
        {Array.from({length: 145}).map((_, i) => {
          const backgroundColor = i % 2 === 0 ? 'primary' : 'secondary';
          return (
            <ThemedView
              key={`key_${i}`}
              height={10}
              backgroundColor={backgroundColor}
              style={styles.box}
            />
          );
        })}
      </ThemedView>
      <ThemedText color={color} fontWeight={'bold'}>
        Hello, I am another text!
      </ThemedText>
      <ThemedTextCustom
        color="primary"
        // style={{
        //   color: theme.colors.primary,
        // }} // for some reason, when I pass the style, I get an error from the margin={'m'} prop
      >
        I am the ThemedTextCustom
      </ThemedTextCustom>
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

const styles = StyleSheet.create({
  box: {
    width: 10,
  },
});
