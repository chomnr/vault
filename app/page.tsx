'use client'

import { useEffect, useRef, useState } from "react";
import styles from "./page.module.css";
import { Input } from "@/components/input";

export default function Home() {
  const vaultsRef = useRef<HTMLDivElement>(null)
  const [isShowVaultProceed, setShowVaultProceed] = useState(false)
  useEffect(() => {
    const vaults = vaultsRef.current;
    if (vaults) {
      const children = Array.from(vaults.children) as HTMLDivElement[];
      children.forEach((vault) => {
        const handleMouseOver = () => {
          (vault.children[0].children[0] as HTMLDivElement).style.color = 'var(--vault-individual-hover-color)';
          if (vault.children[1] !== undefined) {
            (vault.children[1] as HTMLDivElement).style.color = 'var(--vault-individual-hover-border)';
          }
        };
        const handleMouseOut = () => {
          (vault.children[0].children[0] as HTMLDivElement).style.color = 'var(--vault-individual-color)';
          if (vault.children[1] !== undefined) {
            (vault.children[1] as HTMLDivElement).style.color = 'var(--vault-individual-color)';
          }
        };
        vault.addEventListener('mouseover', handleMouseOver);
        vault.addEventListener('mouseout', handleMouseOut);
        return () => {
          vault.removeEventListener('mouseover', handleMouseOver);
          vault.removeEventListener('mouseout', handleMouseOut);
        };
      });
    }
  }, [isShowVaultProceed]);
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        {!isShowVaultProceed ? (
        <><div className="vault header">{/* HEADER HERE */}</div><div ref={vaultsRef} className="vaults">
            <div id="1" className="vault" onClick={() => setShowVaultProceed(true)}>
              <div className="inner">
                <div className="icon">1</div>
              </div>
              <div className="name">VAULT ONE</div>
            </div>
            <div id="2" className="vault">
              <div className="inner">
                <div className="icon">2</div>
              </div>
              <div className="name">VAULT TWO</div>
            </div>
            <div id="vault_add" className="vault">
              <div className="inner">
                <div className="icon">+</div>
              </div>
            </div>
          </div></>
        ) : (
          <div className="vaults">
            <div className="vault">
              <div className="inner">
                <div className="icon">1</div>
              </div>
            </div>
            <form className="vault-settings">
              <input type="file" className="upload" />
              <button type="submit">Enter</button>
              <button type="submit" onClick={() => setShowVaultProceed(false)}>Back</button>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}
