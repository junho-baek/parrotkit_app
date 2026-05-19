#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const { spawn } = require("child_process");

const repoRoot = path.resolve(__dirname, "..");
const serviceDir = path.join(repoRoot, "services", "reference-api");
const args = process.argv.slice(2);
const printConfigOnly = args.includes("--print-config");
const envPathArg = args.find((arg) => arg.startsWith("--env-file="));
const envFile = envPathArg
  ? path.resolve(process.cwd(), envPathArg.slice("--env-file=".length))
  : path.join(repoRoot, ".env.local");

function parseDotenv(content) {
  const parsed = {};

  for (const rawLine of content.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) {
      continue;
    }

    const equalsIndex = line.indexOf("=");
    if (equalsIndex === -1) {
      continue;
    }

    const key = line.slice(0, equalsIndex).trim();
    if (!/^[A-Za-z_][A-Za-z0-9_]*$/.test(key)) {
      continue;
    }

    let value = line.slice(equalsIndex + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    parsed[key] = value;
  }

  return parsed;
}

function loadEnvFile(filePath) {
  if (!fs.existsSync(filePath)) {
    throw new Error(`Missing env file: ${path.relative(repoRoot, filePath)}`);
  }

  return parseDotenv(fs.readFileSync(filePath, "utf8"));
}

function hasSuperDataKey(env) {
  return Boolean(
    env.SUPERDATA_API_KEY ||
      env.SUPADATA_API_KEY ||
      env.SUPADATA_API_TOKEN
  );
}

function printLaunchSummary(env) {
  console.log("Go reference API local launch");
  console.log(`- env file: ${path.relative(repoRoot, envFile)}`);
  console.log(`- command: go run ./cmd/reference-api`);
  console.log(`- cwd: ${path.relative(repoRoot, serviceDir)}`);
  console.log(`- port: ${env.PORT}`);
  console.log(`- dev unauth: ${env.PARROTKIT_ALLOW_DEV_UNAUTH}`);
  console.log(`- Super Data/Supadata key: ${hasSuperDataKey(env) ? "present" : "missing"}`);
  console.log(`- Replicate token: ${env.REPLICATE_API_TOKEN ? "present" : "missing"}`);
}

let fileEnv;
try {
  fileEnv = loadEnvFile(envFile);
} catch (error) {
  console.error(error.message);
  process.exit(1);
}

const env = {
  ...fileEnv,
  ...process.env,
};

env.PORT = env.PORT || "8787";
env.PARROTKIT_ALLOW_DEV_UNAUTH = "true";

printLaunchSummary(env);

const missing = [];
if (!hasSuperDataKey(env)) {
  missing.push("SUPERDATA_API_KEY or SUPADATA_API_KEY");
}
if (!env.REPLICATE_API_TOKEN) {
  missing.push("REPLICATE_API_TOKEN");
}

if (missing.length > 0) {
  console.error(`Missing required server env: ${missing.join(", ")}`);
  process.exit(1);
}

if (printConfigOnly) {
  process.exit(0);
}

const go = spawn("go", ["run", "./cmd/reference-api"], {
  cwd: serviceDir,
  env,
  stdio: "inherit",
});

go.on("exit", (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
    return;
  }
  process.exit(code ?? 0);
});

go.on("error", (error) => {
  console.error(`Failed to start Go reference API: ${error.message}`);
  process.exit(1);
});
