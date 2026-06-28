/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
  ],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        bg:       '#F5F3FF',
        surface:  '#FFFFFF',
        card:     '#EEF2FF',
        border:   '#DDD6FE',
        primary:  '#7C9FE4',
        mint:     '#6EE7B7',
        lavender: '#C4B5FD',
        peach:    '#FCA5A5',
        amber:    '#FDE68A',
        ink:      '#1E1B4B',
        muted:    '#94A3B8',
        faint:    '#CBD5E1',
      },
    },
  },
  plugins: [],
};
