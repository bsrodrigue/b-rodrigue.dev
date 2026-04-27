import fs from 'fs';
import matter from 'gray-matter';
import md from 'markdown-it';
import Head from 'next/head';
import Link from 'next/link';
import { getSiteLocale, siteContent } from '../../lib/site-content';

export async function getStaticPaths({ locales }) {
    const files = fs.readdirSync('articles');

    const paths = files.flatMap((fileName) =>
        (locales || ['en']).map((locale) => ({
            params: {
                slug: fileName.replace('.md', ''),
            },
            locale,
        }))
    );

    return {
        paths,
        fallback: false,
    }
}

export async function getStaticProps({ params: { slug }, locale }) {
    const fileName = fs.readFileSync(`articles/${slug}.md`, 'utf-8');
    const { data: frontmatter, content } = matter(fileName);
    return {
        props: {
            frontmatter,
            content,
            locale: locale || 'en',
        },
    };
}

export default function Article({ frontmatter, content, locale }) {
    const currentLocale = getSiteLocale(locale);
    const t = siteContent[currentLocale].article;

    return (
        <>
            <Head>
                <title>{frontmatter.title} | Rachid Rodrigue BADINI</title>
                <meta name="description" content={frontmatter.description} />
            </Head>
            <article className="markdown-content">
                <p style={{ marginBottom: '1rem' }}>
                    <Link href="/blog">{t.backToBlog}</Link>
                </p>
                <h1>{frontmatter.title}</h1>
                <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>{frontmatter.date}</p>
                <div
                    dangerouslySetInnerHTML={{ __html: md().render(content) }}
                />
            </article>
        </>
    );
}
