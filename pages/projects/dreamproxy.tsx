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
      "Dreamproxy is a systems-learning project with real product constraints: explicit protocol handling, predictable routing behavior, and a clean path toward production hardening. Every feature is built to expose internals, not hide them.",
    snapshotTitle: "Project Snapshot",
    snapshot: {
      status: "In active development",
      role: "Systems design and implementation",
      stack: "Go, raw TCP sockets, custom HTTP parsing, file I/O",
      updated: "May 2026",
    },
    featuresTitle: "Feature Matrix",
    features: [
      {
        name: "Custom HTTP Parser",
        value: "Full ownership of request lifecycle",
        implementation: "Manual parsing of start-line, headers, and body framing",
        status: "Done",
      },
      {
        name: "Reverse Proxy Routing",
        value: "Backend service composition",
        implementation: "Forwarding logic with upstream target mapping",
        status: "Done",
      },
      {
        name: "Static File Serving",
        value: "Unified edge-like behavior",
        implementation: "Path resolution, MIME detection, and fallback handling",
        status: "Done",
      },
      {
        name: "Caching Layer",
        value: "Lower upstream pressure",
        implementation: "In-memory key strategy + invalidation policy",
        status: "Planned",
      },
    ],
    roadmapTitle: "Progress & Roadmap",
    roadmap: [
      { version: "v0.2", progress: "100%", items: ["HTTP parser core", "Basic proxy forwarding", "Static file pipeline"] },
      { version: "v0.3", progress: "65%", items: ["Connection handling hardening", "Error boundaries", "Structured logging upgrades"] },
      { version: "v1.0", progress: "25%", items: ["Caching module", "Compression support", "Graceful shutdown"] },
    ],
    challengesTitle: "Technical Challenges",
    challenges: [
      {
        title: "Protocol correctness",
        problem: "Small parsing mistakes can break interoperability across clients.",
        solution: "Implemented strict parsing phases with explicit malformed-request handling.",
        tradeoff: "More verbose parsing code and larger test surface.",
      },
      {
        title: "Proxy transparency",
        problem: "Forwarding requires preserving request intent while avoiding header corruption.",
        solution: "Defined a predictable header pass-through strategy and controlled overrides.",
        tradeoff: "Requires careful maintenance as features expand.",
      },
      {
        title: "Failure containment",
        problem: "Connection-level failures can cascade if not isolated.",
        solution: "Scoped errors per request path with structured logging around boundaries.",
        tradeoff: "Additional complexity in handler lifecycle management.",
      },
    ],
    reliabilityTitle: "Performance & Reliability",
    reliability: [
      { label: "Hot Path", value: "Single-pass parsing stages", note: "reduces ambiguous state transitions during request handling" },
      { label: "Operational Safety", value: "Explicit error boundaries", note: "prevents failures from leaking across independent requests" },
      { label: "Scalability Direction", value: "Cache + compression roadmap", note: "targets lower latency and reduced upstream load" },
    ],
    lessonsTitle: "Lessons & Next Bets",
    lessons: [
      "Owning protocol internals strengthens system-design decisions across all backend work.",
      "Predictability beats cleverness in proxy and networking code paths.",
      "Next focus: mature connection lifecycle, caching, and benchmark-driven optimization.",
    ],
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
      "Dreamproxy est un projet d'apprentissage système avec de vraies contraintes produit: gestion explicite du protocole, routage prévisible et trajectoire claire vers un durcissement production. Chaque fonctionnalité expose les internals au lieu de les masquer.",
    snapshotTitle: "Vue d'Ensemble",
    snapshot: {
      status: "Développement actif",
      role: "Conception système et implémentation",
      stack: "Go, sockets TCP brutes, parsing HTTP custom, file I/O",
      updated: "Mai 2026",
    },
    featuresTitle: "Matrice de Fonctionnalités",
    features: [
      {
        name: "Parseur HTTP Custom",
        value: "Contrôle complet du cycle de requête",
        implementation: "Parsing manuel start-line, headers et framing body",
        status: "Terminé",
      },
      {
        name: "Routage Reverse Proxy",
        value: "Composition de services backend",
        implementation: "Logique de forwarding avec mapping de cibles upstream",
        status: "Terminé",
      },
      {
        name: "Service de Fichiers Statiques",
        value: "Comportement edge unifié",
        implementation: "Résolution de chemin, détection MIME, gestion fallback",
        status: "Terminé",
      },
      {
        name: "Couche de Cache",
        value: "Réduction de pression upstream",
        implementation: "Stratégie de clés mémoire + politique d'invalidation",
        status: "Planifié",
      },
    ],
    roadmapTitle: "Progression & Roadmap",
    roadmap: [
      { version: "v0.2", progress: "100%", items: ["Noyau parseur HTTP", "Forwarding proxy basique", "Pipeline fichiers statiques"] },
      { version: "v0.3", progress: "65%", items: ["Durcissement gestion connexions", "Frontières d'erreur", "Logs structurés améliorés"] },
      { version: "v1.0", progress: "25%", items: ["Module cache", "Support compression", "Arrêt gracieux"] },
    ],
    challengesTitle: "Défis Techniques",
    challenges: [
      {
        title: "Correction protocolaire",
        problem: "De petites erreurs de parsing cassent l'interopérabilité client.",
        solution: "Phases de parsing strictes avec gestion explicite des requêtes invalides.",
        tradeoff: "Code plus verbeux et surface de tests plus large.",
      },
      {
        title: "Transparence proxy",
        problem: "Le forwarding doit préserver l'intention sans corrompre les headers.",
        solution: "Stratégie de pass-through prévisible avec overrides contrôlés.",
        tradeoff: "Maintenance attentive requise à mesure que les features grandissent.",
      },
      {
        title: "Confinement des pannes",
        problem: "Les erreurs connexion peuvent se propager si mal isolées.",
        solution: "Isolation des erreurs par chemin de requête + logs structurés.",
        tradeoff: "Complexité additionnelle dans le cycle de vie des handlers.",
      },
    ],
    reliabilityTitle: "Performance & Fiabilité",
    reliability: [
      { label: "Chemin Critique", value: "Parsing en phases single-pass", note: "réduit les transitions d'état ambiguës au traitement requête" },
      { label: "Sécurité Opérationnelle", value: "Frontières d'erreur explicites", note: "évite la propagation des pannes entre requêtes" },
      { label: "Trajectoire Scalabilité", value: "Roadmap cache + compression", note: "vise une latence plus faible et moins de charge upstream" },
    ],
    lessonsTitle: "Leçons & Prochaines Étapes",
    lessons: [
      "Maîtriser les internals protocolaires améliore la qualité des décisions système.",
      "En code réseau/proxy, la prévisibilité vaut mieux que l'astuce.",
      "Prochaine priorité: cycle de vie connexion, cache, et optimisation guidée par benchmarks.",
    ],
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
        <section className="project-detail">
          <div className="project-hero-panel">
            <div className="project-hero-copy">
              <div className="eyebrow">{t.eyebrow}</div>
              <h1 className="project-title">{t.headline}</h1>
              <p className="project-intro">{t.intro}</p>
            </div>

            <div className="project-surface">
              <p>{t.summary}</p>
            </div>
          </div>

          <section className="project-block">
            <h2 className="project-section-title">{t.snapshotTitle}</h2>
            <div className="project-snapshot-grid">
              <article className="project-snapshot-card">
                <h3>Status</h3>
                <p className="status-chip">{t.snapshot.status}</p>
              </article>
              <article className="project-snapshot-card">
                <h3>Role</h3>
                <p>{t.snapshot.role}</p>
              </article>
              <article className="project-snapshot-card">
                <h3>Stack</h3>
                <p>{t.snapshot.stack}</p>
              </article>
              <article className="project-snapshot-card">
                <h3>Updated</h3>
                <p>{t.snapshot.updated}</p>
              </article>
            </div>
          </section>

          <section className="project-block">
            <h2 className="project-section-title">{t.featuresTitle}</h2>
            <div className="feature-matrix">
              {t.features.map((feature) => (
                <article key={feature.name} className="feature-row">
                  <div className="feature-main">
                    <h3>{feature.name}</h3>
                    <p>{feature.value}</p>
                  </div>
                  <p className="feature-impl">{feature.implementation}</p>
                  <span className={`status-badge ${feature.status.includes("Plan") || feature.status.includes("Planned") ? "pending" : "done"}`}>
                    {feature.status}
                  </span>
                </article>
              ))}
            </div>
          </section>

          <section className="project-block">
            <h2 className="project-section-title">{t.roadmapTitle}</h2>
            <div className="changelog-tree">
              {t.roadmap.map((milestone) => (
                <article key={milestone.version} className="changelog-entry">
                  <div className="changelog-marker" aria-hidden="true" />
                  <div className="changelog-content">
                    <div className="changelog-head">
                      <h3>{milestone.version}</h3>
                      <span>{milestone.progress}</span>
                    </div>
                    <ul className="project-points">
                      {milestone.items.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className="project-block">
            <h2 className="project-section-title">{t.challengesTitle}</h2>
            <div className="challenge-grid">
              {t.challenges.map((challenge) => (
                <article key={challenge.title} className="challenge-card">
                  <h3>{challenge.title}</h3>
                  <p><strong>Problem:</strong> {challenge.problem}</p>
                  <p><strong>Solution:</strong> {challenge.solution}</p>
                  <p><strong>Tradeoff:</strong> {challenge.tradeoff}</p>
                </article>
              ))}
            </div>
          </section>

          <section className="project-block">
            <h2 className="project-section-title">{t.reliabilityTitle}</h2>
            <div className="metric-grid">
              {t.reliability.map((item) => (
                <article key={item.label} className="metric-card">
                  <h3>{item.label}</h3>
                  <p className="metric-value">{item.value}</p>
                  <p>{item.note}</p>
                </article>
              ))}
            </div>
          </section>

          <section className="project-block">
            <h2 className="project-section-title">{t.lessonsTitle}</h2>
            <ul className="project-points">
              {t.lessons.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>

          <div className="project-actions">
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
