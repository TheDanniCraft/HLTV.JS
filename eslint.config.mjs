import globals from 'globals';
import pluginJs from '@eslint/js';
import tseslint from 'typescript-eslint';

export default [
    {
        files: ['**/*.{js,mjs,cjs,ts}'],
    },
    {
        languageOptions: { globals: globals.browser },
    },
    {
        ignores: ['docs/**', 'dist/**'],
    },
    pluginJs.configs.recommended,
    ...tseslint.configs.strict,
];
