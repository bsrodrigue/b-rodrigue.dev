import fs from 'fs';
import matter from 'gray-matter';
import md from 'markdown-it';
import Head from 'next/head';

export async function getStaticPaths() {
    const files = fs.readdirSync('articles');

    const paths = files.map((fileName) => ({
        params: {
            slug: fileName.replace('.md', ''),
        },
    }));

    return {
        paths,
        fallback: false,
    }
}

export async function getStaticProps({ params: { slug } }) {
    const fileName = fs.readFileSync(`articles/${slug}.md`, 'utf-8');
    const { data: frontmatter, content } = matter(fileName);
    return {
        props: {
            frontmatter,
            content,
        },
    };
}

export default function Article({ frontmatter, content }) {
    return (
        <>
            <Head>
                <title>{frontmatter.title} | BRodrigue</title>
            </Head>
            <section style={{ paddingTop: '4rem' }}>
                <div className="container" style={{ maxWidth: '800px' }}>
                    <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>{frontmatter.title}</h1>
                    <p style={{ color: '#666', marginBottom: '2rem' }}>{frontmatter.date}</p>
                    <div
                        className="markdown-content"
                        dangerouslySetInnerHTML={{ __html: md().render(content) }}
                    />
                </div>
            </section>
        </>
    );
}