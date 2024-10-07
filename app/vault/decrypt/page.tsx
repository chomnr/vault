'use client'

import { useEffect, useRef, useState } from "react";
import styles from "../../page.module.css";
import { createVault } from "@/config/actions";
import { useFormState } from "react-dom";
import { Alert } from "@/components/alert";
import React from "react";

const initialState = {
    result: {
        error: null,
        code: null,
        timestamp: null,
        data: null
    },
};

export default function Home() {
    const [fileName, setFileName] = useState<string | null>(null);
    const keyUploadRef = useRef<HTMLInputElement>(null);
    const formRef = useRef<HTMLFormElement>(null);
    const [state, formAction] = useFormState(createVault, initialState);
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files ? e.target.files[0] : null;
        setFileName(file ? file.name : null);
    };
    const [vault, setVault] = useState<{ id: string; name: string } | null>(null);
    const [error, setError] = useState<{ message: string; code: string; timestamp: string } | null>(null);
    const [currentVaultNumber, setCurrentVaultNumber] = useState<string | null>(null);
    useEffect(() => {
        if (keyUploadRef.current) {
            keyUploadRef.current.disabled = !!fileName;
        }
    }, [fileName]);
    const handleSubmit = () => {
        if (formRef.current) {
            const formData = new FormData(formRef.current);
            if (keyUploadRef.current?.files) {
                const file = keyUploadRef.current.files[0];
                if (file) {
                    formData.append('key-upload', file);
                }
            }
            formAction(formData);
            if (keyUploadRef.current) {
                keyUploadRef.current.value = '';
                setFileName(null);
            }
        }
    };
    useEffect(() => {
        const fetchVaultDetails = async () => {
            try {
                const response = await fetch('/api/vaults/selected', {
                    method: 'POST',
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ id: 'your-vault-id' }),
                });

                if (response.ok) {
                    const data = await response.json();
                    setVault(data);
                } else {
                    const errorData = await response.json();
                    setError({
                        message: errorData.msg,
                        code: errorData.code,
                        timestamp: new Date().toISOString()
                    });
                }
            } catch (err) {
                setError({
                    message: 'Failed to fetch vault data.',
                    code: 'FETCH_ERROR',
                    timestamp: new Date().toISOString()
                });
            }
        };

        fetchVaultDetails();
    }, []);

    useEffect(() => {
        setCurrentVaultNumber(localStorage.getItem('currentVaultNumber'));
    }, []);

    return (
        <div className={styles.page}>
            <main className={styles.main}>
                <div className="vault creation">
                    <h1>Vault Decryption</h1>
                    {state?.result?.error && (
                        <Alert type={"danger"} code={state.result.code} message={state.result.error} />
                    )}
                    <div className="divider"></div>
                    <form ref={formRef} className="flex-box row">
                        <div id="1" className="vault">
                            <div className="inner">
                                <div className="icon">{currentVaultNumber}</div>
                            </div>
                        </div>
                        <div className="flex-box col" style={{ gap: '7px' }}>
                            <h2>Decryption Key ({vault?.name})</h2> <p>To access this vault, you must upload the AES 256 encryption key that is bound to it. This key is required to view the vault's contents. Once inside the vault, each value must be manually decrypted using the provided key.</p>
                            <label htmlFor="key-upload" className="custom-file-upload">
                                {fileName ? fileName : 'Upload AES 256 Key'}
                            </label>
                            <input
                                id="key-upload"
                                ref={keyUploadRef}
                                name="key-upload"
                                type="file"
                                accept=".aes"
                                onChange={handleFileChange}
                            />
                        </div>
                    </form>
                    <div className="divider" style={{ marginTop: '11px', marginBottom: '11px' }}></div>
                    <div className="actions">
                        <button type="button" onClick={handleSubmit}>Enter</button>
                        <button onClick={() => { window.location.href = "/" }}>Cancel</button>
                    </div>
                </div>
            </main>
        </div>
    );
}