import React from "react";
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
          <h2 className="section-title">{t.recentTitle}</h2>
          <div className="blog-list">
            {articles.map((article) => (
              <div key={article.slug} className="blog-item">
                <Link href={`/articles/${article.slug}`} style={{ textDecoration: 'none' }}>
                  <h2>{article.frontmatter.title}</h2>
                </Link>
                <div className="blog-date">{article.frontmatter.date}</div>
                <p>{article.frontmatter.description}</p>
                <Link href={`/articles/${article.slug}`}>{t.readMore}</Link>
              </div>
            ))}
          </div>
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
