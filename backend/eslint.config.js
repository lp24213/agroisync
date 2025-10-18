import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import pluginReact from "eslint-plugin-react";
import { defineConfig } from "eslint/config";

// Ajustes: ativar ambiente node e declarar `process` como global readonly
const browserGlobals = globals.browser;
const nodeGlobals = globals.node;

export default defineConfig([
  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
    plugins: { js },
    extends: ["js/recommended"],
    languageOptions: {
      globals: {
        ...browserGlobals,
        ...nodeGlobals,
        process: "readonly"
      }
    },
    // declarar env node para regras que dependem disso
    rules: {}
  },
  tseslint.configs.recommended,
  pluginReact.configs.flat.recommended,
]);
