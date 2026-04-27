import React, { useState, useMemo } from "react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import fs from "fs";
import matter from "gray-matter";
import { getSiteLocale, siteContent } from "../lib/site-content";

export default function Blog({ articles }) {
  const router = useRouter();
  const locale = getSiteLocale(router.locale);
  const t = siteContent[locale].blog;

  const [searchQuery, setSearchQuery] = useState("");

  const filteredArticles = useMemo(() => {
    if (!searchQuery) return articles;
    const q = searchQuery.toLowerCase();
    return articles.filter(a => {
      const title = a.frontmatter.title?.toLowerCase() || "";
      const desc = a.frontmatter.metaDesc?.toLowerCase() || a.frontmatter.description?.toLowerCase() || "";
      const tags = a.frontmatter.tags || [];
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
                    <h2>{article.frontmatter.title}</h2>
                  </Link>
                  <div className="blog-date">{article.frontmatter.date}</div>
                  <p>{article.frontmatter.metaDesc || article.frontmatter.description}</p>
                  
                  {article.frontmatter.tags && (
                    <div className="article-tags">
                      {article.frontmatter.tags.map(tag => (
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
  const files = fs.readdirSync('articles');

  const articles = files.map((fileName) => {
    const slug = fileName.replace('.md', '');
    const readFile = fs.readFileSync(`articles/${fileName}`, 'utf-8');
    const { data: frontmatter } = matter(readFile);

    return {
      slug,
      frontmatter,
    };
  });

  return {
    props: {
      articles,
    },
  };
}
