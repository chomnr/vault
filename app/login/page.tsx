'use client'

import "@/styles/custom.css";
import styles from "../page.module.css";
import { VaultIcon } from "@/components/icons";
import { Input } from "@/components/input";
import { useFormState } from "react-dom";
import { loginUser } from "@/config/actions";

const initialState = {
    error: '',
}

export default function Login() {
    const [state, formAction] = useFormState(loginUser, initialState)
    return (
        <div className={styles.page}>
            <main className={styles.main}>
                <div className="login">
                    <h2>Sign In</h2>
                    <p>Login to access your vault(s)</p>
                    <form action={formAction}>
                        <p aria-live="polite">{state?.error}</p>
                        <Input type="username" name="username" placeholder="Username" required={true} />
                        <Input type="password" name="password" placeholder="Password" required={true} />
                        <div className="remember">
                            <Input type="checkbox" placeholder="Password" />
                            Remember me
                        </div>
                        <button>Login</button>
                    </form>
                </div>
            </main>
        </div>
    )
}
