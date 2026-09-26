import React from 'react';
import { TextInput } from 'react-native';

/**
 * Wrapper around TextInput that keeps vertical text/placeholder alignment
 * consistent across platforms. Use this everywhere instead of raw TextInput.
 *
 * We deliberately do NOT set `numberOfLines` here. A single-line TextInput (the
 * default, i.e. no `multiline`) never wraps its text or placeholder — it clips
 * and scrolls horizontally — so `numberOfLines={1}` does nothing for wrapping.
 * On the New Architecture (Fabric) it actively triggers an intermittent bug
 * where the placeholder renders one line too low until a relayout corrects it,
 * which is exactly the "placeholder sits a line lower" glitch seen on iOS.
 * A caller that genuinely needs a multiline field can pass `multiline` and
 * `numberOfLines` explicitly.
 */
export function Input({ style, className, ...props }) {
  return (
    <TextInput
      className={className}
      style={[
        {
          // `verticalAlign` is the cross-platform style (Android maps it to
          // textAlignVertical; single-line iOS centers natively). Keeping the
          // legacy prop too is harmless and covers older Android paths.
          verticalAlign: 'middle',
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
