#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const { spawnSync } = require("child_process");

const repoRoot = path.resolve(__dirname, "..");
const serviceDir = path.join(repoRoot, "services", "reference-api");
const args = process.argv.slice(2);
const outputArg = args.find((arg) => arg.startsWith("--output="));
const outputFlagIndex = args.findIndex((arg) => arg === "--output");
const outputPath = path.resolve(
  repoRoot,
  outputArg
    ? outputArg.slice("--output=".length)
    : outputFlagIndex >= 0 && args[outputFlagIndex + 1]
      ? args[outputFlagIndex + 1]
      : "output/reference-api/issue-33-live-smoke-gate.json",
);
const envFile = path.join(repoRoot, ".env.local");
const referenceUrl = "https://youtube.com/shorts/ySDpL4wUX7Y?si=mSIY3VG1KRWiLaaH";

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

function loadFileEnv() {
  if (!fs.existsSync(envFile)) {
    return {};
  }
  return parseDotenv(fs.readFileSync(envFile, "utf8"));
}

function hasSuperDataKey(env) {
  return Boolean(
    env.SUPERDATA_API_KEY ||
      env.SUPADATA_API_KEY ||
      env.SUPADATA_API_TOKEN
  );
}

function referenceModelProvider(env) {
  return String(env.REFERENCE_MODEL_PROVIDER || "replicate").trim().toLowerCase() || "replicate";
}

function missingPrerequisites(env) {
  const missing = [];
  if (!hasSuperDataKey(env)) {
    missing.push("SUPERDATA_API_KEY or SUPADATA_API_KEY or SUPADATA_API_TOKEN");
  }
  if (referenceModelProvider(env) !== "replicate") {
    missing.push("REFERENCE_MODEL_PROVIDER=replicate because issue #33 live smoke is wired to the Replicate provider");
  }
  if (referenceModelProvider(env) === "replicate" && !env.REPLICATE_API_TOKEN) {
    missing.push("REPLICATE_API_TOKEN");
  }
  return missing;
}

function printEnvSummary(env, fileEnv) {
  console.log("Issue #33 reference API smoke");
  console.log(`- env file: ${fs.existsSync(envFile) ? ".env.local present" : ".env.local missing"}`);
  console.log(`- env file keys loaded: ${Object.keys(fileEnv).length}`);
  console.log(`- Super Data/Supadata key: ${hasSuperDataKey(env) ? "present" : "missing"}`);
  console.log(`- reference model provider: ${referenceModelProvider(env)}`);
  console.log(`- Replicate token: ${env.REPLICATE_API_TOKEN ? "present" : "missing"}`);
}

function run(command, commandArgs, options = {}) {
  const result = spawnSync(command, commandArgs, {
    cwd: options.cwd || repoRoot,
    env: options.env || process.env,
    stdio: "inherit",
  });
  if (result.error) {
    throw result.error;
  }
  return result.status ?? 1;
}

function writeJSON(filePath, payload) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, `${JSON.stringify(payload, null, 2)}\n`);
}

function missingEnvArtifact(missing, fixtureCommand) {
  return {
    issue: "33",
    statusClassification: "partial_ready",
    ranAt: new Date().toISOString(),
    referenceUrl,
    fixture2: {
      command: fixtureCommand,
      passed: true,
    },
    liveSmoke: {
      ran: false,
      reason: "missing_env",
      missingPrerequisites: missing,
    },
  };
}

const fileEnv = loadFileEnv();
const env = {
  ...fileEnv,
  ...process.env,
};

printEnvSummary(env, fileEnv);

const fixtureCommand = "GOCACHE=/private/tmp/parrotkit-go-build-cache go test ./internal/analysis -run TestIssue33Fixture2TimestampMappingAndVariants -count=1";
const fixtureStatus = run(
  "go",
  ["test", "./internal/analysis", "-run", "TestIssue33Fixture2TimestampMappingAndVariants", "-count=1"],
  {
    cwd: serviceDir,
    env: {
      ...env,
      GOCACHE: env.GOCACHE || "/private/tmp/parrotkit-go-build-cache",
    },
  },
);
if (fixtureStatus !== 0) {
  writeJSON(outputPath, {
    issue: "33",
    statusClassification: "failed",
    ranAt: new Date().toISOString(),
    referenceUrl,
    fixture2: {
      command: fixtureCommand,
      passed: false,
    },
    liveSmoke: {
      ran: false,
      reason: "fixture_2_failed",
    },
  });
  process.exit(fixtureStatus);
}

const missing = missingPrerequisites(env);
if (missing.length > 0) {
  writeJSON(outputPath, missingEnvArtifact(missing, fixtureCommand));
  console.log(`- live smoke: partial_ready; missing ${missing.join(", ")}`);
  console.log(`- artifact: ${path.relative(repoRoot, outputPath)}`);
  process.exit(0);
}

const liveStatus = run(
  "go",
  ["run", "./cmd/issue33-live-smoke", "--output", outputPath],
  {
    cwd: serviceDir,
    env: {
      ...env,
      GOCACHE: env.GOCACHE || "/private/tmp/parrotkit-go-build-cache",
    },
  },
);
console.log(`- artifact: ${path.relative(repoRoot, outputPath)}`);
process.exit(liveStatus);
