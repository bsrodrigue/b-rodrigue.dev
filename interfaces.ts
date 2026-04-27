export type ProjectKind = "client" | "employer" | "personal";
export type ProjectType = "application" | "website" | "game" | "cli";

export interface PortfolioProject {
  title: string;
  description: {
    en: string;
    fr: string;
  };
  link: string;
  cover?: string;
  kind: ProjectKind;
  type: ProjectType;
  linkType?: "internal" | "external";
}

export interface Service {
  icon?:string;
  title: string;
  description: string;
  price?: string;
}

export interface ContentInformation{
  title: string;
  description: string;
  link: string;
  cover: string;
  stack?: string;
}
