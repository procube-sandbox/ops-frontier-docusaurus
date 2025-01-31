#!/usr/bin/env node

import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname } from "node:path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const OPS_FRONTIER_DOCUSAURUS_PATH =
  process.env.OPS_FRONTIER_DOCUSAURUS_PATH || process.cwd();
process.env.OPS_FRONTIER_DOCUSAURUS_PATH = OPS_FRONTIER_DOCUSAURUS_PATH;

const p = spawn("npx", ["docusaurus", ...process.argv.slice(2)], {
  stdio: "inherit",
  cwd: __dirname,
});
p.on("close", (code) => process.exit(code));
