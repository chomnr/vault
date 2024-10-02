import styles from "./page.module.css";
import { FloatingLogout } from "@/components/logout";

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        vaults go here...
      </main>
    </div>
  );
}
