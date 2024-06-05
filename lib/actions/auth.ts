"use server";

import prisma from "@/lib/prismadb";
import { hash, verify } from "@node-rs/argon2";
import { cookies } from "next/headers";
import { lucia } from "@/lib/auth";
import { redirect } from "@/navigation";
import { generateIdFromEntropySize } from "lucia";
import { getTranslations } from "next-intl/server";
import { cache } from "react";
import { z } from "zod";

const parseUsername = (username: FormDataEntryValue | null) =>
  z
    .string()
    .trim()
    .toLowerCase()
    .min(3)
    .max(31)
    .refine((username) => /^[a-z0-9_-]+$/.test(username))
    .safeParse(username);

const parsePassword = (password: FormDataEntryValue | null) =>
  z.string().trim().min(6).max(255).safeParse(password);

export async function signup(_: any, formData: FormData) {
  const t = await getTranslations("home");
  let username = formData.get("username");
  const parsedUsername = parseUsername(username);
  if (!parsedUsername.success) {
    return {
      error: t("Invalid username"),
    };
  }
  username = parsedUsername.data;
  const existingUser = await prisma.user.findUnique({
    where: { username: username },
  });
  if (existingUser)
    return {
      error: t("Invalid username"),
    };
  let password = formData.get("password");
  const parsedPassword = parsePassword(password);
  if (!parsedPassword.success) {
    return {
      error: t("Invalid password"),
    };
  }
  password = parsedPassword.data;
  const passwordHash = await hash(password, {
    // recommended minimum parameters
    memoryCost: 19456,
    timeCost: 2,
    outputLen: 32,
    parallelism: 1,
  });
  const userId = generateIdFromEntropySize(10); // 16 characters long
  await prisma.user.create({
    data: {
      id: userId,
      username: username,
      password: passwordHash,
    },
  });
  const session = await lucia.createSession(userId, {});
  const sessionCookie = lucia.createSessionCookie(session.id);
  cookies().set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes,
  );
  redirect("/order");
}

export async function login(_: any, formData: FormData) {
  const t = await getTranslations("home");
  let username = formData.get("username");
  const parse = parseUsername(username);
  if (!parse.success) {
    return {
      error: t("Invalid username"),
    };
  }
  username = parse.data;
  const password = formData.get("password");
  if (
    typeof password !== "string" ||
    password.length < 6 ||
    password.length > 255
  ) {
    return {
      error: "Invalid password",
    };
  }
  const existingUser = await prisma.user.findUnique({
    where: { username: username.toLowerCase() },
  });
  if (!existingUser) {
    // NOTE:
    // Returning immediately allows malicious actors to figure out valid usernames from response times,
    // allowing them to only focus on guessing passwords in brute-force attacks.
    // As a preventive measure, you may want to hash passwords even for invalid usernames.
    // However, valid usernames can be already be revealed with the signup page among other methods.
    // It will also be much more resource intensive.
    // Since protecting against this is non-trivial,
    // it is crucial your implementation is protected against brute-force attacks with login throttling etc.
    // If usernames are public, you may outright tell the user that the username is invalid.
    return {
      error: t("Incorrect username or password"),
    };
  }
  const validPassword = await verify(existingUser.password, password, {
    memoryCost: 19456,
    timeCost: 2,
    outputLen: 32,
    parallelism: 1,
  });
  if (!validPassword) {
    return {
      error: "Incorrect username or password",
    };
  }
  const session = await lucia.createSession(existingUser.id, {});
  const sessionCookie = lucia.createSessionCookie(session.id);
  cookies().set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes,
  );
  redirect("/order");
}

export const validateRequest = cache(async () => {
  const sessionId = cookies().get(lucia.sessionCookieName)?.value ?? null;
  if (!sessionId) {
    return {
      user: null,
      session: null,
    };
  }

  const result = await lucia.validateSession(sessionId);
  // next.js throws when you attempt to set cookie when rendering page
  try {
    if (result.session && result.session.fresh) {
      const sessionCookie = lucia.createSessionCookie(result.session.id);
      cookies().set(
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes,
      );
    }
    if (!result.session) {
      const sessionCookie = lucia.createBlankSessionCookie();
      cookies().set(
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes,
      );
    }
  } catch {}
  return result;
});

export async function logout() {
  const { session } = await validateRequest();
  if (!session) {
    return {
      error: "Unauthorized",
    };
  }
  await lucia.invalidateSession(session.id);
  const sessionCookie = lucia.createBlankSessionCookie();
  cookies().set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes,
  );
  redirect("/");
}

export async function deleteUser() {
  const { user, session } = await validateRequest();
  if (!session) {
    return {
      error: "Unauthorized",
    };
  }
  await lucia.invalidateSession(session.id);
  const sessionCookie = lucia.createBlankSessionCookie();
  cookies().set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes,
  );
  await prisma.user.delete({
    where: {
      id: user.id,
    },
  });
  redirect("/");
}
