import React from "react";
import Image from "next/image";
import Link from "next/link";
import { faTelegram, faTwitter } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const SideMenu: React.FC = () => {
  return (
    <div className="side-menu">
      <Link href="/">
        <div>
          <Image alt="SE2 logo" className="cursor-pointer" width={100} height={100} src="/logo.svg" />
        </div>
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
