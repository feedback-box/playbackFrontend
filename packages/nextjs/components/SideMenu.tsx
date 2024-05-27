import React from "react";
import Link from "next/link";
import { faTelegram, faTwitter } from "@fortawesome/free-brands-svg-icons";
import { faHome } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const SideMenu: React.FC = () => {
  return (
    <div className="side-menu">
      <Link href="/">
        <a className="logo-placeholder">
          <FontAwesomeIcon icon={faHome} size="2x" />
        </a>
      </Link>
      <nav>
        <ul>
          <li>
            <Link href="/marketplace">
              <a>Marketplace</a>
            </Link>
          </li>
          <li>
            <Link href="/earn">
              <a>Earn $BACK</a>
            </Link>
          </li>
          <li>
            <Link href="/settings">
              <a>Settings</a>
            </Link>
          </li>
        </ul>
      </nav>
      <div className="social-icons">
        <a href="https://twitter.com/yourproject" target="_blank" rel="noopener noreferrer">
          <FontAwesomeIcon icon={faTwitter} size="2x" />
        </a>
        <a href="https://telegram.com/yourproject" target="_blank" rel="noopener noreferrer">
          <FontAwesomeIcon icon={faTelegram} size="2x" />
        </a>
      </div>
    </div>
  );
};

export default SideMenu;
