import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { getSiteLocale, siteContent } from "../../lib/site-content";

const Header: React.FC = () => {
  const router = useRouter();
  const locale = getSiteLocale(router.locale);
  const t = siteContent[locale];
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  useEffect(() => {
    const savedTheme = window.localStorage.getItem("theme");
    const preferredTheme =
      savedTheme === "light" || savedTheme === "dark"
        ? savedTheme
        : window.matchMedia("(prefers-color-scheme: light)").matches
          ? "light"
          : "dark";

    document.documentElement.dataset.theme = preferredTheme;
    setTheme(preferredTheme);
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = nextTheme;
    window.localStorage.setItem("theme", nextTheme);
    setTheme(nextTheme);
  };

  return (
    <header>
      <div className="container">
        <Link href="/" className="logo">
          RRB
        </Link>
        <nav>
          <Link href="/">{t.nav.home}</Link>
          <Link href="/portfolio">{t.nav.portfolio}</Link>
          <Link href="/blog">{t.nav.blog}</Link>
        </nav>
        <div className="header-controls">
          <button
            type="button"
            className="theme-toggle"
            aria-label={theme === "dark" ? t.nav.themeLight : t.nav.themeDark}
            onClick={toggleTheme}
          >
            {theme === "dark" ? "☀" : "☾"}
          </button>
          <div className="language-switcher" aria-label={t.nav.language}>
          <Link href={router.asPath} locale="en" className={locale === "en" ? "language-link active" : "language-link"}>
            EN
          </Link>
          <Link href={router.asPath} locale="fr" className={locale === "fr" ? "language-link active" : "language-link"}>
            FR
          </Link>
        </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
