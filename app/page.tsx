'use client'

import { useEffect, useRef, useState } from "react";
import styles from "./page.module.css";
import { Input } from "@/components/input";

export default function Home() {
  const vaultsRef = useRef<HTMLDivElement>(null);
  const [vaultKeyUpload] = useState(false);
  const [vaults, setVaults] = useState([]);
  const [fileName, setFileName] = useState<string | null>(null);
  const keyUploadRef = useRef<HTMLInputElement>(null);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    setFileName(file ? file.name : null);
  };

  useEffect(() => {
    if (keyUploadRef.current) {
      keyUploadRef.current.disabled = !!fileName;
    }
  }, [fileName]);

  const handleVaultRetrieval = async () => {
    try {
      const response = await fetch('/api/vaults', {
        method: 'GET',
        credentials: 'include',
      });
      if (!response.ok) {
        throw new Error('Failed to retrieve vaults');
      }
      const vaultsData = await response.json();
      setVaults(vaultsData);
    } catch (error) {
      console.error('Error retrieving vaults:', error);
    }
  };
  useEffect(() => {
    handleVaultRetrieval();
  }, []);

  const handleVaultLink = async (id: string) => {
    const response = await fetch('/api/vaults/link', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id: id }),
    });
    if (response.redirected) {
      window.location.href = response.url;
    }
  };

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
  }, [vaults]);

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        {!vaultKeyUpload ? <></> : (null)}
        {!vaultKeyUpload ? (
          <>
            <div className="vault header">{/* HEADER HERE */}</div>
            <div ref={vaultsRef} className="vaults">
              {vaults.length > 0 ? (
                vaults.map((vault, index) => (
                  <div
                    key={vault['id']}
                    id={vault['id']}
                    className="vault"
                    onClick={() => {
                      handleVaultLink(vault['id']);
                      localStorage.setItem('currentVaultNumber', (index + 1).toString());
                    }}
                  >
                    <div className="inner">
                      <div className="icon">{index + 1}</div>
                    </div>
                    <div className="name">{vault['name']}</div>
                  </div>
                ))
              ) : (
                null
              )}

              <div
                id="vault_add"
                className="vault"
                onClick={() => window.location.href = "/vault/create"}
              >
                <div className="inner">
                  <div className="icon">+</div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <form className="key-upload">
            <label htmlFor="key-upload" className="custom-file-upload">
              {fileName ? fileName : 'Upload AES 256 Key'}
            </label>
            <Input
              id="key-upload"
              ref={keyUploadRef}
              name="key-upload"
              type={"file"}
              onchange={handleFileChange}
            />
            {fileName ? (
              <button className="submit">
                Decrypt Vault
              </button>
            ) : null}
          </form>
        )}
      </main>
    </div>
  );
}

{/*
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
          */}

function setMaxCredentials(arg0: string | number) {
  throw new Error("Function not implemented.");
}
