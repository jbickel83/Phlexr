const { spawn } = require("child_process");

const args = process.argv.slice(2);
const env = { ...process.env, EXPO_NO_TELEMETRY: "1" };

if (process.platform === "win32") {
  env.HOME = process.cwd();
  env.USERPROFILE = process.cwd();
}

if (args.includes("--web")) {
  env.BROWSER = "none";
}

let cliPath;

try {
  cliPath = require.resolve("@expo/cli/bin/cli");
} catch (error) {
  cliPath = require.resolve("expo/bin/cli");
}

const child = spawn(process.execPath, [cliPath, ...args], {
  stdio: "inherit",
  env,
});

child.on("exit", (code) => {
  process.exit(code ?? 0);
});
