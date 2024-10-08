'use client'

import { useEffect, useRef, useState } from "react";
import styles from "../page.module.css";
import { decryptVault } from "@/config/actions";
import { useFormState } from "react-dom";
import { Alert } from "@/components/alert";
import React from "react";
import { Input } from "@/components/input";
import { Trashcan } from "@/components/icons";

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
        {loading ? (
          <div className="loading">
            <div className="loader"></div>
          </div>
        ) : (
          <div className="vault unlocked">
            <h1>Vault <a href="/vault/delete"><Trashcan size={13}/></a></h1>
            <div className="divider"></div>
            <div className="flex-box col" style={{ gap: '7px' }}>
              <div className="flex-box col" style={{ gap: '7px' }}>
                <br />
                <p>The vault has been successfully decrypted! You may now look through your credentials.</p>
              </div>
              <Input type="search" placeholder="Search for credentials" />
              adssdads
            </div>
          </div>
        )}
      </main>
    </div>
  );
}