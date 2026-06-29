import { PortfolioProject, Service } from "./interfaces";

const services: Service[] = [
  {
    icon: "react",
    title: "Next.js & React Frontend Development",
    description:
      "I have a solid foundation in React.js and can help you build nice looking websites. No matter how challenging your UI, just trust me.",
  },

  {
    icon: "mobile",
    title: "React Native Mobile Development",
    description:
      "With this awesome tool, I can build for you beautiful mobile apps with crisp UI, very quickly and so, with limited cost.",
  },

  {
    icon: "nest",
    title: "Typescript Nest.js Backend Development",
    description:
      "Nest.js became my backend framework of choice for my projects. Whether you want a REST or GraphQL API, I can build one for you.",
  },
];

const portfolioProjects: PortfolioProject[] = [
  {
    title: "Songre",
    description: {
      en: "Mobile application delivered for a multi-service client product.",
      fr: "Application mobile livrée pour un produit client multi-service.",
    },
    link: "https://play.google.com/store/apps/details?id=bf.songre&hl=fr",
    cover: "/images/projects/songre.webp",
    kind: "client",
    type: "application",
  },
  {
    title: "Les Genets",
    description: {
      en: "Healthcare product spanning patient-facing mobile usage and a supporting web presence.",
      fr: "Produit e-santé couvrant un usage mobile côté patient et une présence web associée.",
    },
    link: "https://les-genets.net/",
    cover: "/images/projects/genets.jpg",
    kind: "client",
    type: "application",
  },
  {
    title: "Cotton App",
    description: {
      en: "Platform website for a client product. Final public link will be added later.",
      fr: "Site plateforme pour un produit client. Le lien public final sera ajouté plus tard.",
    },
    link: "#",
    cover: "/images/projects/cotonapp.jpg",
    kind: "client",
    type: "website",
  },
  {
    title: "Blindtrust",
    description: {
      en: "Platform website built for a client-facing product at Doonya Labs.",
      fr: "Site plateforme construit pour un produit orienté client chez Doonya Labs.",
    },
    link: "https://app.blindtrust.doonyalabs.com",
    cover: "/images/projects/blindtrust.jpg",
    kind: "employer",
    type: "website",
  },
  {
    title: "Dom Immo",
    description: {
      en: "Platform website for a real-estate product with an AI-oriented user experience.",
      fr: "Site plateforme pour un produit immobilier avec une expérience orientée IA.",
    },
    link: "https://dom.immo/",
    cover: "/images/projects/domimmo.jpg",
    kind: "client",
    type: "website",
  },
  {
    title: "GandyamPay Website",
    description: {
      en: "Landing page for a payment-focused client product.",
      fr: "Page d'atterrissage pour un produit client orienté paiement.",
    },
    link: "https://gandyampay.com",
    cover: "/images/projects/gandyampay.png",
    kind: "client",
    type: "website",
  },
  {
    title: "GandyamPay Mobile App",
    description: {
      en: "Mobile application for a payment-focused client product.",
      fr: "Application mobile pour un produit client orienté paiement.",
    },
    link: "https://play.google.com/store/apps/details?id=com.gandyampay.main_app",
    cover: "/images/projects/gandyampay_mobile.png",
    kind: "client",
    type: "application",
  },
  {
    title: "Allo-Youri Landing Page",
    description: {
      en: "Landing page for a delivery-focused client product with real-time logistics flows.",
      fr: "Landing page pour un produit client orienté livraison avec des flux logistiques temps réel.",
    },
    link: "https://allo-youri.com",
    cover: "/images/projects/allo-youri.jpg",
    kind: "client",
    type: "website",
  },
  {
    title: "PEB.BF",
    description: {
      en: "A modern information hub and service platform for investors in Burkina Faso.",
      fr: "Un centre d'information et de services modernes pour les investisseurs au Burkina Faso.",
    },
    link: "https://peb.bf",
    cover: "/images/projects/peb.png",
    kind: "client",
    type: "website",
  },
  {
    title: "Allo-Youri",
    description: {
      en: "Application and website for a delivery-focused client product with real-time logistics flows.",
      fr: "Application et site web pour un produit client orienté livraison avec des flux logistiques temps réel.",
    },
    link: "https://allo-youri.com",
    cover: "/images/projects/allo-youri.jpg",
    kind: "client",
    type: "application",
  },
  {
    title: "Dyswis",
    description: {
      en: "Application and website product involving subscriptions, payments, and user-facing product flows.",
      fr: "Produit application et site web incluant abonnements, paiements et parcours utilisateurs.",
    },
    link: "#",
    cover: "/images/projects/dyswis.png",
    kind: "client",
    type: "application",
  },
  {
    title: "Successchool",
    description: {
      en: "Online school platform built for a client in France. Developed alongside Senegalese engineers as a freelance contract, leading frontend development, code quality, and feature delivery.",
      fr: "Plateforme d'école en ligne pour un client en France. Développée avec des ingénieurs sénégalais en freelance, avec prise en charge du frontend, de la qualité du code et de la livraison des fonctionnalités.",
    },
    link: "https://espace-membre.succeschool.com/",
    cover: "/images/projects/succeschool.png",
    kind: "client",
    type: "website",
  },
  {
    title: "Buildshare",
    description: {
      en: "Internal Android build distribution platform with a Django backend, async APK processing, and a React Native client.",
      fr: "Plateforme interne de distribution de builds Android avec backend Django, traitement asynchrone des APK et client React Native.",
    },
    link: "/projects/buildshare",
    cover: "/images/projects/buildshare.png",
    kind: "personal",
    type: "application",
    linkType: "internal",
  },
  {
    title: "Rapid Shooter",
    description: {
      en: "A C game inspired by NieR:Automata hacking phases, with its own build system, editor flow, and level data.",
      fr: "Un jeu en C inspiré des phases de hacking de NieR:Automata, avec son propre système de build, son flux d'édition et ses données de niveau.",
    },
    link: "https://github.com/bsrodrigue/rapid_shooter",
    cover: "/images/projects/placeholder-project.svg",
    kind: "personal",
    type: "game",
  },
  {
    title: "SmolORM",
    description: {
      en: "A tiny Python ORM built to keep SQL explicit while providing a fluent API for small apps and learning use cases.",
      fr: "Un mini ORM Python conçu pour garder SQL explicite tout en offrant une API fluide pour les petits projets et l'apprentissage.",
    },
    link: "https://github.com/bsrodrigue/smolorm",
    kind: "personal",
    type: "cli",
  },
  {
    title: "Dreamproxy",
    description: {
      en: "A Go reverse proxy and static file server built from scratch to explore HTTP parsing, TCP handling, and server internals.",
      fr: "Un proxy inverse et serveur de fichiers statiques en Go, construit from scratch pour explorer le parsing HTTP, TCP et les internals serveur.",
    },
    link: "/projects/dreamproxy",
    cover: "/images/projects/dreamproxy.png",
    kind: "personal",
    type: "infrastructure",
    linkType: "internal",
  },
  {
    title: "Vidyalog",
    description: {
      en: "A Python CLI video game backlog application focused on simple local workflow and personal organization.",
      fr: "Une application CLI Python de backlog de jeux vidéo, centrée sur un workflow local simple et l'organisation personnelle.",
    },
    link: "https://github.com/bsrodrigue/vidyalog",
    kind: "personal",
    type: "cli",
  },
  {
    title: "Memscan",
    description: {
      en: "A low-level C memory scanning experiment with custom targets, dump analysis, and systems-oriented internals.",
      fr: "Une expérimentation bas niveau en C autour du scan mémoire, avec cibles personnalisées, analyse de dump et internals système.",
    },
    link: "https://github.com/bsrodrigue/memscan",
    kind: "personal",
    type: "cli",
  },
];

const navbar_links = [
  {
    title: "Home",
    to: "/",
  },
  {
    title: "Portfolio",
    to: "/portfolio",
  },
  {
    title: "My services",
    to: "/#services",
  },
  {
    title: "Contact",
    to: "/#contact",
  },
  {
    title: "Social networks",
    to: "/#social",
  },
  {
    title: "Blog",
    to: "/blog",
  },
  {
    title: "Github",
    to: "https://github.com/bsrodrigue",
  },
];

const actuality = [
  "I am learning C/C++ by building video games",
  "I learn Math and Trigonometry",
  "I enjoy life",
];

const skills = [
  "Python",
  "TypeScript",
  "JavaScript",
  "Go",
  "C/C++",
  "Dart",
  "React",
  "Next.js",
  "React Native",
  "Flutter",
  "Node.js",
  "NestJS",
  "Django",
  "FastAPI",
  "PostgreSQL",
  "Redis",
  "Docker",
  "Kubernetes",
  "AWS",
  "Terraform",
  "CI/CD",
  "GraphQL",
  "Linux",
  "Git",
];

const settings = {
  portfolioProjects,
  services,
  navbar_links,
  actuality,
  skills,
};

export default settings;
