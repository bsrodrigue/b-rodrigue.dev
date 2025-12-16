import Head from "next/head";
import Link from "next/link";
import { FaGithub, FaLinkedin, FaEnvelope } from "react-icons/fa";
import settings from "../settings";

export default function Home() {
  return (
    <>
      <Head>
        <title>BRodrigue | Fullstack Developer</title>
        <meta name="description" content="Portfolio of BRodrigue, a Fullstack Developer." />
      </Head>

      <section>
        <div className="container" style={{ textAlign: 'center', paddingTop: '4rem' }}>
          <h1>BRodrigue</h1>
          <p style={{ fontSize: '1.2rem', color: '#666' }}>Fullstack Developer</p>
          <p style={{ maxWidth: '600px', margin: '2rem auto' }}>
            I build accessible, pixel-perfect, and performant web experiences.
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', fontSize: '2rem' }}>
            <a href="https://github.com/bsrodrigue" target="_blank" rel="noreferrer">
              <FaGithub />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noreferrer">
              <FaLinkedin />
            </a>
            <a href="mailto:contact@b-rodrigue.com">
              <FaEnvelope />
            </a>
          </div>
        </div>
      </section>

      <section>
        <div className="container">
          <h2 style={{ textAlign: 'center' }}>Skills</h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '1rem' }}>
            {settings.skills.map((skill, index) => (
              <span key={index} style={{ padding: '0.5rem 1rem', background: '#f5f5f5', borderRadius: '20px' }}>
                {skill}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section>
        <div className="container">
          <h2 style={{ textAlign: 'center' }}>Featured Projects</h2>
          <div className="projects-grid">
            {settings.portfolioProjects.slice(0, 6).map((project, index) => (
              <div key={index} className="project-card">
                <img src={project.cover} alt={project.title} />
                <h3>{project.title}</h3>
                <p>{project.description}</p>
                <a href={project.link} target="_blank" rel="noreferrer">Visit Project &rarr;</a>
              </div>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: '2rem' }}>
            <Link href="/portfolio">View All Projects</Link>
          </div>
        </div>
      </section>

      <section>
        <div className="container">
          <h2 style={{ textAlign: 'center' }}>About Me</h2>
          <p style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto' }}>
            I'm a passionate developer with a knack for building beautiful and functional web applications.
            I love learning new technologies and solving complex problems.
            When I'm not coding, you can find me reading, playing video games, or exploring the outdoors.
          </p>
        </div>
      </section>
    </>
  );
}
