#! /usr/bin/env node
import path from "path";
import * as fs from "fs/promises";
import prompts from "prompts";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

const packageName = "create-inertianode";

const copyFiles = async (from, to, moreAllowedDirs = []) => {
  await fs.cp(from, to, {
    recursive: true,
    filter: (src) => {
      const disAllowedDirs = [
        "node_modules",
        "dist",
        "build",
        "scripts",
        ...moreAllowedDirs,
      ];

      const check = src.split(packageName).pop().split("/");

      return !check?.some((dir) => disAllowedDirs.includes(dir));
    },
  });
};

(async () => {
  // Get the name
  const { value: projectName } = await prompts({
    type: "text",
    name: "value",
    message: "Enter the project name",
  });

  if (!projectName) {
    console.log("Project name is required.");
    process.exit(1);
  }

  const { value: serverType } = await prompts({
    type: "select",
    name: "value",
    message: "Choose a starter kit",
    choices: [
      {
        title: "Hono + Cloudflare Pages + TypeScript",
        value: "hono-cf-pages-ts",
      },
      {
        title: "Hono + Node + TypeScript",
        value: "hono-node-ts",
      },
      {
        title: "Express + TypeScript",
        value: "express-ts",
      },
      {
        title: "NestJS + TypeScript",
        value: "nestjs-ts",
      },
      {
        title: "Koa + TypeScript",
        value: "koa-ts",
      },
    ],
    initial: 0,
  });

  const { value: clientType } = await prompts({
    type: "select",
    name: "value",
    message: "Choose a client type",
    choices: [
      {
        title: "React + TypeScript",
        value: "react-ts",
      },
      {
        title: "Vue + TypeScript",
        value: "vue-ts",
      },
      {
        title: "Svelte + TypeScript",
        value: "svelte-ts",
      },
    ],
    initial: 0,
  });

  const currentDir = process.cwd();

  const projectPath = path.join(currentDir, projectName);

  try {
    // Check if the project already exists
    await fs.access(projectPath);
    console.log(`Directory \`${projectName}\` already exists.`);
    process.exit(1);
  } catch (error) {}

  console.log(`Creating project at \`${projectPath}\`...`);
  // Create the project directory
  await fs.mkdir(projectPath);

  const toProjectPath = await fs.realpath(projectPath);

  const isWindows = process.platform === "win32";
  let replacement = isWindows ? "file:///" : "file:";

  // Current Script dir
  const scriptDir = await fs.realpath(
    path.dirname(import.meta.url).replace(replacement, "")
  );

  // Copy the project files
  const fromBase = await fs.realpath(
    path.join(scriptDir, `..`, `stubs`, `base`)
  );

  // console.log("Copying project files from " + from + " to " + to);
  await copyFiles(fromBase, toProjectPath);

  // Copy the project files
  const fromServer = await fs.realpath(
    path.join(scriptDir, `..`, `stubs`, `${serverType}`)
  );
  await copyFiles(fromServer, toProjectPath);

  // Copy the client project files (excluding package.json which we'll merge)
  const fromClient = await fs.realpath(
    path.join(scriptDir, `..`, `stubs`, `${clientType}`)
  );
  await copyFiles(fromClient, toProjectPath, [
    "package-lock.json",
    "package.json",
  ]);

  // Merge package.json files
  // console.log("Merging package.json files...");
  const serverPackageJsonPath = path.join(projectPath, "package.json");
  const clientPackageJsonPath = path.join(fromClient, "package.json");

  try {
    // Read server package.json
    const serverPackageJson = JSON.parse(
      await fs.readFile(serverPackageJsonPath, "utf-8")
    );

    // Read client package.json if it exists
    let clientPackageJson = {};
    try {
      clientPackageJson = JSON.parse(
        await fs.readFile(clientPackageJsonPath, "utf-8")
      );
    } catch (err) {
      console.log("No client package.json found, skipping merge");
    }

    // Merge dependencies
    if (clientPackageJson.dependencies) {
      serverPackageJson.dependencies = {
        ...serverPackageJson.dependencies,
        ...clientPackageJson.dependencies,
      };
    }

    // Merge devDependencies
    if (clientPackageJson.devDependencies) {
      serverPackageJson.devDependencies = {
        ...serverPackageJson.devDependencies,
        ...clientPackageJson.devDependencies,
      };
    }

    // Merge scripts (client scripts take precedence for conflicts)
    if (clientPackageJson.scripts) {
      serverPackageJson.scripts = {
        ...serverPackageJson.scripts,
        ...clientPackageJson.scripts,
        // Preserve important server scripts
        "dev:server": serverPackageJson.scripts?.["dev:server"],
        "dev:server:debug": serverPackageJson.scripts?.["dev:server:debug"],
        "dev:client":
          serverPackageJson.scripts?.["dev:client"] ||
          clientPackageJson.scripts?.["dev"],
        dev: serverPackageJson.scripts?.["dev"],
        "dev:debug": serverPackageJson.scripts?.["dev:debug"],
      };
    }

    // Merge Overrides
    if (clientPackageJson.overrides) {
      serverPackageJson.overrides = {
        ...(serverPackageJson.overrides || {}),
        ...(clientPackageJson.overrides || {}),
      };
    }

    // Update the project name with the user's chosen name
    serverPackageJson.name = projectName;

    // Write the merged package.json
    await fs.writeFile(
      serverPackageJsonPath,
      JSON.stringify(serverPackageJson, null, 2)
    );

    // console.log("package.json files merged successfully");
  } catch (error) {
    console.error("Error merging package.json files:", error);
  }

  try {
    // Install the dependencies
    console.log("Installing dependencies...");
    await execAsync(`npm install`, {
      cwd: await fs.realpath(path.join(projectPath)),
    });

    console.log(" ✔ Dependencies installed successfully");
  } catch (error) {
    console.warn("Please install the dependencies manually");
    console.warn("cd " + projectPath);
    console.warn("npm install");
  }

  // Check for and run optional postinstall scripts
  const postinstallScripts = [
    {
      path: path.join(fromServer, "scripts", "postinstall.js"),
      type: "server",
    },
    {
      path: path.join(fromClient, "scripts", "postinstall.js"),
      type: "client",
    },
  ];

  for (const script of postinstallScripts) {
    try {
      await fs.access(script.path);

      // console.log(`Running ${script.type} postinstall script...`);
      await execAsync(`node "${script.path}" "${projectPath}"`, {
        cwd: projectPath,
      });

      // console.log(`${script.type} postinstall script completed successfully`);
    } catch (error) {
      // Postinstall scripts are optional, so we don't warn if they don't exist
      if (error.code !== "ENOENT") {
        console.warn(
          `${script.type} postinstall script failed:`,
          error.message
        );
      }
    }
  }

  // If React is selected, update server config to use App.tsx and enable reactRefresh
  if (clientType === "react-ts") {
    // Different file paths for different frameworks
    const configPaths = {
      "nestjs-ts": path.join(projectPath, "src", "app.module.ts"),
      default: path.join(projectPath, "server", "index.ts"),
    };

    const serverConfigPath = configPaths[serverType] || configPaths.default;

    try {
      let serverConfigContent = await fs.readFile(serverConfigPath, "utf-8");

      // Replace App.ts with App.tsx
      serverConfigContent = serverConfigContent.replace(
        /entrypoints:\s*\['client\/App\.ts'\]/g,
        "entrypoints: ['client/App.tsx']"
      );

      // Enable reactRefresh for vite options
      serverConfigContent = serverConfigContent.replace(
        /(vite:\s*\{[^}]*entrypoints:\s*\['client\/App\.tsx'\],?)/,
        `$1
    reactRefresh: true,
    `
      );

      await fs.writeFile(serverConfigPath, serverConfigContent);
    } catch (error) {
      console.warn("Could not update server config for React:", error.message);
    }
  }

  console.log(`Project created successfully at ${projectPath}`);
})();
