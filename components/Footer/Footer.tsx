import React from "react";
import { useRouter } from "next/router";
import { getSiteLocale, siteContent } from "../../lib/site-content";

const Footer: React.FC = () => {
    const router = useRouter();
    const locale = getSiteLocale(router.locale);
    const t = siteContent[locale];

    return (
        <footer>
            <div className="container">
                <p>&copy; {new Date().getFullYear()} Rachid Rodrigue BADINI — {t.footerTitle}</p>
            </div>
        </footer>
    );
};

export default Footer;
