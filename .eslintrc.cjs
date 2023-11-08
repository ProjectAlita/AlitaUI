/* eslint-disable no-undef */
module.exports = {
  'plugins': ['react', 'import'],
  'env': {
    'browser': true,
    'es2021': true
  },
  'extends': [
    'eslint:recommended',
    'plugin:react-hooks/recommended',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
    'plugin:import/errors',
    'plugin:import/warnings'
  ],
  'parserOptions': {
    'ecmaVersion': 'latest',
    'sourceType': 'module'
  },
  'settings': {
    'import/resolver': {
      alias: {
        map: [
          ['@', './src'],
        ],
        extensions: ['.ts', '.js', '.jsx', '.json']
      }

    },
    'import/external-module-folders': ['node_modules'],
    'import/extensions': ['.js', '.jsx', '.ts', '.tsx', '.d.ts', '.svg'],
  },
  'globals': {
    'styled': 'readonly',
  },
  // 'caseSensitive': false,
  'rules': {
    'react/jsx-uses-react': 'error',
    'react/jsx-uses-vars': 'error',
    'react/prop-types': 0,
    'react-hooks/exhaustive-deps': 'error',
    'no-unused-vars': 'error',
    'prefer-const': 'error',
    'no-console': 'error',
    'no-shadow': 'error',
    'import/no-unresolved': 'error',
    'import/no-useless-path-segments': 'error',
    'import/no-duplicates': 'error',
    'react/jsx-no-bind': 'error',
    'react/jsx-pascal-case': 'error',
    'react/jsx-no-undef': [2, { allowGlobals: true }],
    'vars-on-top': 'error',
    'no-undef': 'error',
  }
}