/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,ts,tsx}', './components/**/*.{js,ts,tsx}'],

  // Use the `class` strategy so NativeWind applies `dark:` variants when a parent
  // element has the `dark` class. We toggle this class in the app root using
  // React Native's `useColorScheme` so the app follows system theme automatically.
  darkMode: 'class',

  presets: [require('nativewind/preset')],
  theme: {
    extend: {},
  },
  plugins: [],
};
