import React from "react";
import { FaGithub, FaLinkedin } from "react-icons/fa";

const Footer: React.FC = () => {
    return (
        <footer>
            <div className="container">
                <p>© {new Date().getFullYear()} BRodrigue. All rights reserved.</p>
                <div style={{ marginTop: '1rem', fontSize: '1.5rem', display: 'flex', justifyContent: 'center', gap: '1rem' }}>
                    <a href="https://linkedin.com" target="_blank" rel="noreferrer">
                        <FaLinkedin />
                    </a>
                    <a href="https://github.com/bsrodrigue" target="_blank" rel="noreferrer">
                        <FaGithub />
                    </a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
