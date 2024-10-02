'use client'

import { useEffect, useRef } from "react";
import styles from "./page.module.css";

export default function Home() {
  const vaultsRef = useRef<HTMLDivElement>(null)
  /*
  useEffect(() => {
    if (vaultsRef.current) {
      const vaults = vaultsRef.current;
      const children = vaults.children;
      for (let i = 0; i < children.length; i++) {
        const vault = children[i] as HTMLDivElement;
        vault.addEventListener('mouseover', (e) => {
          (vault.children[0] as HTMLDivElement).style.borderColor = 'var(--vault-individual-hover-border)';
        })
        vault.addEventListener('mouseout', (e) => {
          (vault.children[0] as HTMLDivElement).style.borderColor = 'var(--vault-individual-border)';
        })
      }
    }
  }, []);
*/
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <div className="vault header">VAULT(s)</div>
        <div ref={vaultsRef} className="vaults">
          <div className="vault">
            <div className="inner">
              <div className="icon">1</div>
            </div>
            <div className="name">VAULT ONE</div>
          </div>
          <div className="vault">
            <div className="inner">
              <div className="icon">2</div>
            </div>
            <div className="name">VAULT TWO</div>
          </div>
          <div className="vault">
            <div className="inner">
              <div className="icon">3</div>
            </div>
            <div className="name">VAULT THREE</div>
          </div>
          <div className="vault">
            <div className="inner">
              <div className="icon">4</div>
            </div>
            <div className="name">VAULT FOUR</div>
          </div>
        </div>
      </main>
    </div>
  );
}
