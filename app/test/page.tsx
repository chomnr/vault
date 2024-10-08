'use client'

import { useEffect, useRef, useState } from "react";
import styles from "../page.module.css";
import { decryptVault } from "@/config/actions";
import { useFormState } from "react-dom";
import { Alert } from "@/components/alert";
import React from "react";
import { Input } from "@/components/input";

const initialState = {
  result: {
    error: null,
    code: null,
    timestamp: null,
    data: null
  },
};

export default function Home() {
  const [vault, setVault] = useState<{ id: string; name: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVaultDetails = async () => {
        try {
            const response = await fetch('/api/vaults/info', {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (response.ok) {
                const data = await response.json();
                setVault(data);
            }
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    };
    fetchVaultDetails();
}, []);
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <div className="vault unlocked">
          <h1>Vault</h1>
          <div className="divider" style={{ marginBottom: '7px' }}></div>
          <h2>Vault Name: {vault?.name} </h2>
          <div className="flex-box col" style={{ gap: '7px' }}>
            <div className="flex-box col" style={{ gap: '7px' }}>
              <br />
              <p>To access this vault, you must upload the AES 256 encryption key that is bound to it. This key is required to view the vault's contents. Once inside the vault, each value must be manually decrypted using the provided key.</p>
            </div>
            <Input type="search" placeholder="Search for credentials" />
          </div>
        </div>
      </main>
    </div>
  );
}