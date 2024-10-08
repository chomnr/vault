'use server'

import { redirect } from 'next/navigation'
import { COOKIE_MAX_AGE, HOST_URL } from './general'
import { newSession, SESSION_OPTIONS, SessionData } from './session';
import { getIronSession } from 'iron-session';
import { cookies, headers } from 'next/headers';
import { VAULT_DECRYPTION_EMPTY_KEY } from './response';
import { request } from 'http';

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
    await newSession(undefined, remember)
    return redirect("/")
}

export async function createVault(prevState: { result: { error: any; code: any; timestamp: any } }, form: FormData) {
    const formData = new FormData()
    form.forEach((value, key) => {
        if (key === 'key-upload') {
            if ((value as File).size > 0) {
                formData.append(key, value)
            }
        } else {
            formData.append(key, value)
        }
    })
    const response = await fetch(HOST_URL + "/api/vaults", {
        method: 'POST',
        headers: {
            "Cookie": headers().get("cookie") as string
        },
        credentials: 'include',
        body: formData
    });
    if (!response.ok) {
        const result = await response.json()
        return {
            result: {
                error: result.error,
                code: result.code,
                timestamp: result.timestamp || new Date().toISOString(),
                data: null
            }
        }
    }
    return {
        result: {
            error: null,
            code: null,
            timestamp: new Date().toISOString(),
            data: await response.text()
        }
    }
}

export async function decryptVault(prevState: { result: { error: any; code: any; timestamp: any } }, form: FormData) {
    const formData = new FormData();
    form.forEach((value, key) => {
        if (key === 'key-upload') {
            if ((value as File).size > 0) {
                formData.append(key, value);
            }
        }
    });
    const response = await fetch(HOST_URL + "/api/vaults/decrypt", {
        method: 'POST',
        headers: {
            "Cookie": headers().get("cookie") as string
        },
        credentials: 'include',
        body: formData
    });
    if (!response.ok) {
        const result = await response.json();
        return {
            result: {
                error: result.error,
                code: result.code,
                timestamp: result.timestamp || new Date().toISOString(),
                data: null
            }
        };
    }
    const setCookieHeader = response.headers.get('set-cookie');
    if (setCookieHeader) {
        const cookieParts = setCookieHeader.split(';');
        const [nameValue] = cookieParts[0].split('=');
        const cookieName = nameValue.trim(); 
        const cookieValue = cookieParts[0].split('=')[1].trim();
        let maxAge: number | undefined;

        for (const part of cookieParts) {
            const [key, val] = part.trim().split('=');
            if (key.toLowerCase() === 'max-age') {
                maxAge = parseInt(val, 10);
                break;
            } else if (key.toLowerCase() === 'expires') {
                const expiresDate = new Date(val);
                maxAge = Math.floor((expiresDate.getTime() - Date.now()) / 1000); // Convert to seconds
                break;
            }
        }
        cookies().set({
            name: cookieName,
            value: cookieValue,
            path: '/',
            maxAge: maxAge !== undefined ? maxAge : 60 * 60 * 24 * 30,
        });
    }
    redirect("/vault")
    return {
        result: {
            error: null,
            code: null,
            timestamp: new Date().toISOString(),
            data: await response.json()
        }
    };
}

export async function deleteVault(prevState: { result: { error: any; code: any; timestamp: any; } }, form: FormData) {
    const { confirmation } = {
        confirmation: form.get('confirmation') as string,
    };
    const response = await fetch(HOST_URL + "/api/vaults/delete", {
        method: 'POST',
        credentials: 'include',
        headers: { 
            'Content-Type': 'application/json',
            "Cookie": headers().get("cookie") as string
        },
        body: JSON.stringify({ confirmation }),
    });
    if (!response.ok) {
        const result = await response.json();
        return {
            result: {
                error: result.error,
                code: result.code,
                timestamp: result.timestamp || new Date().toISOString(),
                data: null
            }
        };
    }
    redirect("/")
    return {
        result: {
            error: null,
            code: null,
            timestamp: new Date().toISOString(),
            data: ""
        }
    };
}
