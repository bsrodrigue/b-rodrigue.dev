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
      summary: "Fullstack engineer with 5+ years of experience designing scalable web applications, distributed backend systems, and high-performance user interfaces using Python, Django, FastAPI, React, Next.js, TypeScript, PostgreSQL, Redis, Docker, and Kubernetes. Experienced in application performance improvement, database optimization, and building reliable APIs for production environments. Combines deep backend infrastructure knowledge with modern frontend development to deliver end-to-end solutions.",
      stack: [
        "Python",
        "TypeScript",
        "Go",
        "React",
        "Next.js",
        "Node.js",
        "Django",
        "PostgreSQL",
        "Docker",
        "Kubernetes",
        "AWS",
        "GraphQL",
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
            "Architecting a mission-critical Django platform for AICB, a major national institution in Burkina Faso, following Django best practices and Clean Code principles.",
          bullets: [
            "Multi-tenant architecture: Designed a critical application for AICB with rigorous Django best practices and Clean Code.",
            "Dynamic forms & mass ingestion: Built a robust dynamic form management system supporting concurrent CSV imports of 200,000+ rows per file.",
            "High-throughput optimization: Identified PostgreSQL bottlenecks (connection pooling, N+1 queries). Refactored queries and connection pooling, reducing 10,000-row ingestion from 67s to 0.7s (96% improvement), processing 185,862 rows in 14s with no accumulation.",
            "Async architecture: Implemented Redis and Celery for background task processing, decoupling long-running data operations from the request-response cycle.",
            "Observability & monitoring: Built custom instrumentation for CSV ingestion exposed via a /metrics endpoint, with custom Grafana dashboards for actionable optimization insights.",
            "Stakeholder communication: Primary technical contact with AICB stakeholders, driving requirements gathering and technical advisory.",
          ],
        },
        {
          role: "Fullstack Software Engineer (C++)",
          company: "Astek Madagascar",
          period: "July 2025 - December 2025",
          location: "Madagascar",
          summary:
            "Developed robust, multithreaded C/C++ systems software for ticketing equipment operating in constrained environments.",
          bullets: [
            "Low-level system software: Built robust, multithreaded C/C++ modules for ticketing equipment in resource-constrained environments.",
            "Feature & UI implementation: Delivered new features and UIs per strict specification documents.",
            "Proprietary protocol debugging: Learned and debugged a proprietary network protocol to ensure correct system behavior.",
            "Design collaboration: Discussed and refined design choices with the team to ensure robust and maintainable solutions.",
            "Bug fixing: Resolved interface and low-level bugs to improve system stability and user experience.",
            "Cloud & tools: Used Microsoft Azure for deployments and bug tracking.",
          ],
        },
        {
          role: "Lead Fullstack Engineer",
          company: "Doonya Labs",
          period: "November 2024 - July 2025",
          location: "Hybrid",
          summary:
            "Led a Django/DRF platform scaled to 50,000+ daily API requests with P95 response times under 200ms, alongside a React/Next.js frontend.",
          bullets: [
            "Scalability: Scaled a Django/DRF platform to 50,000+ daily API requests with P95 response times under 200ms.",
            "Frontend development: Built reactive interfaces with React/Next.js and managed complex state transitions via Hooks and modern form libraries.",
            "Infrastructure: Provisioned AWS infrastructure with Terraform, orchestrated containers via Kubernetes, and set up GitHub Actions CI/CD for automated, reproducible deployments.",
            "Observability: Deployed Prometheus and Grafana for real-time monitoring and system performance metrics.",
            "Leadership: Mentored a cross-functional team of 4 engineers and led SCRUM ceremonies.",
          ],
        },
        {
          role: "Lead Fullstack Engineer",
          company: "Gandyam Ligdi",
          period: "July 2023 - October 2024",
          location: "Remote",
          summary:
            "Shipped secure financial features across React, React Native, Python, MySQL, and Redis in a FinTech environment handling 10,000+ monthly transactions.",
          bullets: [
            "Financial systems: Built secure, ACID-compliant financial APIs handling 10,000+ monthly transactions.",
            "Fullstack delivery: Delivered features across web (React) and mobile (React Native/TypeScript) with a focus on performance optimization and rapid iteration.",
            "Architecture: Designed a decoupled modular monolith using the Repository Pattern and dependency injection.",
            "Optimization: Increased throughput by 40% through Redis caching strategy and PostgreSQL query optimization.",
            "CI/CD: Configured GitHub Actions CI/CD pipelines for automated, reproducible deployments.",
          ],
        },
        {
          role: "Fullstack Software Engineer",
          company: "N7 Studio",
          period: "April 2021 - April 2023",
          location: "Remote, Canada",
          summary:
            "Built web and mobile software for a streaming platform with React, React Native, Node.js, and GraphQL, supporting 5,000+ simultaneous users.",
          bullets: [
            "High concurrency: Developed Node.js + TypeScript + GraphQL services for a streaming platform supporting 5,000+ simultaneous users.",
            "Frontend development: Built reactive web UIs with React and mobile apps with React Native and TypeScript.",
            "Reliability: Integrated comprehensive test suites (PyTest, Cypress, Jest) into automated pipelines, achieving 85% code coverage.",
            "Efficiency: Reduced API response times by 45% through connection pool sizing adjustments and query optimization.",
          ],
        },
        {
          role: "Junior Linux System Administrator",
          company: "ANPTIC",
          period: "March 2021 - June 2021",
          location: "Ouagadougou",
          summary:
            "Infrastructure-focused internship working on Linux systems, high-availability architecture, and network monitoring.",
          bullets: [
            "Kernel optimization: Customized and recompiled Linux kernels for specific driver support and security hardening.",
            "Network monitoring: Monitored a national network with NAGIOS to ensure infrastructure availability and rapid incident response.",
          ],
        },
        {
          role: "Fullstack Consultant",
          company: "Freelance",
          period: "2019 - Present",
          location: "Remote",
          summary:
            "Delivered client products across betting, healthcare, delivery, real estate, and internal tooling alongside long-term roles.",
          bullets: [
            "PMUB (React Native): Built a horse racing betting platform with real-time WebSocket data flows and secure payment integrations.",
            "Songre — EliteApp (React Native): Architected a multi-service super-app (Jobs, E-commerce, Medical, Delivery) managing multiple user roles (clients, vendors, delivery, admins).",
            "Allo Youri (Flutter & Web): Built a delivery platform with real-time GPS tracking (Maps API) and a responsive landing page.",
            "Les Genets (Flutter): Developed a medical app offering teleconsultations, SOS services, and medical record management.",
            "AppShare (React Native & Go): Designed an APK distribution tool with a robust Go backend for versioning and binary sharing.",
            "Dom Immo (Next.js): Built a high-performance UI for an AI-powered real estate platform.",
          ],
        },
      ] satisfies TimelineItem[],
      education: [
        {
          degree: "Master of Science (M.Sc.) in Software Engineering",
          school: "Université Aube Nouvelle",
          specialization: "Distributed Systems and Architecture",
          period: "2021 - 2022",
        },
        {
          degree: "Bachelor of Science (B.Sc.) in Computer Networks",
          school: "Université Aube Nouvelle",
          specialization: "TCP/IP, Linux Systems, and Network Administration",
          period: "2017 - 2021",
        },
      ],
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
      typeInfrastructure: "Infrastructure",
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
      searchPlaceholder: "Search articles...",
      noResults: "No articles found matching that search.",
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
      eyebrow: "Ingénieur Fullstack Senior",
      headline: "BADINI Rachid Rodrigue",
      intro: "Un amour profond pour la tech et l'ingénierie",
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
      stack: [
        "Python",
        "TypeScript",
        "Go",
        "React",
        "Next.js",
        "Node.js",
        "Django",
        "PostgreSQL",
        "Docker",
        "Kubernetes",
        "AWS",
        "GraphQL",
      ],
      ctaPrimary: "Voir le portfolio",
      ctaSecondary: "Lire les articles",
      proof: [
        { title: "7+ ans", text: "Expérience professionnelle en ingénierie" },
        { title: "React + React Native", text: "Qualité de bout en bout" },
        { title: "Django + Postgres", text: "Expertise Backend" },
      ],
      timelineTitle: "Parcours professionnel",
      experience: [
        {
          role: "Ingénieur Fullstack Principal",
          company: "DISCOM",
          period: "Mars 2026 - Présent",
          location: "Ouagadougou",
          summary:
            "Conception d'une application critique pour l'AICB (Association Interprofessionnelle du Coton du Burkina), en respectant rigoureusement les meilleures pratiques Django et le Clean Code.",
          bullets: [
            "Architecture multi-locataire (Multi-Tenant) : Conception d'une application critique pour une structure nationale majeure (AICB), en respectant rigoureusement les meilleures pratiques Django et le Clean Code.",
            "Formulaires dynamiques et ingestion massive : Développement d'un système robuste de gestion de formulaires dynamiques supportant des imports CSV massifs et concurrents (traitement de plus de 200 000 lignes par fichier).",
            "Systèmes à haut débit : Identification des goulots d'étranglement PostgreSQL (pooling de connexions et requêtes N+1) dans le pipeline d'ingestion CSV. Refactorisation des requêtes et optimisation du pool de connexions, réduisant l'ingestion de 10 000 lignes de 67s à 0,7s (amélioration de 96%) et traitant 185 862 lignes en 14s sans accumulation.",
            "Architecture asynchrone : Mise en œuvre de Redis et Celery pour le traitement des tâches en arrière-plan, découplant avec succès les opérations de données longues du cycle requête-réponse.",
            "Observabilité et monitoring : Développement d'un code d'instrumentation personnalisé pour l'ingestion CSV exposé via un endpoint /metrics et création de tableaux de bord Grafana sur mesure.",
            "Communication avec les parties prenantes : Principal point de contact avec les parties prenantes du projet à l'AICB, assurant la collecte des besoins et le conseil technique.",
          ],
        },
        {
          role: "Ingénieur Logiciel Fullstack (C++)",
          company: "Astek Madagascar",
          period: "Juillet 2025 - Décembre 2025",
          location: "Madagascar",
          summary:
            "Développement de logiciels C/C++ robustes, multithreadés et modulaires pour des équipements de billetterie fonctionnant dans des environnements contraints.",
          bullets: [
            "Logiciel système bas niveau : Développement de logiciels C/C++ robustes, multithreadés et modulaires pour des équipements de billetterie en environnements contraints.",
            "Implémentation de fonctionnalités et UI : Implémentation de nouvelles fonctionnalités et interfaces utilisateur conformément à des documents de spécification stricts.",
            "Débogage de protocole propriétaire : Apprentissage et débogage de requêtes réseau basées sur un protocole réseau propriétaire.",
            "Collaboration à la conception : Discussion et affinement des choix de conception avec les membres de l'équipe pour garantir des solutions robustes et maintenables.",
            "Correction de bogues : Résolution de bogues d'interface et de bas niveau pour améliorer la stabilité du système et l'expérience utilisateur.",
            "Cloud et outils : Utilisation de Microsoft Azure pour les déploiements et le suivi des bogues.",
          ],
        },
        {
          role: "Ingénieur Fullstack Principal",
          company: "Doonya Labs",
          period: "Novembre 2024 - Juillet 2025",
          location: "Hybride",
          summary:
            "Conception d'une plateforme Django/DRF mise à l'échelle à plus de 50 000 requêtes API quotidiennes avec des temps de réponse P95 inférieurs à 200ms.",
          bullets: [
            "Scalabilité : Conception d'une plateforme Django/DRF mise à l'échelle à plus de 50 000 requêtes API quotidiennes avec des temps de réponse P95 inférieurs à 200ms.",
            "Développement frontend : Création d'interfaces réactives avec React/Next.js et gestion des transitions d'état complexes via les Hooks et les bibliothèques de formulaires modernes.",
            "Infrastructure : Provisionnement de l'infrastructure AWS avec Terraform et orchestration de conteneurs via Kubernetes. Mise en place d'un pipeline de déploiement GitHub Actions pour des mises en production automatisées et reproductibles.",
            "Observabilité : Mise en place de Prometheus et Grafana pour le monitoring et les métriques, assurant une visibilité en temps réel sur les performances du système.",
            "Leadership : Mentorat d'une équipe pluridisciplinaire de 4 ingénieurs et direction des cérémonies SCRUM.",
          ],
        },
        {
          role: "Ingénieur Fullstack Principal",
          company: "Gandyam Ligdi",
          period: "Juillet 2023 - Octobre 2024",
          location: "À distance",
          summary:
            "Développement d'API financières sécurisées et conformes ACID traitant plus de 10 000 transactions mensuelles, sur web et mobile.",
          bullets: [
            "Systèmes financiers : Développement d'API financières sécurisées et conformes ACID traitant plus de 10 000 transactions mensuelles.",
            "Livraison fullstack : Développement de fonctionnalités sur le web (React) et mobile (React Native/TypeScript), avec un focus sur l'optimisation des performances et l'itération rapide.",
            "Architecture : Conception d'un monolithe modulaire découplé utilisant le Repository Pattern et l'injection de dépendances.",
            "Optimisation : Augmentation du débit de 40% via une stratégie de mise en cache Redis et l'optimisation des requêtes PostgreSQL.",
            "CI/CD : Configuration d'un pipeline CI/CD avec GitHub Actions pour automatiser les déploiements et garantir la reproductibilité des mises en production.",
          ],
        },
        {
          role: "Ingénieur Logiciel Fullstack",
          company: "N7 Studio",
          period: "Avril 2021 - Avril 2023",
          location: "À distance, Canada",
          summary:
            "Développement de produits web et mobile pour une plateforme de streaming avec React, React Native, Node.js et GraphQL, supportant 5 000 utilisateurs simultanés.",
          bullets: [
            "Haute concurrence : Développement de services Node.js + TypeScript + GraphQL pour une plateforme de streaming supportant 5 000 utilisateurs simultanés.",
            "Développement frontend : Développement d'interfaces web réactives avec React et d'applications mobiles utilisant React Native et TypeScript.",
            "Fiabilité : Intégration de suites de tests complètes (PyTest, Cypress, Jest) dans les pipelines automatisés, atteignant 85% de couverture de code.",
            "Efficacité : Réduction des temps de réponse API de 45% par l'ajustement de la taille du pool de connexions et l'optimisation des requêtes.",
          ],
        },
        {
          role: "Administrateur Systèmes Linux Junior",
          company: "ANPTIC",
          period: "Mars 2021 - Juin 2021",
          location: "Ouagadougou",
          summary:
            "Stage orienté infrastructure autour des systèmes Linux, de l'architecture haute disponibilité et du monitoring réseau.",
          bullets: [
            "Optimisation noyau : Personnalisation et recompilation de noyaux Linux pour supporter des pilotes spécifiques et renforcer la sécurité.",
            "Monitoring réseau : Surveillance d'un réseau national avec NAGIOS pour garantir la disponibilité de l'infrastructure et une réponse rapide aux incidents.",
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
            "PMUB (React Native) : Développement d'une plateforme de paris hippiques gérant des flux de données en temps réel via WebSockets et intégrations de paiement sécurisées.",
            "Songre — EliteApp (React Native) : Architecture d'une super-app multi-services (Emploi, E-commerce, Médical, Livraison) gérant plusieurs types d'utilisateurs (clients, vendeurs, livreurs, admins).",
            "Allo Youri (Flutter & Web) : Implémentation d'une plateforme de livraison avec suivi GPS en temps réel (Maps API) et création d'une landing page responsive.",
            "Les Genets (Flutter) : Développement d'une application médicale offrant téléconsultations, services SOS et gestion de dossiers médicaux.",
            "AppShare (React Native & Go) : Conception d'un outil de distribution d'APK avec un backend robuste en Go, optimisant le versioning et le partage de binaires.",
            "Dom Immo (Next.js) : Développement de l'interface utilisateur haute performance pour une plateforme immobilière propulsée par l'IA.",
          ],
        },
      ] satisfies TimelineItem[],
      education: [
        {
          degree: "Maîtrise (M.Sc.) en Génie Logiciel",
          school: "Université Aube Nouvelle",
          specialization: "Systèmes Distribués et Architecture",
          period: "2021 - 2022",
        },
        {
          degree: "Licence (B.Sc.) en Réseaux Informatiques",
          school: "Université Aube Nouvelle",
          specialization: "TCP/IP, Systèmes Linux et Administration Réseau",
          period: "2017 - 2021",
        },
      ],
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
      typeInfrastructure: "Infrastructure",
      kindClient: "Missions client",
      kindEmployer: "Projets employeur",
      ctaExternal: "Ouvrir le projet ->",
      ctaInternal: "Ouvrir la page projet ->",
      unavailable: "Lien à venir",
    },
    blog: {
      title: "Blog | Rachid Rodrigue BADINI",
      description: "Articles et essais sur tout ce qui compte pour moi",
      heroTitle: "Articles & Essais",
      heroSubtitle: "Articles et essais sur tout ce qui compte pour moi",
      recentTitle: "Articles récents",
      readMore: "Lire la suite ->",
      searchPlaceholder: "Rechercher des articles...",
      noResults: "Aucun article correspondant à la recherche.",
    },
    article: {
      backToBlog: "Retour au blog",
    },
  },
} as const;
