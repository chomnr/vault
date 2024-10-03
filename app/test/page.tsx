'use client'

import { useEffect, useRef, useState } from "react";
import styles from "../page.module.css";
import { Input } from "@/components/input";
import { Alert } from "@/components/alert";


export default function Test() {
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
        {/*
      <Alert type="danger" code="ERR_BAD_KEY" message="Key you entered is not good." />
        */}
        <div className="vaults">
        <div className="vault">
            <div className="inner">
              <div className="icon">1</div>
            </div>
          </div>
          <form className="vault-settings">
            <input type="file" className="upload"/>
            <button type="submit">Enter</button>
          </form>
        </div>
      </main>
    </div>
  );
}
