import fs from "fs";
import path from "path";
import matter from "gray-matter";

const ARTICLES_DIR = "articles";
const COVER_EXTS = [".webp", ".png", ".jpg", ".jpeg"];

export type ArticleMeta = {
  slug: string;
  category: string;
  title: string;
  date: string;
  description: string;
  tags: string[];
  locales: string[];
  cover: string | null;
};

function hasContent(filePath: string): boolean {
  try {
    const raw = fs.readFileSync(filePath, "utf-8").trim();
    if (!raw) return false;
    const { data, content } = matter(raw);
    return !!((data && Object.keys(data).length > 0) || content.length > 0);
  } catch {
    return false;
  }
}

function detectCover(dir: string): string | null {
  for (const ext of COVER_EXTS) {
    const coverPath = path.join(dir, `cover${ext}`);
    if (fs.existsSync(coverPath)) return coverPath;
  }
  return null;
}

function walkArticles(dir: string, category: string | null): ArticleMeta[] {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const results: ArticleMeta[] = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      const subFiles = fs.readdirSync(fullPath);
      const hasEn = subFiles.includes("en.md");
      const hasFr = subFiles.includes("fr.md");

      if (hasEn) {
        const enPath = path.join(fullPath, "en.md");
        const { data } = matter(fs.readFileSync(enPath, "utf-8"));
        const locales: string[] = ["en"];
        if (hasFr && hasContent(path.join(fullPath, "fr.md"))) {
          locales.push("fr");
        }
        results.push({
          slug: entry.name,
          category: category || "",
          title: data.title || entry.name,
          date: data.date || "",
          description: data.metaDesc || data.description || "",
          tags: data.tags || [],
          locales,
          cover: detectCover(fullPath),
        });
      } else {
        results.push(...walkArticles(fullPath, entry.name));
      }
    } else if (entry.name.endsWith(".md")) {
      const { data } = matter(fs.readFileSync(fullPath, "utf-8"));
      results.push({
        slug: entry.name.replace(".md", ""),
        category: category || "",
        title: data.title || entry.name.replace(".md", ""),
        date: data.date || "",
        description: data.metaDesc || data.description || "",
        tags: data.tags || [],
        locales: ["en"],
        cover: detectCover(dir),
      });
    }
  }

  return results;
}

function parseTags(tags: unknown): string[] {
  if (!Array.isArray(tags)) return [];
  return tags.flatMap(t => {
    if (typeof t !== "string") return [];
    return t.split(",").map(s => s.trim()).filter(Boolean);
  });
}

export function getAllArticles(): ArticleMeta[] {
  if (!fs.existsSync(ARTICLES_DIR)) return [];
  const articles = walkArticles(ARTICLES_DIR, null);
  for (const a of articles) {
    a.tags = parseTags(a.tags);
  }
  articles.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  syncCovers(articles);
  return articles;
}

function syncCovers(articles: ArticleMeta[]): void {
  const outDir = "public/images/covers";
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }
  for (const a of articles) {
    if (!a.cover) continue;
    const ext = path.extname(a.cover);
    const dest = path.join(outDir, `${a.slug}${ext}`);
    try {
      fs.copyFileSync(a.cover, dest);
      a.cover = `/images/covers/${a.slug}${ext}`;
    } catch {
      a.cover = null;
    }
  }
}

export function resolveCoverPath(slug: string): string | null {
  for (const ext of COVER_EXTS) {
    const p = `public/images/covers/${slug}${ext}`;
    if (fs.existsSync(p)) return `/images/covers/${slug}${ext}`;
  }
  return null;
}

export function resolveArticlePath(slug: string, locale: string): string | null {
  const entries = fs.readdirSync(ARTICLES_DIR, { withFileTypes: true });

  function search(dir: string): string | null {
    const dirEntries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of dirEntries) {
      const fullPath = path.join(dir, entry.name);

      if (entry.isDirectory()) {
        if (entry.name === slug) {
          const localeFile = path.join(fullPath, `${locale}.md`);
          if (hasContent(localeFile)) return localeFile;
          const enFile = path.join(fullPath, "en.md");
          if (hasContent(enFile)) return enFile;
          return null;
        }
        const found = search(fullPath);
        if (found) return found;
      } else if (entry.name.endsWith(".md")) {
        const fileSlug = entry.name.replace(".md", "");
        if (fileSlug === slug) return fullPath;
      }
    }

    return null;
  }

  return search(ARTICLES_DIR);
}
