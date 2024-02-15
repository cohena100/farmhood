import { authMiddleware } from "@clerk/nextjs";
import createMiddleware from "next-intl/middleware";
import { locales } from "./navigation";

const intlMiddleware = createMiddleware({
  locales,
  defaultLocale: "en",
});

export default authMiddleware({
  beforeAuth(request) {
    return intlMiddleware(request);
  },
  publicRoutes: ["/", "/:locale", "/:locale/sign-in", "/:locale/sign-up"],
  // debug: true,
});

export const config = {
  matcher: [
    "/((?!.+\\.[\\w]+$|_next).*)",
    "/",
    "/(api|trpc)(.*)",
    "/(en|de|he)/:path*",
  ],
};
