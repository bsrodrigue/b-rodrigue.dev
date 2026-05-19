import { useEffect } from "react";
import { useRouter } from "next/router";
import { animate, inView } from "framer-motion";

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

    const viewportHeight = window.innerHeight;
    const elements = Array.from(document.querySelectorAll<HTMLElement>(revealSelectors));
    const revealTargets = elements.filter((element) => element.getBoundingClientRect().top > viewportHeight * 0.72);

    revealTargets.forEach((element, index) => {
      element.style.opacity = "0";
      element.style.transform = "translateY(30px)";
      element.style.willChange = "opacity, transform";
      element.dataset.motionDelay = `${Math.min(index % 5, 4) * 0.055}`;
    });

    const reveal = (target: HTMLElement) => {
      const delay = Number(target.dataset.motionDelay || 0);

      animate(
        target,
        {
          opacity: 1,
          transform: "translateY(0px)",
        },
        {
          delay,
          duration: 0.68,
          ease: [0.16, 1, 0.3, 1],
        }
      ).then(() => {
        target.style.willChange = "auto";
      });
    };

    const cleanup = inView(
      revealTargets,
      (element) => {
        reveal(element as HTMLElement);
      },
      {
        margin: "0px 0px -12% 0px",
        amount: 0.12,
      }
    );

    const fallback = window.setTimeout(() => {
      revealTargets.forEach((target) => {
        if (target.style.opacity === "0") reveal(target);
      });
    }, 1600);

    return () => {
      cleanup();
      window.clearTimeout(fallback);
    };
  }, [router.asPath]);

  return null;
}
