import { getIronSession, SessionOptions } from "iron-session";
import { COOKIE_MAX_AGE, COOKIE_NAME, COOKIE_SECRET, NODE_ENV } from "./general";
import { cookies } from "next/headers";
import { Vault } from "@prisma/client";

export interface SessionData {
    timeStamp: number,
    vault: SessionVault | undefined,
    remember: boolean
}

export interface SessionVault {
    id: string | undefined,
    name: string | undefined,
    key: string | undefined
}

export const SESSION_OPTIONS: SessionOptions = {
    password: COOKIE_SECRET,
    cookieName: COOKIE_NAME,
    cookieOptions: {
        secure: NODE_ENV === "production",
        maxAge: COOKIE_MAX_AGE(true)
    },
};

export const newSession = async (vault: SessionVault | undefined, remember: boolean) => {
    const session = await getIronSession<SessionData>(cookies(), SESSION_OPTIONS)
    session.timeStamp = Date.now()
    session.vault = vault
    session.remember = remember
    await session.save()
}
