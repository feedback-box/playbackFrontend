import React, { useCallback, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { faTelegram, faTwitter } from "@fortawesome/free-brands-svg-icons";
import { faCog, faDollar, faShop } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Bars3Icon } from "@heroicons/react/24/outline";
import { useOutsideClick } from "~~/hooks/scaffold-eth";

type SideMenuLink = {
  label: string;
  href: string;
  icon?: React.ReactNode;
};

export const sideMenuLinks: SideMenuLink[] = [
  {
    label: "Earn",
    href: "/",
    icon: <FontAwesomeIcon icon={faDollar} size="2x" />,
  },
  {
    label: "Marketplace",
    href: "/marketplace",
    icon: <FontAwesomeIcon icon={faShop} size="2x" />,
  },
  {
    label: "Settings",
    href: "/settings",
    icon: <FontAwesomeIcon icon={faCog} size="2x" />,
  },
];

export const SideMenuLinks = () => {
  const pathname = usePathname();

  return (
    <>
      {sideMenuLinks.map(({ label, href, icon }) => {
        const isActive = pathname === href;
        return (
          <li className="mt-5" key={href}>
            <Link
              href={href}
              passHref
              className={`${
                isActive ? "bg-black/10 shadow-md" : ""
              } hover:bg-black hover:text-white hover:shadow-md focus:bg-black focus:text-white active:!text-neutral py-1.5 px-3 text-sm rounded gap-2 flex flex-row items-center`}
            >
              <div className="flex items-center justify-center w-10 h-10">{icon}</div>
              <span className="flex ml-6">{label}</span>
            </Link>
          </li>
        );
      })}
    </>
  );
};
const logoSize = 70;
export const SideMenu = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const burgerMenuRef = useRef<HTMLDivElement>(null);
  useOutsideClick(
    burgerMenuRef,
    useCallback(() => setIsDrawerOpen(false), []),
  );
  return (
    <div className="side-menu h-screen border border-black p-6 flex flex-col items-center">
      <div className="navbar-start w-auto h-auto">
        <div className="drawer-navigation" ref={burgerMenuRef}>
          <Link href="/" className="">
            <Image
              alt="Playback Network logo"
              className="cursor-pointer rounded-md"
              width={logoSize}
              height={logoSize}
              src="/logo2.jpg"
            />
          </Link>
          <label
            tabIndex={0}
            className={`btn btn-ghost ${isDrawerOpen ? "hover:bg-transparent" : "hover:bg-transparent"}`}
            onClick={() => {
              setIsDrawerOpen(prevIsOpenState => !prevIsOpenState);
            }}
          >
            <Bars3Icon className=" h-2/3" />
          </label>
          {isDrawerOpen && (
            <ul tabIndex={0} className=" mt-10 p-5 w-52">
              <SideMenuLinks />
            </ul>
          )}
        </div>
      </div>
      <div className="mb-5 pb-10 mt-auto">
        <div className="mb-5">Having an Issue? </div>
        <div className="mb-5">Reach out to us:</div>
        <div className="social-icons">
          <a href="https://twitter.com/fabbaist" target="_blank" rel="noopener noreferrer">
            <FontAwesomeIcon icon={faTwitter} size="3x" color="black" />
          </a>
          <a href="https://telegram.com/fabbaist" target="_blank" rel="noopener noreferrer">
            <FontAwesomeIcon icon={faTelegram} size="3x" color="black" />
          </a>
        </div>
      </div>
    </div>
  );
};

export default SideMenu;
