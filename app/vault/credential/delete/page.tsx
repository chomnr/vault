'use client'

import styles from "../../../page.module.css";
import React, { useEffect, useState } from "react";
import { useFormState } from "react-dom";
import { deleteCredential } from "@/config/actions";
import { Alert } from "@/components/alert";

const initialState = {
    result: {
        error: null,
        code: null,
        timestamp: null,
        data: null
    },
};

export default function Home() {
    const [credential, setCredential] = useState<{ id: string; name: string } | null>(null);
    const [state, formAction] = useFormState(deleteCredential, initialState);
    const [loading, setLoading] = useState(true);
    const [credentialName, setCredentialName] = useState('');

    const handleDelete = (e: React.MouseEvent<HTMLButtonElement>) => {
        if (credentialName.trim() === '') {
            alert("Please enter the credential name to confirm deletion.");
            return;
        }
        const formData = new FormData();
        formData.append("confirmation", credentialName);
        formAction(formData);
    };

    useEffect(() => {
        const fetchVaultDetails = async () => {
            try {
                const response = await fetch('/api/credentials/info', {
                    method: 'POST',
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                if (response.ok) {
                    const data = await response.json();
                    setCredential(data);
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
                    <div className="vault deletion">
                        <h1>Warning: Deleting Credential</h1>
                        {state?.result?.error && (
                            <Alert type={"danger"} code={state.result.code} message={state.result.error} />
                        )}
                        <div className="divider" style={{ marginBottom: '7px' }}></div>
                        <form className="flex-box row" action={formAction}>
                            <div className="flex-box col" style={{ gap: '7px' }}>
                                <p>Are you sure you want to delete this credential? Once deleted, this credential will be permanently removed and cannot be recovered. This action cannot be undone.</p>
                                <h2>Please type <span style={{color: "#1976D2"}}>{credential?.name}</span> to confirm.</h2>
                                <input
                                    placeholder="Credential Name"
                                    type="text"
                                    value={credentialName}
                                    onChange={(e) => setCredentialName(e.target.value)}
                                />
                            </div>
                        </form>
                        <div className="divider" style={{ marginTop: '11px', marginBottom: '11px' }}></div>
                        <div className="actions" style={{ display: "flex", gap: '5px' }}>
                            <button type="submit" onClick={handleDelete}>Delete</button>
                            <button onClick={() => { window.location.href = "/vault" }}>Cancel</button>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}