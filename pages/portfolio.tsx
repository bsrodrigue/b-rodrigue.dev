import React from "react";
import Head from "next/head";
import settings from "../settings";

const { portfolioProjects } = settings;

const categories = [
    { id: 'react', title: 'React & Next.js Projects', description: 'Modern web applications built with React and Next.js.' },
    { id: 'react-native', title: 'React Native Mobile Projects', description: 'Cross-platform mobile applications.' },
    { id: 'vanilla', title: 'Vanilla Projects', description: 'Foundational projects built with HTML, CSS, and JavaScript.' },
    { id: 'c', title: 'C/C++ Projects', description: 'Low-level programming and system tools.' },
];

const PortfolioPage: React.FC = () => {
    return (
        <>
            <Head>
                <title>Portfolio | BRodrigue</title>
            </Head>
            <section style={{ paddingTop: '4rem' }}>
                <div className="container">
                    <h1 style={{ textAlign: 'center' }}>My Portfolio</h1>
                    <p style={{ textAlign: 'center', maxWidth: '600px', margin: '0 auto 4rem auto', color: '#666' }}>
                        A collection of my work across different technologies and platforms.
                    </p>

                    {categories.map((category) => {
                        const projects = portfolioProjects.filter(p => p.stack === category.id);
                        if (projects.length === 0) return null;

                        return (
                            <div key={category.id} style={{ marginBottom: '4rem' }}>
                                <h2>{category.title}</h2>
                                <p style={{ marginBottom: '2rem', color: '#666' }}>{category.description}</p>
                                <div className="projects-grid">
                                    {projects.map((project, index) => (
                                        <div key={index} className="project-card">
                                            <img src={project.cover} alt={project.title} />
                                            <h3>{project.title}</h3>
                                            <p>{project.description}</p>
                                            <a href={project.link} target="_blank" rel="noreferrer">
                                                View Project &rarr;
                                            </a>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </section>
        </>
    );
};

export default PortfolioPage;
