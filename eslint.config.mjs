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
  ]),
  // Rule overrides for complex patterns that require architectural refactoring
  {
    rules: {
      // Disable ref access rules for complex tooltip/dropdown patterns
      "react-hooks/refs": "off",
      "react-hooks/immutability": "off",
      // Disable static-components until SearchFilters is refactored
      "react-hooks/static-components": "off",
    }
  }
]);

export default eslintConfig;

