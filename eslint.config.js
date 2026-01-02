import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import prettierFn from 'eslint-config-prettier';
import globals from 'globals';

export default tseslint.config(
    js.configs.recommended,
    ...tseslint.configs.recommended,
    {
        ignores: ['dist/**', 'node_modules/**', 'coverage/**'],
    },
    {
        languageOptions: {
            globals: {
                ...globals.node,
                ...globals.jest,
            },
            ecmaVersion: 2022,
            sourceType: 'module',
        },
        rules: {
            'no-console': 'off',
            '@typescript-eslint/no-explicit-any': 'warn',
            '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
        },
    },
    prettierFn,
);
