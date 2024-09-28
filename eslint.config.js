import antfu from '@antfu/eslint-config';
import tailwind from 'eslint-plugin-tailwindcss';
import nuxt from './.nuxt/eslint.config.mjs';

export default nuxt(antfu(
  {
    vue: true,
    formatters: false,
    rules: {
      'curly': ['error', 'all'],
      '@stylistic/semi': ['error', 'always'],
      '@stylistic/brace-style': ['error', '1tbs', { allowSingleLine: false }],
      '@stylistic/comma-dangle': ['error', 'always-multiline'],
      '@stylistic/arrow-parens': ['error', 'always'],
    },
    ignores: ['**/presets/**'],
  },
  [
    ...tailwind.configs['flat/recommended'],
    {
      files: ['**/app/**'],
      rules: {
        'tailwindcss/no-custom-classname': ['warn', {
          whitelist: [
            '^(?!.*\\-)(bg|text)-(primary|secondary)(?:-\\d+)?$',
            'text-primary',
            'icon-[-\\w]+',
            'p-invalid',
            'flex-center',
            'text-primary-*',
            'icon-*',
          ],
        }],
      },
    },
  ],
));
