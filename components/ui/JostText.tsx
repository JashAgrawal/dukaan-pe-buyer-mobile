import React from 'react';
import { Text, TextProps, StyleSheet } from 'react-native';

/**
 * A Text component that uses Jost font by default
 */
export function JostText(props: TextProps) {
  const { style, ...rest } = props;
  
  return (
    <Text
      style={[
        { fontFamily: 'Jost' },
        style,
      ]}
      {...rest}
    />
  );
}

export default JostText;
