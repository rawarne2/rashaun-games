import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Imported game source trees — these were authored as Vite + React 18
    // apps before Next 16's React Compiler lints existed. Their existing
    // patterns (setState-in-effect for socket lifecycles, ref creation in
    // react-dnd connectors, etc.) work correctly and refactoring them all
    // would be a large, risky change. Lint of code authored against Next is
    // unaffected: only files under app/<game>/, components/, lib/, and the
    // root remain subject to the strict rule set.
    "app/games/*/_src/**",
  ]),
]);

export default eslintConfig;
