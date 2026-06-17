import "server-only";

import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

const adminSessionCookie = "khi_estate_admin_session";
const sessionMaxAgeSeconds = 60 * 60 * 8;

type AdminSession = {
  username: string;
  iat: number;
  exp: number;
};

type AdminSessionResult =
  | { ok: true; session: AdminSession }
  | {
      ok: false;
      reason: "config" | "unauthenticated";
      message: string;
    };

type CredentialResult =
  | { ok: true; username: string }
  | { ok: false; reason: "config" | "credentials"; message: string };

function getAdminConfig() {
  const legacyUsername = process.env.ADMIN_EMAIL || process.env.ADMIN_EMAILS || "";

  return {
    username: process.env.ADMIN_USERNAME || legacyUsername.split(",")[0]?.trim() || "",
    password: process.env.ADMIN_PASSWORD || "",
    secret: process.env.ADMIN_SESSION_SECRET || "",
  };
}

function hasAdminConfig() {
  const config = getAdminConfig();
  return Boolean(config.username && config.password && config.secret);
}

function safeEqualText(left: string, right: string) {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);

  if (leftBuffer.length !== rightBuffer.length) {
    return false;
  }

  return timingSafeEqual(leftBuffer, rightBuffer);
}

function signPayload(payload: string) {
  return createHmac("sha256", getAdminConfig().secret)
    .update(payload)
    .digest("base64url");
}

function createToken(session: AdminSession) {
  const payload = Buffer.from(JSON.stringify(session)).toString("base64url");
  const signature = signPayload(payload);
  return `${payload}.${signature}`;
}

function parseToken(token: string): AdminSession | null {
  const config = getAdminConfig();

  if (!hasAdminConfig()) {
    return null;
  }

  const [payload, signature] = token.split(".");

  if (!payload || !signature) {
    return null;
  }

  const expectedSignature = signPayload(payload);

  if (!safeEqualText(signature, expectedSignature)) {
    return null;
  }

  try {
    const session = JSON.parse(
      Buffer.from(payload, "base64url").toString("utf8"),
    ) as AdminSession;
    const now = Math.floor(Date.now() / 1000);

    if (
      session.username !== config.username ||
      typeof session.exp !== "number" ||
      session.exp <= now
    ) {
      return null;
    }

    return session;
  } catch {
    return null;
  }
}

function cookieOptions(expires: Date) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    expires,
  };
}

export function validateAdminCredentials(
  username: string,
  password: string,
): CredentialResult {
  const config = getAdminConfig();

  if (!hasAdminConfig()) {
    return {
      ok: false,
      reason: "config",
      message: "Admin credentials are not configured.",
    };
  }

  if (
    !safeEqualText(username, config.username) ||
    !safeEqualText(password, config.password)
  ) {
    return {
      ok: false,
      reason: "credentials",
      message: "Invalid admin username or password.",
    };
  }

  return { ok: true, username: config.username };
}

export async function createAdminSession(username: string) {
  const now = Math.floor(Date.now() / 1000);
  const exp = now + sessionMaxAgeSeconds;
  const token = createToken({ username, iat: now, exp });
  const cookieStore = await cookies();

  cookieStore.set({
    name: adminSessionCookie,
    value: token,
    maxAge: sessionMaxAgeSeconds,
    ...cookieOptions(new Date(exp * 1000)),
  });
}

export async function clearAdminSession() {
  const cookieStore = await cookies();

  cookieStore.set({
    name: adminSessionCookie,
    value: "",
    maxAge: 0,
    ...cookieOptions(new Date(0)),
  });
}

export async function getAdminSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(adminSessionCookie)?.value;

  if (!token) {
    return null;
  }

  return parseToken(token);
}

export async function requireAdminSession(): Promise<AdminSessionResult> {
  if (!hasAdminConfig()) {
    return {
      ok: false,
      reason: "config",
      message: "Admin credentials are not configured.",
    };
  }

  const session = await getAdminSession();

  if (!session) {
    return {
      ok: false,
      reason: "unauthenticated",
      message: "Admin login required.",
    };
  }

  return { ok: true, session };
}
