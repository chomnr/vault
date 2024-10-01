'use server'

import { redirect } from 'next/navigation'
import { HOST_URL } from './general'
import { cookies } from 'next/headers';
import { getIronSession } from 'iron-session';
import { SESSION_OPTIONS, SessionData } from './session';

/*
export async function loginUser(prevState: any, formData: FormData) {
    const username = formData.get('username')
    const password = formData.get('password')
    return fetch(HOST_URL + "/api/login", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    }).then(async response => {
        if (!response.ok) {
            const error = await response.json()
            return { error: error["error"] }
        } else {
            return redirect("/")
        }
    }).catch(() => {
        return { error: 'Something went wrong on our side' }
    });
}
*/


export async function loginUser(prevState: { error: any }, formData: FormData) {
    const username = formData.get('username') as string
    const password = formData.get('password') as string
    const remember = formData.get('remember') === 'on'
    const response = await fetch(HOST_URL + "/api/login", {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, remember }),
    });
    if (!response.ok) {
        const error = await response.json()
        return { error: error["error"] }
    } else {
        const session = await getIronSession<SessionData>(cookies(), SESSION_OPTIONS)
        session.timeStamp = Date.now()
        session.aesKey = undefined
        session.currentVault = undefined
        session.remember = true
        await session.save()
    }
    return { error: null };
}