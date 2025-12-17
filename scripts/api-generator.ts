import type { ConfigFile } from "@rtk-query/codegen-openapi";
import dotenv from "dotenv";
import path from "path";

const index = 1;
const API_LIST = [
  {
    env: "API_EXTERNAL_URL",
    generatedFile: "externalBffApi",
  },
];

try {
  if (process.env.NODE_ENV !== "production") {
    dotenv.config({ path: path.join(__dirname, "../.env") });
  }
} catch {
  console.warn("⚠️ .env not found — using environment variables from system");
}

if (!process.env[API_LIST[index].env]) {
  throw new Error(
    `${API_LIST[index].env} is not defined in your environment variables`
  );
}

const config: ConfigFile = {
  apiFile: `../src/modules/redux/api/${API_LIST[index].generatedFile}.empty-api.ts`,
  apiImport: "emptyApi",
  exportName: API_LIST[index].generatedFile,
  hooks: { lazyQueries: true, mutations: true, queries: true },
  outputFile: `../src/modules/redux/api/generated/${API_LIST[index].generatedFile}.generated.ts`,
  schemaFile: `${process.env[API_LIST[index].env]}/docs-json/`,
};

export default config;
