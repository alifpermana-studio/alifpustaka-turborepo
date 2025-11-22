/** @type {import("prettier").Config} */
const config = {
  semi: true, // Add semicolons at the end of statements
  singleQuote: true, // Use single quotes instead of double
  trailingComma: 'all', // Add trailing commas where valid in ES5 (objects, arrays, etc.)
  printWidth: 100, // Wrap lines at 100 characters
  tabWidth: 2, // Use 2 spaces per indentation level
  useTabs: false, // Use spaces instead of tabs
  jsxSingleQuote: false, // Use double quotes in JSX
  bracketSpacing: true, // Print spaces between brackets in object literals
  arrowParens: 'always', // Always include parens in arrow functions (e.g. (x) => x)
  plugins: ['prettier-plugin-tailwindcss'], // Optional: format Tailwind classnames if you're using it
};

module.exports = config;
