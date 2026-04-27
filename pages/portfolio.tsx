import React from "react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import settings from "../settings";
import { getSiteLocale, siteContent } from "../lib/site-content";
import { PortfolioProject, ProjectKind, ProjectType } from "../interfaces";

const { portfolioProjects } = settings;

const PortfolioPage: React.FC = () => {
    const router = useRouter();
    const locale = getSiteLocale(router.locale);
    const t = siteContent[locale].portfolio;

    // Grouping logic
    const workProjects = portfolioProjects.filter(p => p.kind === "client" || p.kind === "employer");
    const personalProjects = portfolioProjects.filter(p => p.kind === "personal");

    const renderProjectLink = (project: PortfolioProject) => {
        if (project.link === "#") {
            return <span className="project-link disabled">{t.unavailable}</span>;
        }

        if (project.linkType === "internal") {
            return (
                <Link href={project.link} className="project-link">
                    {t.ctaInternal}
                </Link>
            );
        }

        return (
            <a href={project.link} target="_blank" rel="noreferrer" className="project-link">
                {t.ctaExternal}
            </a>
        );
    };

    const getTypeLabel = (type: ProjectType) => {
        switch (type) {
            case "application": return t.typeApplication;
            case "website": return t.typeWebsite;
            case "game": return t.typeGame;
            case "cli": return t.typeCli;
            default: return type;
        }
    };

    const getKindLabel = (kind: ProjectKind) => {
        switch (kind) {
            case "client": return t.kindClient;
            case "employer": return t.kindEmployer;
            default: return "";
        }
    };

    const renderProjectsByType = (projects: PortfolioProject[]) => {
        const byType = projects.reduce((acc, p) => {
            if (!acc[p.type]) acc[p.type] = [];
            acc[p.type].push(p);
            return acc;
        }, {} as Record<ProjectType, PortfolioProject[]>);

        return (Object.keys(byType) as ProjectType[]).map(type => (
            <div key={type} className="type-group">
                <h3 className="type-title">{getTypeLabel(type)}</h3>
                <div className="projects-grid">
                    {byType[type].map((project, index) => (
                        <article 
                            key={`${project.title}-${index}`} 
                            className={`project-card ${project.type === 'cli' ? 'cli-card' : ''}`}
                        >
                            {project.cover && (
                                <div className="project-cover-wrapper">
                                    <img src={project.cover} alt={project.title} loading="lazy" />
                                </div>
                            )}
                            <div className="project-content">
                                <div className="project-header">
                                    <h4>{project.title}</h4>
                                    {(project.kind === 'client' || project.kind === 'employer') && (
                                        <span className="kind-badge">{getKindLabel(project.kind)}</span>
                                    )}
                                </div>
                                <p>{project.description[locale]}</p>
                                {renderProjectLink(project)}
                            </div>
                        </article>
                    ))}
                </div>
            </div>
        ));
    };

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
                    <div className="portfolio-section">
                        <h2 className="section-title">{t.clientTitle}</h2>
                        <p className="section-intro">{t.clientDescription}</p>
                        {renderProjectsByType(workProjects)}
                    </div>

                    <div className="portfolio-section">
                        <h2 className="section-title">{t.personalTitle}</h2>
                        <p className="section-intro">{t.personalDescription}</p>
                        {renderProjectsByType(personalProjects)}
                    </div>
                </div>
            </section>
        </>
    );
};

export default PortfolioPage;
