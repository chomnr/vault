'use client'

import React, { useState, useEffect } from 'react';
import styles from "../page.module.css";
import { Input } from '@/components/input';
import { Trashcan, Edit } from '@/components/icons';

export default function Home() {
  const [credentials, setCredentials] = useState<{ id: string; type: string; name: string }[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchCredentials = async () => {
      try {
        const response = await fetch('/api/credentials', {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        if (response.ok) {
          const data = await response.json();
          setCredentials(data);
        }
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCredentials();
  }, []);

  const handleCredentialLink = async (id: string, action: string) => {
    const response = await fetch('/api/credentials/link', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, action }),
    });
    if (response.redirected) window.location.href = response.url;
  };

  const filteredCredentials = credentials
    ? credentials.filter((credential) =>
        credential.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        credential.type.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        {loading ? (
          <div className="loading">
            <div className="loader"></div>
          </div>
        ) : (
          <div className="vault unlocked">
            <h1>Vault <a href="/vault/delete"><Trashcan size={13} /></a></h1>
            <div className="divider"></div>
            <div className="flex-box col" style={{ gap: '7px' }}>
              <div className="flex-box col" style={{ gap: '7px' }}>
                <br />
                <p>The vault is now decrypted, and you can access your stored credentials. However, each one is still encrypted individually. You'll need to decrypt them manually. You must search by the credential's type in order to locate your desired credential.</p>
                <p>If you would like to decrypt a credential just click on it. You can create a credential <a style={{ color: 'lightblue' }} href="/vault/credential/create">here</a>.</p>
              </div>
              <Input
                type="search"
                placeholder="Search for credentials"
                value={searchTerm}
                onchange={(e: { target: { value: React.SetStateAction<string>; }; }) => setSearchTerm(e.target.value)}
              />
              <div className="credentials">
                {filteredCredentials.map((credential) => (
                  <div key={credential.id} id={credential.id} className="credential">
                    <div className="info">
                      <div className="type">{credential.type.toUpperCase()}</div>
                      <div className="name">{credential.name}</div>
                    </div>
                    <div className="actions">
                      <a onClick={() => handleCredentialLink(credential.id, "edit")}><Edit size={8} /></a>
                      <a onClick={() => handleCredentialLink(credential.id, "delete")}><Trashcan size={8} /></a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
