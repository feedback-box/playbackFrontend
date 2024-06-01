import React, { useCallback, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { faTelegram, faTwitter } from "@fortawesome/free-brands-svg-icons";
import { faCog } from "@fortawesome/free-solid-svg-icons";
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
    label: "Earn $BACK",
    href: "/earn",
  },
  {
    label: "Marketplace",
    href: "/marketplace",
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
          <li key={href}>
            <Link
              href={href}
              passHref
              className={`${
                isActive ? "bg-white/5 shadow-md" : ""
              } hover:bg-secondary hover:shadow-md focus:!bg-secondary active:!text-neutral py-1.5 px-3 text-sm rounded-full gap-2 grid grid-flow-row items-center`}
            >
              {icon}
              <span>{label}</span>
            </Link>
          </li>
        );
      })}
    </>
  );
};

export const SideMenu = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const burgerMenuRef = useRef<HTMLDivElement>(null);
  useOutsideClick(
    burgerMenuRef,
    useCallback(() => setIsDrawerOpen(false), []),
  );
  return (
    <div className="side-menu min-h-screen gradient-background p-4 flex flex-col items-center">
      <div className="navbar-start w-auto">
        <div className="drawer-navigation" ref={burgerMenuRef}>
          <Link href="/" className="">
            <Image alt="Playback Network logo" className="cursor-pointer" width={50} height={50} src="/logo.svg" />
          </Link>
          <label
            tabIndex={0}
            className={`btn btn-ghost ${isDrawerOpen ? "hover:bg-transparent" : "hover:bg-transparent"}`}
            onClick={() => {
              setIsDrawerOpen(prevIsOpenState => !prevIsOpenState);
            }}
          >
            <Bars3Icon className=" h-1/3" />
          </label>
          {isDrawerOpen && (
            <ul tabIndex={0} className=" mt-3 p-5 w-52">
              <SideMenuLinks />
              <div className="mb-5 pb-10 text-l">Having an Issue? Reach out to us</div>
            </ul>
          )}
        </div>
      </div>

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
