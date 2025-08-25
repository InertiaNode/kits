const fs = require("fs");
const path = require("path");

// Get the base path from argv
const basePath = process.argv[2];

const serverIndexPath = path.join(basePath, "/server/index.ts");
const serverIndexContent = fs.readFileSync(serverIndexPath, "utf8");

const updatedServerIndexContent = serverIndexContent.replace(
  "app.use(inertiaExpressAdapter());",
  `app.use(inertiaExpressAdapter({
    vite: {
      buildDirectory: "build",
      manifestFilename: "manifest.json",
      publicDirectory: "public",
      hotFile: "hot",
      entrypoints: ["client/App.ts"],
    },
  }));`
);

fs.writeFileSync(serverIndexPath, updatedServerIndexContent);
