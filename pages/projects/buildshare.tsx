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
      "Buildshare is primarily a mobile product for testers and engineering teams. The Django REST backend, Celery workers, Redis, PostgreSQL, and Cloudflare R2 infrastructure exist to support that mobile workflow with asynchronous APK processing, version tracking, and auditable distribution.",
    highlightsTitle: "Why It Matters",
    highlights: [
      "Direct-to-storage upload flow using presigned Cloudflare R2 URLs instead of buffering APK files through the Django server.",
      "Asynchronous APK processing pipeline with Celery jobs for metadata extraction, hashing, and release creation.",
      "Mobile client built for testers to browse projects, inspect release history, and download artifacts.",
    ],
    galleryTitle: "Screens",
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
      "Buildshare est avant tout un produit mobile pour les testeurs et les équipes d'ingénierie. Le backend Django REST, les workers Celery, Redis, PostgreSQL et Cloudflare R2 sont là pour soutenir ce workflow mobile avec traitement asynchrone des APK, suivi des versions et distribution auditable.",
    highlightsTitle: "Pourquoi C'est Intéressant",
    highlights: [
      "Flux d'upload direct vers le stockage via des URLs présignées Cloudflare R2, sans faire transiter les APK par le serveur Django.",
      "Pipeline asynchrone de traitement d'APK avec jobs Celery pour l'extraction de métadonnées, le hashage et la création de releases.",
      "Client mobile conçu pour les testeurs afin de parcourir les projets, consulter l'historique des releases et télécharger les artifacts.",
    ],
    galleryTitle: "Écrans",
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

          <section style={{ marginTop: "2rem" }}>
            <h2 className="section-title">{t.galleryTitle}</h2>
            <div className="project-gallery mobile-gallery">
              {gallery.map((src, index) => (
                <div key={src} className="project-gallery-item mobile-gallery-item">
                  <Image src={src} alt={`Buildshare screen ${index + 1}`} fill sizes="(max-width: 768px) 100vw, 50vw" />
                </div>
              ))}
            </div>
          </section>

          <div className="hero-actions">
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
