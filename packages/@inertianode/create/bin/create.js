#! /usr/bin/env node
import { spawn } from "child_process";

const child = spawn("npx", ["create-inertianode", ...process.argv.slice(2)], {
  stdio: "inherit",
});

child.on("close", (code) => {
  process.exit(code);
});
