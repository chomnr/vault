import { getIronSession, SessionOptions } from "iron-session";
import { COOKIE_MAX_AGE, COOKIE_NAME, COOKIE_SECRET, NODE_ENV } from "./general";
import { cookies } from "next/headers";

export interface SessionData {
    timeStamp: number,
    key: Uint8Array | undefined,
    vault: string | undefined,
    remember: boolean
}


export const SESSION_OPTIONS: SessionOptions = {
    password: COOKIE_SECRET,
    cookieName: COOKIE_NAME,
    cookieOptions: {
        secure: NODE_ENV === "production",
        maxAge: COOKIE_MAX_AGE(true)
    },
};

export const newSession = async (key: Uint8Array, vault: string, remember: boolean) => {
    const session = await getIronSession<SessionData>(cookies(), SESSION_OPTIONS)
    session.timeStamp = Date.now()
    session.key = key
    session.vault = vault
    session.remember = remember
    await session.save()
}

export const destroySession = async () => {
    const session = await getIronSession<SessionData>(cookies(), SESSION_OPTIONS)
    await session.destroy()
}