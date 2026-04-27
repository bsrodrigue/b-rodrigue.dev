export type SiteLocale = "en" | "fr";

export type TimelineItem = {
  role: string;
  company: string;
  period: string;
  location: string;
  summary: string;
  bullets: string[];
};

export function getSiteLocale(locale?: string): SiteLocale {
  return locale === "fr" ? "fr" : "en";
}

export const siteContent = {
  en: {
    nav: {
      home: "Home",
      portfolio: "Portfolio",
      blog: "Blog",
      language: "Language",
      themeLight: "Light mode",
      themeDark: "Dark mode",
    },
    footerTitle: "Fullstack Developer",
    home: {
      title: "Rachid Rodrigue BADINI | Fullstack Developer",
      description:
        "Fullstack developer focused on React, React Native, Python, Django, and PostgreSQL.",
      eyebrow: "Senior Fullstack Engineer",
      headline: "BADINI Rachid Rodrigue",
      intro: "Deep love for technology and engineering",
      aboutTitle: "🧑 About Me",
      aboutList: [
        "🔧 Self-taught programmer, passionate about building complex systems with simple designs.",
        "🧘 Advocate for minimalism & clean code — the less code, the better.",
        "🌍 Fluent in English & French.",
        "🎮 Hobby game developer.",
        "📚 Avid reader, music & podcast enjoyer.",
        "❤️ Favourite games: Dark Souls, Bloodborne, Hollow Knight, NieR:Automata.",
      ],
      focusTitle: "🛠️ Current Focus",
      focusList: [
        "Backend architecture & system design.",
        "Performance optimization and low-level programming.",
        "Deepening knowledge in Linux, networking, and databases.",
        "Building efficient developer tooling and frameworks.",
      ],
      stack: [
        "Python",
        "Javascript",
        "Go",
        "System Design",
        "Linux",
        "Networking",
      ],
      ctaPrimary: "View portfolio",
      ctaSecondary: "Read articles",
      proof: [
        { title: "7+ years", text: "Professional engineering experience" },
        { title: "React + React Native", text: "End-to-end quality" },
        { title: "Django + Postgres", text: "Backend Focus" },
      ],
      timelineTitle: "Experience Timeline",
      experience: [
        {
          role: "Lead Fullstack Engineer",
          company: "DISCOM",
          period: "March 2026 - Present",
          location: "Ouagadougou",
          summary:
            "Building a data-heavy Django platform with DRF, Redis, Celery, and PostgreSQL for high-concurrency delivery.",
          bullets: [
            "Architecting high-throughput data processing pipelines for large operational datasets.",
            "Using Redis and Celery to move expensive work out of the request cycle and keep the UI responsive.",
            "Optimizing PostgreSQL schemas and retrieval patterns for real-time consumption.",
          ],
        },
        {
          role: "Fullstack Software Engineer (C++)",
          company: "Astek Madagascar",
          period: "July 2025 - December 2025",
          location: "Madagascar",
          summary:
            "Worked on high-performance C++ and Qt systems, improving latency and memory usage in constrained environments.",
          bullets: [
            "Refactored multithreaded modules to reduce memory footprint and latency.",
            "Built embedded interfaces with QML for smoother runtime behavior.",
          ],
        },
        {
          role: "Lead Fullstack Engineer",
          company: "Doonya Labs",
          period: "November 2024 - July 2025",
          location: "Hybrid",
          summary:
            "Led a Next.js and Django platform handling 50,000+ API requests per day with faster deployments and cleaner architecture.",
          bullets: [
            "Led architecture across React, Next.js, Django, and API design.",
            "Improved deployment speed with Docker and AWS-based delivery pipelines.",
            "Mentored engineers while driving technical decisions in production.",
          ],
        },
        {
          role: "Lead Fullstack Engineer",
          company: "Gandyam Ligdi",
          period: "July 2023 - October 2024",
          location: "Remote",
          summary:
            "Shipped financial features across React, React Native, Python, MySQL, and Redis in a payment environment.",
          bullets: [
            "Built secure financial APIs and interfaces for a FinTech product.",
            "Delivered features across web and mobile with React and React Native.",
            "Improved throughput with Redis caching and SQL refactoring.",
          ],
        },
        {
          role: "Fullstack Software Engineer",
          company: "N7 Studio",
          period: "April 2021 - April 2023",
          location: "Remote, Canada",
          summary:
            "Built web and mobile software for a streaming platform with React, React Native, Node.js, and GraphQL.",
          bullets: [
            "Developed React and React Native features for high-traffic user-facing products.",
            "Contributed to Node.js and GraphQL services supporting 5,000+ simultaneous users.",
            "Helped maintain reliability with test coverage and production-oriented engineering practices.",
          ],
        },
        {
          role: "Junior Linux System Administrator",
          company: "ANPTIC",
          period: "March 2021 - June 2021",
          location: "Ouagadougou",
          summary:
            "Early infrastructure-focused work around Linux systems, redundancy, and operational stability.",
          bullets: [
            "Worked on high-availability infrastructure and Linux system tuning.",
            "Built the operational discipline that later informed backend and production engineering work.",
          ],
        },
        {
          role: "Fullstack Consultant",
          company: "Freelance",
          period: "2019 - Present",
          location: "Remote",
          summary:
            "Worked across client products in betting, healthcare, delivery, real estate, and internal tooling alongside long-term roles.",
          bullets: [
            "Built PMUB, a React Native betting product with payments and real-time dashboards.",
            "Architected multi-service mobile products such as Songre - EliteApp.",
            "Delivered product work across Flutter, Next.js, Go, and Python depending on client needs.",
          ],
        },
      ] satisfies TimelineItem[],
    },
    portfolio: {
      title: "Portfolio | Rachid Rodrigue BADINI",
      description: "Selected client work and personal engineering projects.",
      heroTitle: "Portfolio",
      heroSubtitle: "Client work and personal projects...",
      clientTitle: "Client Projects",
      clientDescription:
        "Products delivered for companies and client engagements.",
      personalTitle: "Personal Projects",
      personalDescription:
        "Independent engineering work, experiments, and deeper technical explorations.",
      typeApplication: "Applications",
      typeWebsite: "Websites",
      typeGame: "Games",
      typeCli: "CLI Tools",
      kindClient: "Client work",
      kindEmployer: "Employer projects",
      ctaExternal: "Open project ->",
      ctaInternal: "Open project page ->",
      unavailable: "Link coming soon",
    },
    blog: {
      title: "Blog | Rachid Rodrigue BADINI",
      description: "Articles and essays on everything that matters to me",
      heroTitle: "Articles & Essays",
      heroSubtitle: "Articles and essays on everything that matters to me",
      recentTitle: "Recent Articles",
      readMore: "Read more ->",
    },
    article: {
      backToBlog: "Back to blog",
    },
  },
  fr: {
    nav: {
      home: "Accueil",
      portfolio: "Portfolio",
      blog: "Blog",
      language: "Langue",
      themeLight: "Mode clair",
      themeDark: "Mode sombre",
    },
    footerTitle: "Développeur Fullstack",
    home: {
      title: "Rachid Rodrigue BADINI | Développeur Fullstack",
      description:
        "Développeur fullstack spécialisé en React, React Native, Python, Django et PostgreSQL.",
      eyebrow: "Ingénieur Backend & Systèmes Senior",
      headline: "👋 Salut, je suis Rodrigue",
      intro:
        "⚡ Python | Go | C/C++ | Linux | Passionné par les réseaux & Minimaliste",
      aboutTitle: "🧑 À propos de moi",
      aboutList: [
        "🔧 Programmeur autodidacte, passionné par la création de systèmes complexes avec des conceptions simples.",
        "🧘 Fervent défenseur de l'architecture minimaliste et du code propre.",
        "🌍 Bilingue anglais & français.",
        "🎮 Développeur de jeux sur mon temps libre.",
        "📚 Grand lecteur, fan de musique & de podcasts.",
        "❤️ Jeux préférés : Dark Souls, Bloodborne, Hollow Knight, NieR:Automata.",
      ],
      focusTitle: "🛠️ Mon focus actuel",
      focusList: [
        "Architecture backend et conception système.",
        "Optimisation des performances et programmation bas niveau.",
        "Approfondissement en Linux, réseaux et bases de données.",
        "Création d'outils de développement efficaces.",
      ],
      stack: ["Python", "Go", "C/C++", "Linux", "Réseaux"],
      ctaPrimary: "Voir le portfolio",
      ctaSecondary: "Lire les articles",
      proof: [
        { title: "7+ ans", text: "de produits livrés" },
        { title: "Web + mobile", text: "expérience de livraison" },
        { title: "Django + Postgres", text: "socle backend" },
      ],
      timelineTitle: "Parcours professionnel",
      experience: [
        {
          role: "Ingénieur Fullstack Principal",
          company: "DISCOM",
          period: "Mars 2026 - Présent",
          location: "Ouagadougou",
          summary:
            "Conception d'une plateforme Django orientée données avec DRF, Redis, Celery et PostgreSQL pour des charges à forte concurrence.",
          bullets: [
            "Architecture de pipelines de traitement haut débit pour de grands volumes de données opérationnelles.",
            "Utilisation de Redis et Celery pour sortir les traitements lourds du cycle requête-réponse et garder l'interface fluide.",
            "Optimisation des schémas PostgreSQL et des stratégies de lecture pour la consommation temps réel.",
          ],
        },
        {
          role: "Ingénieur Logiciel Fullstack (C++)",
          company: "Astek Madagascar",
          period: "Juillet 2025 - Décembre 2025",
          location: "Madagascar",
          summary:
            "Travail sur des systèmes C++ et Qt haute performance, avec amélioration de la latence et de l'empreinte mémoire en environnement contraint.",
          bullets: [
            "Refactorisation de modules multithreadés pour réduire l'empreinte mémoire et la latence.",
            "Développement d'interfaces embarquées avec QML pour un meilleur comportement à l'exécution.",
          ],
        },
        {
          role: "Ingénieur Fullstack Principal",
          company: "Doonya Labs",
          period: "Novembre 2024 - Juillet 2025",
          location: "Hybride",
          summary:
            "Direction technique d'une plateforme Next.js et Django gérant plus de 50 000 requêtes API par jour, avec une architecture plus propre et des déploiements plus rapides.",
          bullets: [
            "Pilotage de l'architecture côté React, Next.js, Django et API.",
            "Accélération des déploiements avec Docker et des pipelines de livraison sur AWS.",
            "Mentorat d'ingénieurs et prise de décisions techniques en production.",
          ],
        },
        {
          role: "Ingénieur Fullstack Principal",
          company: "Gandyam Ligdi",
          period: "Juillet 2023 - Octobre 2024",
          location: "À distance",
          summary:
            "Livraison de fonctionnalités financières sur React, React Native, Python, MySQL et Redis dans un contexte de paiement.",
          bullets: [
            "Développement d'APIs et d'interfaces sécurisées pour un produit FinTech.",
            "Livraison de fonctionnalités web et mobile avec React et React Native.",
            "Amélioration du débit via Redis et la refactorisation de requêtes SQL.",
          ],
        },
        {
          role: "Ingénieur Logiciel Fullstack",
          company: "N7 Studio",
          period: "Avril 2021 - Avril 2023",
          location: "À distance, Canada",
          summary:
            "Développement de produits web et mobile pour une plateforme de streaming avec React, React Native, Node.js et GraphQL.",
          bullets: [
            "Développement de fonctionnalités React et React Native pour des produits à fort trafic.",
            "Contribution à des services Node.js et GraphQL supportant plus de 5 000 utilisateurs simultanés.",
            "Renforcement de la fiabilité via les tests et des pratiques d'ingénierie orientées production.",
          ],
        },
        {
          role: "Administrateur Systèmes Linux Junior",
          company: "ANPTIC",
          period: "Mars 2021 - Juin 2021",
          location: "Ouagadougou",
          summary:
            "Première expérience orientée infrastructure autour des systèmes Linux, de la redondance et de la stabilité opérationnelle.",
          bullets: [
            "Travail sur des infrastructures haute disponibilité et sur l'optimisation de systèmes Linux.",
            "Construction d'une discipline opérationnelle ensuite réinvestie en backend et en production.",
          ],
        },
        {
          role: "Consultant Fullstack",
          company: "Freelance",
          period: "2019 - Présent",
          location: "À distance",
          summary:
            "Interventions sur des produits client dans les paris, la santé, la livraison, l'immobilier et l'outillage interne, en parallèle de postes longs.",
          bullets: [
            "Développement de PMUB, produit de paris React Native avec paiements et dashboards temps réel.",
            "Architecture de produits mobiles multi-services comme Songre - EliteApp.",
            "Livraison de projets avec Flutter, Next.js, Go et Python selon les besoins client.",
          ],
        },
      ] satisfies TimelineItem[],
    },
    portfolio: {
      title: "Portfolio | Rachid Rodrigue BADINI",
      description: "Sélection de projets client et de projets personnels.",
      heroTitle: "Portfolio",
      heroSubtitle:
        "Des projets client et des projets personnels, clairement séparés.",
      clientTitle: "Projets Client",
      clientDescription:
        "Produits livrés pour des entreprises et des missions client.",
      personalTitle: "Projets Personnels",
      personalDescription:
        "Travaux d'ingénierie indépendants, expérimentations et explorations techniques plus profondes.",
      typeApplication: "Applications",
      typeWebsite: "Sites Web",
      typeGame: "Jeux",
      typeCli: "Outils CLI",
      kindClient: "Missions client",
      kindEmployer: "Projets employeur",
      ctaExternal: "Ouvrir le projet ->",
      ctaInternal: "Ouvrir la page projet ->",
      unavailable: "Lien à venir",
    },
    blog: {
      title: "Blog | Rachid Rodrigue BADINI",
      description:
        "Articles et réflexions sur le développement, les systèmes et la tech.",
      heroTitle: "Blog",
      heroSubtitle:
        "Articles et réflexions sur le développement, les systèmes et la tech.",
      recentTitle: "Articles récents",
      readMore: "Lire la suite ->",
    },
    article: {
      backToBlog: "Retour au blog",
    },
  },
} as const;
