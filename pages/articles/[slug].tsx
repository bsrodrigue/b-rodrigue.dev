import fs from 'fs';
import matter from 'gray-matter';
import md from 'markdown-it';
import hljs from 'highlight.js';
import Head from 'next/head';
import Link from 'next/link';
import { getAllArticles, resolveArticlePath, resolveCoverPath } from '../../lib/articles';
import { getSiteLocale, siteContent } from '../../lib/site-content';

const mdRenderer = md({
  highlight: function (str, lang) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return `<pre><code class="hljs language-${lang}">${hljs.highlight(str, { language: lang, ignoreIllegals: true }).value}</code></pre>`;
      } catch {}
    }
    return `<pre><code class="hljs">${md.utils.escapeHtml(str)}</code></pre>`;
  },
});

export async function getStaticPaths({ locales }) {
    const articles = getAllArticles();

    const paths = articles.flatMap((article) =>
        (locales || ['en']).flatMap((l) => ({
            params: { slug: article.slug },
            locale: l,
        }))
    );

    return {
        paths,
        fallback: false,
    }
}

export async function getStaticProps({ params: { slug }, locale }) {
    const filePath = resolveArticlePath(slug, locale || 'en');

    if (!filePath) {
        return { notFound: true };
    }

    const raw = fs.readFileSync(filePath, 'utf-8');
    const { data: frontmatter, content } = matter(raw);
    const cover = resolveCoverPath(slug);
    return {
        props: {
            frontmatter,
            content,
            cover,
            locale: locale || 'en',
        },
    };
}

export default function Article({ frontmatter, content, cover, locale }) {
    const currentLocale = getSiteLocale(locale);
    const t = siteContent[currentLocale].article;

    const tags: string[] = (frontmatter.tags || []).flatMap(t =>
        typeof t === "string" ? t.split(",").map(s => s.trim()).filter(Boolean) : []
    );

    return (
        <>
            <Head>
                <title>{frontmatter.title} | Rachid Rodrigue BADINI</title>
                <meta name="description" content={frontmatter.description} />
            </Head>
            <article className="markdown-content">
                <div className="reading-content">
                    <p style={{ marginBottom: '1rem' }}>
                        <Link href="/blog">{t.backToBlog}</Link>
                    </p>
                    {cover && (
                        <img src={cover} alt="" className="article-cover" />
                    )}
                    <h1>{frontmatter.title}</h1>
                    <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>{frontmatter.date}</p>
                    {tags.length > 0 && (
                        <div className="article-tags" style={{ marginBottom: '2rem' }}>
                            {tags.map(tag => (
                                <span key={tag} className="article-tag">{tag}</span>
                            ))}
                        </div>
                    )}
                    <div
                        dangerouslySetInnerHTML={{ __html: mdRenderer.render(content) }}
                    />
                </div>
            </article>
        </>
    );
}
