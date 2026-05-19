import { ReactNode, useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { useRouter } from "next/router";

type MotionPageProps = {
  children: ReactNode;
};

export default function MotionPage({ children }: MotionPageProps) {
  const router = useRouter();
  const shouldReduceMotion = useReducedMotion();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || shouldReduceMotion) {
    return <main>{children}</main>;
  }

  return (
    <motion.main
      key={router.asPath}
      initial={{ opacity: 0, y: 14, filter: "blur(4px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{ duration: 0.58, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.main>
  );
}
