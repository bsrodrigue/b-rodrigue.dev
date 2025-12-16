import React from "react";
import Head from "next/head";
import Link from "next/link";
import fs from "fs";
import matter from "gray-matter";

export default function Blog({ articles }) {
  return (
    <>
      <Head>
        <title>Blog | BRodrigue</title>
      </Head>
      <section style={{ paddingTop: '4rem' }}>
        <div className="container">
          <h1 style={{ textAlign: 'center', marginBottom: '3rem' }}>Blog</h1>
          <div className="blog-list">
            {articles.map((article) => (
              <div key={article.slug} className="blog-item">
                <Link href={`/articles/${article.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                  <h2 style={{ cursor: 'pointer', color: '#0070f3' }}>{article.frontmatter.title}</h2>
                </Link>
                <div className="blog-date">{article.frontmatter.date}</div>
                <p>{article.frontmatter.description}</p>
                <Link href={`/articles/${article.slug}`}>Read more &rarr;</Link>
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
