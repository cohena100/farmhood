import { createSharedPathnamesNavigation } from "next-intl/navigation";

export const locales = ["en", "de", "he"];

export const { Link, redirect, usePathname, useRouter } =
  createSharedPathnamesNavigation({ locales });
