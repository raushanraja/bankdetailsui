import { defineConfig } from 'eslint/config'
import globals from 'globals'
import js from '@eslint/js'
import tseslint from 'typescript-eslint'
import pluginSolid from 'eslint-plugin-solid'
import prettier from 'eslint-config-prettier'

export default defineConfig([
    {
        files: ['src/**/*.{js,mjs,cjs,ts,jsx,tsx}'],
        ignores: ['**/*.test.{js,mjs,cjs,ts,jsx,tsx}'],
    },
    {
        files: ['src/**/*.{js,mjs,cjs,ts,jsx,tsx}'],
        ignores: ['**/*.test.{js,mjs,cjs,ts,jsx,tsx}'],
        languageOptions: { globals: { ...globals.browser, ...globals.node } },
    },
    {
        files: ['src/**/*.{js,mjs,cjs,ts,jsx,tsx}'],
        ignores: ['**/*.test.{js,mjs,cjs,ts,jsx,tsx}'],
        plugins: { js, tseslint, pluginSolid, prettier },
        extends: [
            'js/recommended',
            'tseslint/strict',
            'pluginSolid/typescript',
            'pluginSolid/recommended',
        ],
    },
])

