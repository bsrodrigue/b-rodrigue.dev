import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { getSiteLocale, siteContent } from "../lib/site-content";

export default function Home() {
  const router = useRouter();
  const locale = getSiteLocale(router.locale);
  const t = siteContent[locale].home;

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

          <div className="stack-pills">
            {t.stack.map((item) => (
              <span key={item} className="stack-pill">
                {item}
              </span>
            ))}
          </div>

          <div className="hero-actions">
            <Link href="/portfolio" className="primary-link">
              {t.ctaPrimary}
            </Link>
            <Link href="/blog" className="secondary-link">
              {t.ctaSecondary}
            </Link>
          </div>

          <div className="contact-strip">
            <a href="mailto:bsrodrigue@gmail.com">bsrodrigue@gmail.com</a>
            <a href="https://linkedin.com/in/b-rodrigue" target="_blank" rel="noreferrer">
              LinkedIn
            </a>
            <a href="https://github.com/bsrodrigue" target="_blank" rel="noreferrer">
              GitHub
            </a>
          </div>

          <div className="proof-row">
            {t.proof.map((item) => (
              <div key={item.title} className="proof-item">
                <strong>{item.title}</strong>
                <span>{item.text}</span>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="section-title">{t.timelineTitle}</h2>
          <div className="experience-timeline">
            {t.experience.map((item) => (
              <article key={`${item.company}-${item.period}`} className="timeline-entry">
                <div className="timeline-rail" aria-hidden="true">
                  <span className="timeline-dot" />
                </div>
                <div className="timeline-content">
                  <div className="job-header">
                    <div className="company-info">
                      <h3 className="job-title">{item.role}</h3>
                      <span className="company-name">{item.company}</span>
                    </div>
                    <div className="job-meta">
                      <span className="job-date">{item.period}</span>
                      <span>{item.location}</span>
                    </div>
                  </div>
                  <p className="experience-summary">{item.summary}</p>
                  <ul className="timeline-points">
                    {item.bullets.map((bullet) => (
                      <li key={bullet}>{bullet}</li>
                    ))}
                  </ul>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
