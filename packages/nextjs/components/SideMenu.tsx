import React from "react";
import Image from "next/image";
import Link from "next/link";
import { faTelegram, faTwitter } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const SideMenu: React.FC = () => {
  return (
    <div className="side-menu min-h-screen w-1/4 bg-white/15 p-4 flex flex-col items-center">
      <Link href="/">
        <div className="mb-16">
          <Image alt="Playback Network logo" className="cursor-pointer" width={100} height={100} src="/logo.svg" />
        </div>
      </Link>
      <nav className="flex-grow">
        <ul className="flex flex-col items-center mt-auto list-none w-full">
          <li className="mb-12 pb-4 pt-4 border-b-2 border-white w-3/4 mx-auto">
            <Link href="/marketplace" className="text-lg font-bold">
              Marketplace
            </Link>
          </li>
          <li className="mb-12 pb-4 pt-4 border-b-2 border-white w-3/4 mx-auto">
            <Link href="/earn" className="text-lg font-bold">
              Earn $BACK
            </Link>
          </li>
          <li className="mb-12 pb-4 pt-4 border-b-2 border-white w-3/4 ">
            <Link href="/settings" className="text-lg font-bold ">
              Settings
            </Link>
          </li>
        </ul>
      </nav>
      <div className="mb-5 pb-10 text-l">Having any Issues? Reach out to us</div>
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
