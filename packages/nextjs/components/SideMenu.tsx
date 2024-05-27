import React from "react";
import Link from "next/link";
import { faTelegram, faTwitter } from "@fortawesome/free-brands-svg-icons";
import { faHome } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const SideMenu: React.FC = () => {
  return (
    <div className="side-menu">
      <Link href="/">
        <FontAwesomeIcon icon={faHome} size="2x" />
      </Link>
      <nav>
        <ul>
          <li>
            <Link href="/marketplace">Marketpalce</Link>
          </li>
          <li>
            <Link href="/earn">Earn $BACK</Link>
          </li>
          <li>
            <Link href="/settings">Settings</Link>
          </li>
        </ul>
      </nav>
      <div className="social-icons">
        <a href="https://twitter.com/fabbaist" target="_blank" rel="noopener noreferrer">
          <FontAwesomeIcon icon={faTwitter} size="2x" />
        </a>
        <a href="https://telegram.com/fabbaist" target="_blank" rel="noopener noreferrer">
          <FontAwesomeIcon icon={faTelegram} size="2x" />
        </a>
      </div>
    </div>
  );
};

export default SideMenu;
