import { getIronSession } from "iron-session";
import type { SessionOptions } from "iron-session";
import { cookies } from "next/headers";
import { env } from "@/lib/env";

export type SessionUser = {
  userId: string;
  matricula: string;
  role: "student" | "admin";
  studentId?: string;
};

export type SessionData = {
  user?: SessionUser;
};

const sessionOptions: SessionOptions = {
  password: env.SESSION_PASSWORD,
  cookieName: "espe_session",
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    sameSite: "lax",
    path: "/",
  },
};

export async function getSession() {
  return getIronSession<SessionData>(cookies(), sessionOptions);
}

