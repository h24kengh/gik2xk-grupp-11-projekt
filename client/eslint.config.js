import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist']), // Ignorerar byggmappen vid lintning
  {
    files: ['**/*.{js,jsx}'], // Gäller alla JS- och JSX-filer
    extends: [
      js.configs.recommended,           // ESLints rekommenderade grundregler
      reactHooks.configs.flat.recommended, // Regler för korrekt användning av React hooks
      reactRefresh.configs.vite,        // Stöd för React Fast Refresh i Vite
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser, // Tillåter webbläsarens globala variabler (t.ex. window, document)
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true }, // Aktiverar JSX-stöd
        sourceType: 'module',
      },
    },
    rules: {
      // Variabler som börjar med stor bokstav eller _ undantas från regeln om oanvända variabler
      'no-unused-vars': ['error', { varsIgnorePattern: '^[A-Z_]' }],
    },
  },
])