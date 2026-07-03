import fs from "fs";
import path from "path";
import sharp from "sharp";

const ARTICLES_DIR = "articles";
const VALID_EXTS = [".png", ".jpg", ".jpeg", ".webp"];

function findCovers(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      const hasMd = fs.readdirSync(fullPath).some(
        f => f.endsWith(".md")
      );
      if (hasMd) {
        for (const ext of VALID_EXTS) {
          const coverPath = path.join(fullPath, `cover${ext}`);
          if (fs.existsSync(coverPath)) {
            return { path: coverPath, dir: dir };
          }
        }
      } else {
        const found = findCovers(fullPath);
        if (found) return found;
      }
    }
  }
  return null;
}

function walkAllCovers(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const covers = [];
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      const subFiles = fs.readdirSync(fullPath);
      const hasMd = subFiles.some(f => f.endsWith(".md"));
      if (hasMd) {
        for (const ext of VALID_EXTS) {
          const coverPath = path.join(fullPath, `cover${ext}`);
          if (fs.existsSync(coverPath)) {
            covers.push(coverPath);
          }
        }
      } else {
        covers.push(...walkAllCovers(fullPath));
      }
    }
  }
  return covers;
}

async function compress(coverPath) {
  const input = sharp(coverPath);
  const meta = await input.metadata();

  let resizeOpts = {};
  if (meta.width > 1200) {
    resizeOpts = { width: 1200 };
  }

  const tmpPath = coverPath + ".tmp.webp";

  await input
    .resize(resizeOpts)
    .webp({ quality: 80 })
    .toFile(tmpPath);

  const inSize = fs.statSync(coverPath).size;
  const outSize = fs.statSync(tmpPath).size;

  if (outSize < inSize) {
    fs.unlinkSync(coverPath);
    fs.renameSync(tmpPath, coverPath.replace(/\.\w+$/, ".webp"));
    console.log(
      `  Compressed: ${path.relative(ARTICLES_DIR, coverPath)} (${formatSize(inSize)} → ${formatSize(outSize)})`
    );
  } else {
    fs.unlinkSync(tmpPath);
    console.log(
      `  Skipped (already optimal): ${path.relative(ARTICLES_DIR, coverPath)}`
    );
  }
}

function formatSize(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

const covers = walkAllCovers(ARTICLES_DIR);

if (covers.length === 0) {
  console.log("No cover images found.");
  process.exit(0);
}

console.log(`Found ${covers.length} cover image(s):\n`);

for (const cover of covers) {
  console.log(`  ${path.relative(ARTICLES_DIR, cover)}`);
}

console.log("\nCompressing...\n");

const results = await Promise.allSettled(covers.map(compress));

const failed = results.filter(r => r.status === "rejected");
if (failed.length > 0) {
  console.error(`\n${failed.length} failure(s):`);
  for (const f of failed) {
    console.error(`  ${f.reason}`);
  }
  process.exit(1);
}

console.log("\nDone.");
