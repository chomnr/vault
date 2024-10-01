import "@/styles/custom.css";
import styles from "../page.module.css";
import { VaultIcon } from "@/components/icons";
import { Input } from "@/components/input";

export default function Login() {
    return (
        <div className={styles.page}>
            <main className={styles.main}>

                <div className="login">
                    <form>
                        <Input type="username" placeholder="Username" />
                        <Input type="password" placeholder="Password" />
                        <button>Login</button>
                    </form>
                </div>
            </main>
        </div>
    )
}
