'use client'

import { useEffect, useRef, useState } from "react";
import styles from "./page.module.css";
import { Input } from "@/components/input";

export default function Home() {
  const vaultsRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (vaultsRef.current) {
      const vaults = vaultsRef.current;
      const children = vaults.children;
      for (let i = 0; i < children.length; i++) {
        const vault = children[i] as HTMLDivElement;
        vault.addEventListener('mouseover', (e) => {
          (vault.children[0] as HTMLDivElement).style.borderColor = 'var(--vault-individual-hover-border)';
          (vault.children[0].children[0] as HTMLDivElement).style.color = 'var(--vault-individual-hover-color)';
        })
        vault.addEventListener('mouseout', (e) => {
          (vault.children[0] as HTMLDivElement).style.borderColor = 'var(--vault-individual-border)';
          (vault.children[0].children[0] as HTMLDivElement).style.color = 'var(--vault-individual-color)';
        })
      }
    }
  }, []);
  /*
  useEffect(() => {
    if (vaultsRef.current) {
      const vaults = vaultsRef.current
      const children = vaults.children
      for (let i = 0; i < children.length; i++) {
        const vault = children[i] as HTMLDivElement
        if (vault.id !== "vault_add" && vault.children[1] !== undefined) {
          const vaultName = vault.children[1] as HTMLDivElement
          vaultName.addEventListener('click', (e) => {
            // dd
          })
        }
      }
    }
  })
    */
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <div className="vault header">{/* HEADER HERE */}</div>
        <div ref={vaultsRef} className="vaults">
          <div id="1" className="vault">
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
        </div>
      </main>
    </div>
  );
}
