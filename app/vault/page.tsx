'use client';

import React, { useState, useEffect } from 'react';
import styles from "../page.module.css";
import { Input } from '@/components/input';
import { Trashcan, Edit } from '@/components/icons';
import hljs from 'highlight.js';
import 'highlight.js/styles/monokai.css';

export default function Home() {
  const [credentials, setCredentials] = useState<{ id: string; type: string; name: string; data: string }[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [visibleCredentials, setVisibleCredentials] = useState<{ [key: string]: boolean }>({});

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

  useEffect(() => {
    // Highlight the JSON code when it becomes visible
    if (credentials) {
      const highlightedElements = document.querySelectorAll('pre code');
      highlightedElements.forEach((block) => {
        hljs.highlightElement(block);
      });
    }
  }, [visibleCredentials, credentials]);

  const handleCredentialLink = async (id: string, action: string) => {
    try {
      await fetch('/api/credentials/link', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, action }),
      });
      window.location.href = "/vault/credential/" + action;
    } catch (err) {
      console.error("Error handling credential link:", err);
    }
  };

  const filteredCredentials = credentials
    ? credentials.filter((credential) =>
      credential.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      credential.type.toLowerCase().includes(searchTerm.toLowerCase())
    )
    : [];

  // Toggle visibility of the content for a specific credential
  const toggleVisibility = (id: string) => {
    setVisibleCredentials((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

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
                  <div key={credential.id} className='flex col'>
                    <div id={credential.id} onClick={() => toggleVisibility(credential.id)} className="credential">
                      <div className="info" style={{ cursor: 'pointer' }}>
                        <div className="type">{credential.type.toUpperCase()}</div>
                        <div className="name">{credential.name}</div>
                      </div>

                      <div className="actions">
                        <a onClick={() => handleCredentialLink(credential.id, "delete")}><Trashcan size={8} /></a>
                      </div>
                    </div>
                    <div className='content'>
                      {visibleCredentials[credential.id] && (
                        <pre>
                          <code className="language-json">
                            {credential.data}
                          </code>
                        </pre>
                      )}
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
