import "@/styles/custom.css";
import styles from "../page.module.css";
import { VaultIcon } from "@/components/icons";
import { Input } from "@/components/input";

export default function Login() {
    return (
        <div className={styles.page}>
            <main className={styles.main}>
                <div className="login">
                    <h1>SIGN IN</h1>
                    <p>Sign in to access your vault(s)</p>
                    <Input type="username" placeholder="Username"/>
                    <Input type="password" placeholder="Password"/>
                </div>
            </main>
        </div>
    )
}
