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
      // Keep single-line inputs on one line so a long placeholder can't wrap
      // and drop below the cursor. Callers can override (e.g. multiline fields).
      numberOfLines={1}
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
