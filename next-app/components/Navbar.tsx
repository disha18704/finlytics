"use client";

import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Link,
} from "@nextui-org/react";
import Image from "next/image";
import logo from "../public/logo.svg";
import { usePathname } from "next/navigation";

export default function AppNavbar() {
  const pathname = usePathname();

  return (
    <Navbar className="navbar">
      <div className="flex items-center gap-4">
        <NavbarBrand className="flex items-center gap-2">
          <Image src={logo} alt="Logo" width={30} height={30} />
          <p className="font-bold text-inherit">finlytics</p>
        </NavbarBrand>
        <NavbarContent className="flex gap-4 ml-0">
          <NavbarItem isActive={pathname === "/"}>
            <Link
              color="foreground"
              href="/"
              className={`navbar-link ${pathname === "/" ? "active" : ""}`}
            >
              Home
            </Link>
          </NavbarItem>
          <NavbarItem isActive={pathname === "/chat-bot"}>
            <Link
              href="/chat-bot"
              aria-current="page"
              className={`navbar-link ${
                pathname === "/chat-bot" ? "active" : ""
              }`}
            >
              AI Chat
            </Link>
          </NavbarItem>
        </NavbarContent>
      </div>
    </Navbar>
  );
}
