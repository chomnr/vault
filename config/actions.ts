'use server'

import { redirect } from 'next/navigation'
import { HOST_URL } from './general'
import { cookies } from 'next/headers';

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
            redirect("/")
        }
    }).catch((er) => {
        return { error: 'Something went wrong on our side' }
    });
}