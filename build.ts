import { rm } from "node:fs/promises";

await rm("dist", { recursive: true, force: true });

const result = await Bun.build({
  entrypoints: ["./index.html"],
  outdir: "dist",
  minify: true,
  sourcemap: "linked",
  // GitHub Pages serves project sites from /<repo>/, so asset URLs must stay relative.
  publicPath: "./",
});

if (!result.success) {
  for (const log of result.logs) console.error(log);
  process.exit(1);
}
console.log(`built ${result.outputs.length} files to dist/`);
