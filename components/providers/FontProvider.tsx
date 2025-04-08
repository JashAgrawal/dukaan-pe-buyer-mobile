import React from 'react';
import { Text, TextInput } from 'react-native';

/**
 * FontProvider component that overrides the default Text component
 * to use Jost font family by default
 */
export function FontProvider({ children }: { children: React.ReactNode }) {
  // Store the original render function
  const originalTextRender = Text.render;
  const originalTextInputRender = TextInput.render;
  
  // Override the render function to include the Jost font family
  Text.render = function(props, ref) {
    const { style, ...rest } = props;
    const newProps = {
      ...rest,
      style: [{ fontFamily: 'Jost' }, style],
      ref,
    };
    
    return originalTextRender.call(this, newProps);
  };
  
  // Override TextInput render to use Jost font
  TextInput.render = function(props, ref) {
    const { style, ...rest } = props;
    const newProps = {
      ...rest,
      style: [{ fontFamily: 'Jost' }, style],
      ref,
    };
    
    return originalTextInputRender.call(this, newProps);
  };
  
  return <>{children}</>;
}

export default FontProvider;
