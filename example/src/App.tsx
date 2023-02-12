import React from 'react';
import {Text, ThemeProvider, ThemedView} from './theme';

const Component = () => {
  return (
    <ThemedView flex={1} alignItems="center" justifyContent="center">
      <ThemedView
        backgroundColor="primary"
        marginBottom={20}
        padding={20}
        borderRadius={8}>
        <Text>Hello, I am working!</Text>
      </ThemedView>
      <ThemedView backgroundColor={'secondary'} height={120} width={20} />
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
  return (
    <ThemeProvider>
      <Component />
    </ThemeProvider>
  );
};
