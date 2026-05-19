import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { getSiteLocale } from "../../lib/site-content";

const content = {
  en: {
    title: "Buildshare | Rachid Rodrigue BADINI",
    description: "Internal Android build distribution platform for engineering teams.",
    eyebrow: "Personal Project",
    headline: "Buildshare",
    intro:
      "A React Native mobile application for internal Android build distribution, backed by a Django server that manages uploads, release history, and artifact processing.",
    summary:
      "Buildshare is a tester-facing product with a backend built to keep uploads reliable and release history auditable. The core decision was to optimize for mobile workflows first, then build infrastructure that protects that flow under load.",
    snapshotTitle: "Project Snapshot",
    snapshot: {
      status: "In active development",
      role: "Product, backend and mobile implementation",
      stack: "React Native, Django, DRF, Celery, Redis, PostgreSQL, Cloudflare R2",
      updated: "May 2026",
    },
    featuresTitle: "Feature Matrix",
    features: [
      {
        name: "Direct APK Upload",
        value: "Avoids app-server upload bottlenecks",
        implementation: "Presigned R2 URLs + server-side verification",
        status: "Done",
      },
      {
        name: "Release Timeline",
        value: "Fast rollback and traceability",
        implementation: "Release metadata + immutable artifact records",
        status: "Done",
      },
      {
        name: "Async Artifact Processing",
        value: "UI stays responsive during heavy jobs",
        implementation: "Celery workers for parsing, hashing, and indexing",
        status: "Done",
      },
      {
        name: "OTA Notifications",
        value: "Faster tester feedback loop",
        implementation: "Push-trigger release subscription pipeline",
        status: "In progress",
      },
    ],
    roadmapTitle: "Progress & Roadmap",
    roadmap: [
      { version: "v0.3", progress: "100%", items: ["Upload + release registry", "Basic auth", "Project-level access control"] },
      { version: "v0.4", progress: "70%", items: ["Release diff view", "Smarter search", "Storage lifecycle cleanup"] },
      { version: "v1.0", progress: "30%", items: ["Audit export", "Signed build channels", "Hardened observability"] },
    ],
    galleryTitle: "Screenshots by Workflow",
    galleryFlow: [
      "Project list and release context",
      "Release details and artifact metadata",
      "Build timeline navigation",
      "Mobile-first download workflow",
    ],
    challengesTitle: "Technical Challenges",
    challenges: [
      {
        title: "Large upload handling",
        problem: "Passing big APK files through Django inflated request latency and memory pressure.",
        solution: "Moved to direct object-storage uploads with signed URLs and callback validation.",
        tradeoff: "More moving parts between mobile client, storage, and API integrity checks.",
      },
      {
        title: "Reliable release creation",
        problem: "APK parsing can fail due to malformed inputs and edge metadata.",
        solution: "Offloaded parsing to retryable Celery jobs with explicit failure states.",
        tradeoff: "Eventual consistency required careful UI state messaging.",
      },
      {
        title: "Auditability under speed constraints",
        problem: "Teams needed fast access without losing historical traceability.",
        solution: "Stored immutable artifact metadata with release lineage and actor context.",
        tradeoff: "Slightly more storage and stricter schema discipline.",
      },
    ],
    reliabilityTitle: "Performance & Reliability",
    reliability: [
      { label: "Upload Path", value: "Direct-to-R2", note: "removes server file buffering on hot path" },
      { label: "Heavy Workload", value: "Async workers", note: "keeps request-response cycle lightweight" },
      { label: "Data Integrity", value: "Hash + metadata checks", note: "prevents invalid artifacts entering release list" },
    ],
    lessonsTitle: "Lessons & Next Bets",
    lessons: [
      "Optimize around tester workflow first; infrastructure should serve that path, not the reverse.",
      "Make failure states first-class in both API and mobile UI.",
      "Next milestone: release channel governance and stronger visibility around job latency.",
    ],
    primary: "Open GitHub repository",
    secondary: "Back to portfolio",
  },
  fr: {
    title: "Buildshare | Rachid Rodrigue BADINI",
    description: "Plateforme interne de distribution de builds Android pour équipes d'ingénierie.",
    eyebrow: "Projet Personnel",
    headline: "Buildshare",
    intro:
      "Une application mobile React Native de distribution interne de builds Android, soutenue par un serveur Django qui gère les uploads, l'historique des releases et le traitement des artifacts.",
    summary:
      "Buildshare est un produit orienté testeurs, avec un backend conçu pour garder les uploads fiables et l'historique des releases auditable. Le choix principal: optimiser d'abord le workflow mobile, puis bâtir l'infra autour.",
    snapshotTitle: "Vue d'Ensemble",
    snapshot: {
      status: "Développement actif",
      role: "Produit, backend et implémentation mobile",
      stack: "React Native, Django, DRF, Celery, Redis, PostgreSQL, Cloudflare R2",
      updated: "Mai 2026",
    },
    featuresTitle: "Matrice de Fonctionnalités",
    features: [
      {
        name: "Upload APK Direct",
        value: "Évite les goulots d'étranglement côté serveur app",
        implementation: "URLs R2 présignées + vérification serveur",
        status: "Terminé",
      },
      {
        name: "Timeline des Releases",
        value: "Rollback rapide et traçabilité",
        implementation: "Métadonnées de release + enregistrements immuables",
        status: "Terminé",
      },
      {
        name: "Traitement Asynchrone",
        value: "Interface fluide pendant les jobs lourds",
        implementation: "Workers Celery pour parsing, hashage, indexation",
        status: "Terminé",
      },
      {
        name: "Notifications OTA",
        value: "Boucle de feedback testeurs plus rapide",
        implementation: "Pipeline d'abonnement déclenché par release",
        status: "En cours",
      },
    ],
    roadmapTitle: "Progression & Roadmap",
    roadmap: [
      { version: "v0.3", progress: "100%", items: ["Upload + registre des releases", "Auth basique", "Contrôle d'accès par projet"] },
      { version: "v0.4", progress: "70%", items: ["Vue diff des releases", "Recherche améliorée", "Nettoyage cycle de vie stockage"] },
      { version: "v1.0", progress: "30%", items: ["Export d'audit", "Canaux de builds signés", "Observabilité renforcée"] },
    ],
    galleryTitle: "Captures par Workflow",
    galleryFlow: [
      "Liste des projets et contexte des releases",
      "Détails release et métadonnées artifact",
      "Navigation de timeline des builds",
      "Workflow de téléchargement mobile-first",
    ],
    challengesTitle: "Défis Techniques",
    challenges: [
      {
        title: "Gestion des gros uploads",
        problem: "Le transit d'APK via Django augmentait latence et pression mémoire.",
        solution: "Passage en upload direct vers le stockage avec URLs signées et validation callback.",
        tradeoff: "Plus de coordination entre client mobile, stockage et vérifications API.",
      },
      {
        title: "Création de release fiable",
        problem: "Le parsing APK peut échouer sur des entrées malformées.",
        solution: "Parsing déporté dans des jobs Celery retryables avec états d'échec explicites.",
        tradeoff: "Consistance éventuelle nécessitant des états UI clairs.",
      },
      {
        title: "Auditabilité vs vitesse",
        problem: "Accès rapide requis sans perte de traçabilité historique.",
        solution: "Métadonnées d'artifacts immuables avec historique de release et contexte acteur.",
        tradeoff: "Stockage un peu plus élevé et discipline de schéma plus stricte.",
      },
    ],
    reliabilityTitle: "Performance & Fiabilité",
    reliability: [
      { label: "Chemin Upload", value: "Direct-to-R2", note: "supprime le buffering serveur sur le chemin critique" },
      { label: "Charge Lourde", value: "Workers async", note: "garde le cycle requête-réponse léger" },
      { label: "Intégrité Données", value: "Vérifs hash + metadata", note: "évite les artifacts invalides en release" },
    ],
    lessonsTitle: "Leçons & Prochaines Étapes",
    lessons: [
      "Optimiser d'abord pour le workflow testeur; l'infrastructure doit servir ce parcours.",
      "Traiter les états d'échec comme des cas de première classe côté API et UI mobile.",
      "Prochaine étape: gouvernance des canaux de release et meilleure visibilité de latence jobs.",
    ],
    primary: "Ouvrir le dépôt GitHub",
    secondary: "Retour au portfolio",
  },
} as const;

const gallery = [
  "/images/projects/buildshare/buildshare1.jpeg",
  "/images/projects/buildshare/buildshare2.jpeg",
  "/images/projects/buildshare/buildshare3.jpeg",
  "/images/projects/buildshare/buildshare4.jpeg",
];

export default function BuildsharePage() {
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
                  <span className={`status-badge ${feature.status.includes("progress") || feature.status.includes("cours") ? "pending" : "done"}`}>
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
            <h2 className="project-section-title">{t.galleryTitle}</h2>
            <div className="project-gallery mobile-gallery">
              {gallery.map((src, index) => (
                <div key={src} className="project-gallery-item mobile-gallery-item">
                  <Image src={src} alt={`Buildshare screen ${index + 1}`} fill sizes="(max-width: 768px) 100vw, 50vw" />
                  <div className="gallery-caption">{t.galleryFlow[index]}</div>
                </div>
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
            <a href="https://github.com/bsrodrigue/buildshare" target="_blank" rel="noreferrer" className="primary-link">
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
