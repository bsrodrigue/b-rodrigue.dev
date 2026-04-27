import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { getSiteLocale } from "../../lib/site-content";

const content = {
  en: {
    title: "Dreamproxy | Rachid Rodrigue BADINI",
    description: "Reverse proxy and static file server built from scratch in Go.",
    eyebrow: "Personal Project",
    headline: "Dreamproxy",
    intro:
      "A lightweight reverse proxy and static file server written from scratch in Go as an exploration of HTTP parsing, TCP handling, and production-minded server design.",
    summary:
      "The project focuses on understanding core web-server internals rather than hiding behind existing frameworks. It handles raw HTTP parsing, reverse proxy flows, static file serving, structured logging, and connection management while staying explicitly educational.",
    highlightsTitle: "Core Ideas",
    highlights: [
      "Custom HTTP parser for raw TCP connections and full HTTP message handling.",
      "Reverse proxy mode for forwarding traffic to backend services with transparent header handling.",
      "Static file serving, MIME type detection, request logging, and error-page fallback behavior.",
    ],
    body:
      "The long-term direction is clear: stronger proxy behavior, caching, compression, graceful shutdown, and more hardened production features. Even in its current form, the project demonstrates systems-level reasoning and a deliberate interest in how web infrastructure actually works.",
    primary: "Open GitHub repository",
    secondary: "Back to portfolio",
  },
  fr: {
    title: "Dreamproxy | Rachid Rodrigue BADINI",
    description: "Proxy inverse et serveur de fichiers statiques construit from scratch en Go.",
    eyebrow: "Projet Personnel",
    headline: "Dreamproxy",
    intro:
      "Un proxy inverse léger et un serveur de fichiers statiques écrits from scratch en Go pour explorer le parsing HTTP, la gestion TCP et une conception serveur pensée pour la production.",
    summary:
      "Le projet vise à comprendre les internals d'un serveur web plutôt qu'à se cacher derrière des frameworks existants. Il gère le parsing HTTP brut, les flux de reverse proxy, le service de fichiers statiques, les logs structurés et la gestion des connexions, avec une démarche volontairement pédagogique.",
    highlightsTitle: "Idées Clés",
    highlights: [
      "Parseur HTTP personnalisé pour connexions TCP brutes et gestion complète des messages HTTP.",
      "Mode reverse proxy pour rediriger le trafic vers des services backend avec gestion transparente des headers.",
      "Service de fichiers statiques, détection de type MIME, logs de requêtes et pages d'erreur de secours.",
    ],
    body:
      "La direction long terme est nette : meilleur comportement proxy, cache, compression, arrêt gracieux et durcissement progressif vers des usages plus robustes. Même à ce stade, le projet montre une vraie réflexion système et un intérêt concret pour le fonctionnement réel de l'infrastructure web.",
    primary: "Ouvrir le dépôt GitHub",
    secondary: "Retour au portfolio",
  },
} as const;

export default function DreamproxyPage() {
  const router = useRouter();
  const locale = getSiteLocale(router.locale);
  const t = content[locale];

  return (
    <>
      <Head>
        <title>{t.title}</title>
        <meta name="description" content={t.description} />
      </Head>

      <div className="container">
        <section className="home-hero">
          <div className="eyebrow">{t.eyebrow}</div>
          <h1 className="home-title">{t.headline}</h1>
          <p className="home-intro">{t.intro}</p>

          <div className="summary-card" style={{ marginTop: "1.5rem" }}>
            <p>{t.summary}</p>
          </div>

          <section style={{ marginTop: "2rem" }}>
            <h2 className="section-title">{t.highlightsTitle}</h2>
            <ul className="timeline-points">
              {t.highlights.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>

          <div className="summary-card" style={{ marginTop: "2rem" }}>
            <p>{t.body}</p>
          </div>

          <div className="hero-actions">
            <a href="https://github.com/bsrodrigue/dreamproxy" target="_blank" rel="noreferrer" className="primary-link">
              {t.primary}
            </a>
            <Link href="/portfolio" className="secondary-link">
              {t.secondary}
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}
