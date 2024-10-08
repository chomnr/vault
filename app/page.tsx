'use client'

import { useEffect, useRef, useState } from "react";
import styles from "./page.module.css";

export default function Home() {
  const vaultsRef = useRef<HTMLDivElement>(null);
  const [vaults, setVaults] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchVaults = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/vaults', { method: 'GET', credentials: 'include' });
      if (!response.ok) throw new Error('Failed to retrieve vaults');
      setVaults(await response.json());
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVaults();
  }, []);

  const handleVaultLink = async (id: string) => {
    const response = await fetch('/api/vaults/link', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    if (response.redirected) window.location.href = response.url;
  };

  useEffect(() => {
    const vaults = vaultsRef.current?.children;
    if (vaults) {
      Array.from(vaults).forEach(vault => {
        vault.addEventListener('mouseover', () => {
          (vault.children[0].children[0] as HTMLDivElement).style.color = 'var(--vault-individual-hover-color)';

          if (vault.children[1] !== undefined)
            (vault.children[1] as HTMLDivElement).style.color = 'var(--vault-individual-hover-border)';
        });
        vault.addEventListener('mouseout', () => {
          (vault.children[0].children[0] as HTMLDivElement).style.color = 'var(--vault-individual-color)';
          if (vault.children[1])
            (vault.children[1] as HTMLDivElement).style.color = 'var(--vault-individual-color)';
        });
      });
    }
  }, [vaults]);

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <div className="vault header">{/* HEADER HERE */}</div>
        {loading ? (
          <div className="loading">
            <div className="loader"></div>
          </div>
        ) : (
          <div ref={vaultsRef} className="vaults">
            {vaults.length > 0 ? (
              vaults.map((vault, index) => (
                <div key={vault["id"]} className="vault" onClick={() => handleVaultLink(vault["id"])}>
                  <div className="inner">
                    <div className="icon">{index + 1}</div>
                  </div>
                  <div className="name">{vault["name"]}</div>
                </div>
              ))
            ) : (
              <div>No vaults available</div>
            )}
            <div id="vault_add" className="vault" onClick={() => window.location.href = "/vault/create"}>
              <div className="inner">
                <div className="icon">+</div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
