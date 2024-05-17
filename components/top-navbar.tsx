"use client";

import Link from "next/link";
import {
  Avatar,
  DarkThemeToggle,
  Dropdown,
  DropdownHeader,
  DropdownItem,
  Navbar,
  NavbarBrand,
  NavbarCollapse,
  NavbarToggle,
} from "flowbite-react";
import LocaleSwitcher from "./LocaleSwitcher";
import { deleteUser, logout } from "@/lib/actions/auth";
import { useTranslations } from "next-intl";
import { Profile } from "@prisma/client";

interface Props {
  profile: Profile | null;
}

export default function TopNavbar({ profile }: Props) {
  const t = useTranslations("home");
  const firstname =
    (profile && profile.name.split(" ").slice(0, -1).join(" ")) || " ";
  const lastname =
    (profile && profile.name.split(" ").slice(-1).join(" ")) || " ";
  return (
    <Navbar fluid border>
      <NavbarBrand as={Link} href="/">
        <span className=" text-xl font-semibold text-pink-600 dark:text-pink-600">
          משק אביהו🍓🥒🫐🍅
        </span>
      </NavbarBrand>
      <NavbarToggle />
      <NavbarCollapse>
        <div className="flex gap-3 items-center">
          {profile && (
            <Dropdown
              label={
                <Avatar
                  placeholderInitials={firstname.charAt(0) + lastname.at(0)}
                  size={"sm"}
                  rounded
                />
              }
              arrowIcon={false}
              inline
            >
              <DropdownHeader>
                <span className="block text-sm">{profile.name}</span>
                <span className="block truncate text-sm font-medium">
                  {profile.phone}
                </span>
              </DropdownHeader>
              <DropdownItem onClick={async () => await logout()}>
                {t("Sign out")}
              </DropdownItem>
              <DropdownItem onClick={async () => await deleteUser()}>
                {t("Delete user")}
              </DropdownItem>
            </Dropdown>
          )}
          <DarkThemeToggle />
          <LocaleSwitcher />
        </div>
      </NavbarCollapse>
    </Navbar>
  );
}
