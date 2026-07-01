import React, { useState, useMemo } from "react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { getSiteLocale, siteContent } from "../lib/site-content";
import { getAllArticles } from "../lib/articles";

export default function Blog({ articles }) {
  const router = useRouter();
  const locale = getSiteLocale(router.locale);
  const t = siteContent[locale].blog;

  const [searchQuery, setSearchQuery] = useState("");

  const filteredArticles = useMemo(() => {
    if (!searchQuery) return articles;
    const q = searchQuery.toLowerCase();
    return articles.filter(a => {
      const title = a.title?.toLowerCase() || "";
      const desc = a.description?.toLowerCase() || "";
      const tags = a.tags || [];
      const matchTags = tags.some(tag => tag.toLowerCase().includes(q));
      return title.includes(q) || desc.includes(q) || matchTags;
    });
  }, [articles, searchQuery]);

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

          <h2 className="section-title">{t.recentTitle}</h2>

          {filteredArticles.length === 0 ? (
             <p className="no-results">{t.noResults}</p>
          ) : (
            <div className="blog-list">
              {filteredArticles.map((article) => (
                <article key={article.slug} className="blog-item">
                  <Link href={`/articles/${article.slug}`} style={{ textDecoration: 'none' }}>
                    <h2>{article.title}</h2>
                  </Link>
                  <div className="blog-date">{article.date}</div>
                  {article.category && <div className="blog-category">{article.category}</div>}
                  <p>{article.description}</p>
                  
                  {article.tags && article.tags.length > 0 && (
                    <div className="article-tags">
                      {article.tags.map(tag => (
                        <span key={tag} className="article-tag">#{tag}</span>
                      ))}
                    </div>
                  )}

                  <Link href={`/articles/${article.slug}`}>{t.readMore}</Link>
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
