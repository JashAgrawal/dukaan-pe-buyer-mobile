import React, { forwardRef, useImperativeHandle, useRef } from 'react';
import { View, StyleSheet, TextInput, TouchableOpacity, Platform } from 'react-native';
import { IconSymbol } from '@/components/ui/IconSymbol';

interface SearchInputProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  onFocus?: () => void;
  onBlur?: () => void;
  onClear?: () => void;
  autoFocus?: boolean;
}

export interface SearchInputRef {
  focus: () => void;
  blur: () => void;
  clear: () => void;
}

const SearchInput = forwardRef<SearchInputRef, SearchInputProps>(
  ({ 
    value, 
    onChangeText, 
    placeholder = 'Search for stores, products & more', 
    onFocus, 
    onBlur,
    onClear,
    autoFocus = false
  }, ref) => {
    const inputRef = useRef<TextInput>(null);
    
    // Expose methods to parent component
    useImperativeHandle(ref, () => ({
      focus: () => inputRef.current?.focus(),
      blur: () => inputRef.current?.blur(),
      clear: () => inputRef.current?.clear(),
    }));
    
    const handleClear = () => {
      onChangeText('');
      if (onClear) onClear();
    };
    
    return (
      <View style={styles.container}>
        <IconSymbol name="search" size={20} color="#999" style={styles.searchIcon} />
        
        <TextInput
          ref={inputRef}
          style={styles.input}
          placeholder={placeholder}
          value={value}
          onChangeText={onChangeText}
          onFocus={onFocus}
          onBlur={onBlur}
          returnKeyType="search"
          autoFocus={autoFocus}
          clearButtonMode="while-editing"
        />
        
        {value.length > 0 && Platform.OS !== 'ios' && (
          <TouchableOpacity 
            style={styles.clearButton}
            onPress={handleClear}
          >
            <IconSymbol name="xmark.circle.fill" size={20} color="#999" />
          </TouchableOpacity>
        )}
      </View>
    );
  }
);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 44,
  },
  searchIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    height: '100%',
    fontSize: 16,
    fontFamily: 'Jost-Regular',
  },
  clearButton: {
    padding: 4,
  },
});

export default SearchInput;
