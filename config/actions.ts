'use server'

import { redirect } from 'next/navigation'
import { COOKIE_MAX_AGE, HOST_URL } from './general'
import { newSession, SESSION_OPTIONS, SessionData } from './session';
import { getIronSession } from 'iron-session';
import { cookies } from 'next/headers';

export async function isAuthenticated() {
    const session = await getIronSession<SessionData>(cookies(), SESSION_OPTIONS)
    const COOKIE_AGE_OFFSET = COOKIE_MAX_AGE(session?.remember) * 1000
    if (!session || Object.keys(session).length === 0 || Date.now() > (session.timeStamp + COOKIE_AGE_OFFSET)) {
        return false
    } else {
        return true
    }
}

export async function login(prevState: { result: { error: any; code: any; timestamp: any; } }, form: FormData) {
    const { username, password, remember } = {
        username: form.get('username') as string,
        password: form.get('password') as string,
        remember: form.get('remember') === 'on'
    }
    const response = await fetch(HOST_URL + "/api/login", {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, remember }),
    })
    if (!response.ok) {
        const result = await response.json();
        return {
            result: {
                error: result.error,
                code: result.code,
                timestamp: result.timestamp || new Date().toISOString(),
            }
        }
    }
    await newSession(new Uint8Array(), "", remember)
    return redirect("/")
}
