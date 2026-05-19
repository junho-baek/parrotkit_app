#!/usr/bin/env node

const fs = require("fs");
const os = require("os");
const path = require("path");
const { spawn } = require("child_process");

const appDir = path.resolve(__dirname, "..");
const args = process.argv.slice(2);
const printConfigOnly = args.includes("--print-config");
const expoArgs = args.filter((arg) => arg !== "--print-config");

function firstLanAddress() {
  const interfaces = os.networkInterfaces();
  const preferredNames = ["en0", "en1", "Wi-Fi", "Ethernet"];
  const entries = [];

  for (const [name, addresses] of Object.entries(interfaces)) {
    for (const address of addresses || []) {
      if (
        address.family === "IPv4" &&
        !address.internal &&
        !address.address.startsWith("169.254.")
      ) {
        entries.push({ name, address: address.address });
      }
    }
  }

  for (const preferredName of preferredNames) {
    const match = entries.find((entry) => entry.name === preferredName);
    if (match) {
      return match.address;
    }
  }

  return entries[0]?.address || "";
}

function buildApiUrl() {
  const configuredUrl = process.env.EXPO_PUBLIC_PARROTKIT_API_URL?.trim();
  const configuredHost = process.env.PARROTKIT_LAN_IP?.trim();
  const host = configuredHost || firstLanAddress();
  const port = process.env.PARROTKIT_REFERENCE_API_PORT?.trim() || "8787";

  if (configuredUrl) {
    return configuredUrl.replace(/\/+$/, "");
  }

  if (!host) {
    throw new Error(
      "Could not detect a LAN IP. Set PARROTKIT_LAN_IP to your Mac LAN IP, for example PARROTKIT_LAN_IP=192.168.0.10."
    );
  }

  if (/^https?:\/\//.test(host)) {
    return host.replace(/\/+$/, "");
  }

  return `http://${host}:${port}`;
}

function assertReferenceApiUrl(apiUrl) {
  let parsed;
  try {
    parsed = new URL(apiUrl);
  } catch {
    throw new Error(`Invalid EXPO_PUBLIC_PARROTKIT_API_URL: ${apiUrl}`);
  }

  if (parsed.port === "3000") {
    throw new Error(
      "Refusing to start Expo with port 3000. Reference analysis must point at the Go API on port 8787."
    );
  }

  if (parsed.port !== "8787") {
    console.warn(
      `Warning: API URL is using port ${parsed.port || "(default)"}. Local reference analysis normally uses port 8787.`
    );
  }
}

function expoCommand() {
  const localExpo = path.join(
    appDir,
    "node_modules",
    ".bin",
    process.platform === "win32" ? "expo.cmd" : "expo"
  );

  if (fs.existsSync(localExpo)) {
    return { command: localExpo, args: ["start", "--dev-client", "--lan", ...expoArgs] };
  }

  return { command: "npx", args: ["expo", "start", "--dev-client", "--lan", ...expoArgs] };
}

let apiUrl;
try {
  apiUrl = buildApiUrl();
  assertReferenceApiUrl(apiUrl);
} catch (error) {
  console.error(error.message);
  process.exit(1);
}

const env = {
  ...process.env,
  EXPO_PUBLIC_PARROTKIT_API_URL: apiUrl,
};

const { command, args: commandArgs } = expoCommand();

console.log("Expo reference-analysis LAN launch");
console.log(`- EXPO_PUBLIC_PARROTKIT_API_URL=${apiUrl}`);
console.log(`- command: ${path.basename(command)} ${commandArgs.join(" ")}`);

if (printConfigOnly) {
  process.exit(0);
}

const expo = spawn(command, commandArgs, {
  cwd: appDir,
  env,
  stdio: "inherit",
});

expo.on("exit", (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
    return;
  }
  process.exit(code ?? 0);
});

expo.on("error", (error) => {
  console.error(`Failed to start Expo: ${error.message}`);
  process.exit(1);
});
