import React from 'react';
import { TextInput } from 'react-native';

/**
 * Wrapper around TextInput that fixes vertical text alignment on all platforms.
 * Use this everywhere instead of raw TextInput.
 */
export function Input({ style, className, ...props }) {
  return (
    <TextInput
      className={className}
      style={[
        {
          textAlignVertical: 'center',
          includeFontPadding: false,
          fontSize: 16,
        },
        style,
      ]}
      {...props}
    />
  );
}
