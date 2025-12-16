import React from "react";
import Link from "next/link";
import settings from "../../settings";

const Header: React.FC = () => {
  return (
    <header>
      <div className="container">
        <Link href="/" style={{ fontWeight: 'bold', fontSize: '1.2rem', color: '#333' }}>
          BRodrigue
        </Link>
        <nav>
          {settings.navbar_links.map((link: any, index: number) => (
            <Link
              key={index}
              href={link.to}
              style={{ color: '#333' }}
            >
              {link.title}
            </Link>
          ))}
          <a href="/resume.pdf" style={{ fontWeight: 'bold' }}>
            Resume
          </a>
        </nav>
      </div>
    </header>
  );
};

export default Header;
