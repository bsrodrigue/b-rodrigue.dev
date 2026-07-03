import React, { useState, useMemo, useCallback } from "react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { getSiteLocale, siteContent } from "../lib/site-content";
import { getAllArticles } from "../lib/articles";

type TagCount = { name: string; count: number };

function getTagCounts(articles: { tags: string[] }[]): TagCount[] {
  const counts: Record<string, number> = {};
  for (const a of articles) {
    for (const tag of a.tags || []) {
      counts[tag] = (counts[tag] || 0) + 1;
    }
  }
  return Object.entries(counts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
}

export default function Blog({ articles }) {
  const router = useRouter();
  const locale = getSiteLocale(router.locale);
  const t = siteContent[locale].blog;

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  const tagCounts = useMemo(() => getTagCounts(articles), [articles]);

  const filteredArticles = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return articles.filter(a => {
      if (selectedTag && !(a.tags || []).includes(selectedTag)) return false;
      if (!q) return true;
      const title = a.title?.toLowerCase() || "";
      const desc = a.description?.toLowerCase() || "";
      const tags = a.tags || [];
      const matchTags = tags.some(tag => tag.toLowerCase().includes(q));
      return title.includes(q) || desc.includes(q) || matchTags;
    });
  }, [articles, searchQuery, selectedTag]);

  const handleTagClick = useCallback((tag: string) => {
    setSelectedTag(prev => prev === tag ? null : tag);
  }, []);

  const clearFilters = useCallback(() => {
    setSelectedTag(null);
    setSearchQuery("");
  }, []);

  const hasActiveFilters = selectedTag !== null || searchQuery.trim().length > 0;

  return (
    <>
      <Head>
        <title>{t.title}</title>
        <meta name="description" content={t.description} />
      </Head>

      <section className="hero">
        <div className="container">
          <h1 className="profile-name">{t.heroTitle}</h1>
          <p className="profile-title">{t.heroSubtitle}</p>
        </div>
      </section>

      <section>
        <div className="container">
          <div className="search-wrapper">
             <input 
               type="text" 
               className="search-input" 
               placeholder={t.searchPlaceholder}
               value={searchQuery}
               onChange={(e) => setSearchQuery(e.target.value)}
             />
          </div>

          <div className="tag-filters">
            {tagCounts.map(({ name, count }) => (
              <button
                key={name}
                className={`tag-filter${selectedTag === name ? " active" : ""}`}
                onClick={() => handleTagClick(name)}
              >
                {name}
                <span className="tag-count">{count}</span>
              </button>
            ))}
          </div>

          <h2 className="section-title">
            {selectedTag ? `"${selectedTag}"` : t.recentTitle}
            <span className="article-count">{filteredArticles.length}</span>
          </h2>

          {hasActiveFilters && (
            <p className="filter-hint">
              {t.filteredBy}
              {selectedTag && <> <strong>{selectedTag}</strong></>}
              {searchQuery.trim() && <> "{searchQuery.trim()}"</>}
              {" — "}
              <button className="clear-filter" onClick={clearFilters}>{t.clearFilters}</button>
            </p>
          )}

          {filteredArticles.length === 0 ? (
             <p className="no-results">{t.noResults}</p>
          ) : (
            <div className="blog-list">
              {filteredArticles.map((article) => (
                <article key={article.slug} className="blog-item">
                  {article.cover ? (
                    <Link href={`/articles/${article.slug}`} className="blog-card-cover">
                      <img src={article.cover} alt="" loading="lazy" />
                    </Link>
                  ) : (
                    <div className="blog-card-placeholder">
                      {article.category || "article"}
                    </div>
                  )}
                  <div className="blog-card-body">
                    {article.category && <div className="blog-category">{article.category}</div>}
                    <Link href={`/articles/${article.slug}`}>
                      <h2>{article.title}</h2>
                    </Link>
                    <div className="blog-date">{article.date}</div>
                    <p>{article.description}</p>
                    <div className="blog-card-footer">
                      {article.tags && article.tags.length > 0 && (
                        <div className="article-tags">
                          {article.tags.map(tag => (
                            <button
                              key={tag}
                              className={`article-tag${selectedTag === tag ? " active" : ""}`}
                              onClick={() => handleTagClick(tag)}
                            >
                              {tag}
                            </button>
                          ))}
                        </div>
                      )}
                      <Link href={`/articles/${article.slug}`} className="read-more">
                        {t.readMore}
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}

export async function getStaticProps() {
  const articles = getAllArticles();

  return {
    props: {
      articles,
    },
  };
}
