import "@/styles/custom.css";
import styles from "../page.module.css";
import { VaultIcon } from "@/components/icons";
import { Input } from "@/components/input";

export default function Login() {
    return (
        <div className={styles.page}>
            <main className={styles.main}>
                <div className="login">
                    <h2>Sign In</h2>
                    <p>Login to access your vault(s)</p>
                    <form>
                        <Input type="username" placeholder="Username" />
                        <Input type="password" placeholder="Password" />
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
