'use client'

import { useEffect, useState } from "react";
import styles from "../../../page.module.css";
import React from "react";
import { Input } from "@/components/input";
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
    const [jsonInput, setJsonInput] = useState('');
    const [jsonError, setJsonError] = useState('');
    const [vault, setVault] = useState<{ id: string; name: string } | null>(null);
    const [loading, setLoading] = useState(true);

    const handleJsonInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const input = e.target.value;
        setJsonInput(input);
        if (input.length === 0) {
            return setJsonError('')
        }
        try {
            JSON.parse(input);
            setJsonError('');
        } catch (err) {
            setJsonError(err + "");
        }
    };

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
                    <div className="credential creation">
                        <h1>Credential Creation</h1>
                        <div className="divider" style={{ marginBottom: '7px' }}></div>
                        <form className="flex-box row" style={{ gap: '11px' }}>
                            <div className="vault">
                                <div className="inner">
                                    <div className="icon">{localStorage.getItem("vaultIncrementId")}</div>
                                </div>
                            </div>
                            <div className="flex-box col" style={{ gap: '7px' }}>
                                <h2>Credential Name</h2>
                                <p>The name of or description of your credential.</p>
                                <Input placeholder="Credential Name" name="credential_name" type={"text"} />
                                <h2>Credential Type</h2>
                                <p>Credential Type can be any value.</p>
                                <Input placeholder="Credential Type (Ex: Google, Microsoft, Discord)" name="credential_type" type={"text"} />
                                <h2>Credential Value</h2>
                                <p>The credential value must be in <b>JSON</b> format. You can include as many fields as you like, as long as the size does not exceed 4MB.</p>
                                {jsonError && <Alert type={"danger"} message={jsonError} code={"JSON_BAD_PARSE"} />}
                                <textarea
                                    placeholder="JSON"
                                    value={jsonInput}
                                    onInput={handleJsonInput}
                                    style={{ borderColor: jsonError ? 'red' : 'initial' }}
                                ></textarea>
                            </div>
                        </form>
                        <div className="divider" style={{ marginTop: '11px', marginBottom: '11px' }}></div>
                        <div className="actions" style={{ display: "flex", gap: '5px' }}>
                            <button type="button">Save</button>
                            <button onClick={() => { window.location.href = "/vault" }}>Cancel</button>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}