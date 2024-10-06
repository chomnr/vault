'use client'

import { useEffect, useRef, useState } from "react";
import styles from "./page.module.css";
import { Input } from "@/components/input";

export default function Home() {
  // Decryption UI
  const vaultsRef = useRef<HTMLDivElement>(null)
  const [vaultKeyUpload, setVaultKeyUploadUi] = useState(false)
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
  }, [vaultKeyUpload]);

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

  return (
    <div className={styles.page}>
      <main className={styles.main}>
      {!vaultKeyUpload ? <></> : (null)}
        {!vaultKeyUpload ? (
          <><div className="vault header">{/* HEADER HERE */}</div><div ref={vaultsRef} className="vaults">
            {/*
            <div id="1" className="vault" onClick={() => setVaultKeyUploadUi(true)}>
              <div className="inner">
                <div className="icon">1</div>
              </div>
              <div className="name">VAULT ONE</div>
            </div>
            */}
            <div id="vault_add" className="vault" onClick={() => window.location.href = "/vault/creation"}>
              <div className="inner">
                <div className="icon">+</div>
              </div>
            </div>
          </div></>
        ) : (
          <form className="key-upload">
            {/*
          <Alert type={"danger"} code="ERR_BAD_KEY" message="The key you uploaded does not belong to the corresponding vault" />
          <Alert type={"success"} code="Success" message="The key has successfully decrypted the contents you may proceed" />
          */}
            {/*
          <Alert type={"danger"} code="ERR_BAD_KEY" message="The key you uploaded does not belong to the corresponding vault" />
          <Alert type={"success"} code="Success" message="The key has successfully decrypted the contents you may proceed" />
          */}
            <label htmlFor="key-upload" className="custom-file-upload">
              {fileName ? fileName : 'Upload AES 256 Key'}
            </label>
            <Input id="key-upload" ref={keyUploadRef} name="key-upload" type={"file"} onchange={handleFileChange} />
            {fileName ? <button className="submit">
            Decrypt Vault
          </button> : null}
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
