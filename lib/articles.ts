import fs from "fs";
import path from "path";
import matter from "gray-matter";

const ARTICLES_DIR = "articles";

export type ArticleMeta = {
  slug: string;
  category: string;
  title: string;
  date: string;
  description: string;
  tags: string[];
  locales: string[];
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
      });
    }
  }

  return results;
}

export function getAllArticles(): ArticleMeta[] {
  if (!fs.existsSync(ARTICLES_DIR)) return [];
  return walkArticles(ARTICLES_DIR, null);
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
