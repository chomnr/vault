import { SessionOptions } from "iron-session";
import { COOKIE_MAX_AGE, COOKIE_NAME, COOKIE_SECRET, NODE_ENV } from "./general";

export interface SessionData {
    timeStamp: number,
    aesKey: Uint8Array | undefined,
    currentVault: string | undefined,
}


export const SESSION_OPTIONS: SessionOptions = {
    password: COOKIE_SECRET,
    cookieName: COOKIE_NAME,
    cookieOptions: {
        secure: NODE_ENV === "production",
        maxAge: COOKIE_MAX_AGE
    },
};