'use client'

import "@/styles/custom.css";
import styles from "../page.module.css";
import { useFormState } from "react-dom";
import { loginUser } from "@/config/actions";
import { Input } from "@/components/input";
import { Alert } from "@/components/alert";

const initialState = {
    error: null,
};

export default function Login() {
    const [state, formAction] = useFormState(loginUser, initialState);

    return (
        <div className={styles.page}>
            <main className={styles.main}>
                <div className="login">
                    <h2>Sign In</h2>
                    <p>Login to access your vault(s)</p>
                    <form action={formAction}>
                        {state.error && <Alert type={"danger"} message={state.error}/>}
                        <br/>
                        <Input type="text" name="username" placeholder="Username" required />
                        <Input type="password" name="password" placeholder="Password" required />
                        <div className="remember">
                            <Input type="checkbox" name="remember" />
                            Remember me
                        </div>
                        <button type="submit">Login</button>
                    </form>
                </div>
            </main>
        </div>
    );
}