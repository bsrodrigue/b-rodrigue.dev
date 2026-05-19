import { useEffect } from "react";
import { useRouter } from "next/router";

const revealSelectors = [
  "section",
  ".project-card",
  ".blog-item",
  ".timeline-entry",
  ".about-card",
  ".proof-item",
  ".feature-row",
  ".changelog-entry",
  ".challenge-card",
  ".metric-card",
  ".project-gallery-item",
  ".project-snapshot-card",
  ".markdown-content > *",
].join(",");

export default function MotionEffects() {
  const router = useRouter();

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    const root = document.documentElement;
    const elements = Array.from(document.querySelectorAll<HTMLElement>(revealSelectors));

    root.classList.add("motion-ready");

    elements.forEach((element, index) => {
      element.classList.remove("is-visible");
      element.classList.add("reveal-target");
      element.style.setProperty("--reveal-delay", `${Math.min(index % 6, 5) * 70}ms`);
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      {
        rootMargin: "0px 0px -12% 0px",
        threshold: 0.12,
      }
    );

    elements.forEach((element) => observer.observe(element));

    return () => {
      observer.disconnect();
    };
  }, [router.asPath]);

  return null;
}
