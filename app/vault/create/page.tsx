'use client'

import { useEffect, useRef, useState } from "react";
import styles from "../../page.module.css";
import { Input } from "@/components/input";
import { createVault } from "@/config/actions";
import { useFormState } from "react-dom";
import { Alert } from "@/components/alert";
import { VAULT_CREDENTIAL_LIMIT } from "@/config/general";

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
    return (
        <div className={styles.page}>
            <main className={styles.main}>
                {state?.result?.data ? (
                    <div className="vault creation">
                        <form ref={formRef} className="flex-box row">
                            <div className="flex-box col" style={{ gap: '7px' }}>
                                {state?.result?.data === "REDACTED" ? (
                                    <><h2>Personal Key</h2><p>Your key will not be displayed because you used a personal key. <b>Please ensure you save your key securely.</b></p>
                                        <label
                                            className="custom-file-upload"
                                            style={{ fontSize: '0.8rem', cursor: 'pointer' }}
                                        >
                                            {state?.result?.data}
                                        </label>
                                    </>
                                ) : (
                                    <><h2>Your Secret Key</h2><p>Your AES 256 encryption key has been successfully generated. <b>Make sure you save the key into a file with the extension .aes</b></p>
                                        <label
                                            className="custom-file-upload"
                                            style={{ fontSize: '0.8rem', cursor: 'pointer' }}
                                            onClick={() => {
                                                const secretKey = state?.result?.data;
                                                if (secretKey) {
                                                    navigator.clipboard.writeText(secretKey)
                                                        .then(() => {
                                                            alert('Secret key copied to clipboard!');
                                                        })
                                                        .catch(err => {
                                                            console.error('Failed to copy: ', err);
                                                        });
                                                }
                                            }}
                                        >
                                            {state?.result?.data}
                                        </label>
                                    </>
                                )}
                            </div>
                        </form>
                        <div className="divider" style={{ marginTop: '11px', marginBottom: '11px' }}></div>
                        <div className="actions">
                            <button onClick={() => { window.location.href = "/" }}>Go Back</button>
                        </div>
                    </div>
                ) : (
                    <div className="vault creation">
                        <h1>Vault Creation</h1>
                        {state?.result?.error && (
                            <Alert type={"danger"} code={state.result.code} message={state.result.error} />
                        )}
                        <div className="divider"></div>
                        <form ref={formRef} className="flex-box row">
                            <div id="1" className="vault">
                                <div className="inner">
                                    <div className="icon">?</div>
                                </div>
                            </div>
                            <div className="flex-box col" style={{ gap: '7px' }}>
                                <h2>Vault Name</h2>
                                <p>The name you would like your vault to be.</p>
                                <Input name="name" type="text" placeholder="Name" />
                                <h2>Maximum Credentials</h2>
                                <p>This vault can store a maximum of VAULT_CREDENTIAL_LIMIT credentials.</p>
                                <input
                                    name="maxCredentials"
                                    type="number"
                                    placeholder="Maximum"
                                    onInput={(e) => e.currentTarget.value = e.currentTarget.value.replace(/[^0-9]/g, '')}
                                />
                                <h2>Personal Key (Optional)</h2>
                                <p>You have the option to upload your own AES 256 encryption key <b>(must be in base64)</b>. If not provided, a key will be automatically generated for you.</p>
                                <label htmlFor="key-upload" className="custom-file-upload">
                                    {fileName ? fileName : 'Upload AES 256 Key'}
                                </label>
                                <input
                                    id="key-upload"
                                    ref={keyUploadRef}
                                    name="key-upload"
                                    type="file"
                                    accept=".aes"
                                    onChange={handleFileChange} // Changed to onChange
                                />
                            </div>
                        </form>
                        <div className="divider" style={{ marginTop: '11px', marginBottom: '11px' }}></div>
                        <div className="actions">
                            <button type="button" onClick={handleSubmit}>Save</button>
                            <button onClick={() => { window.location.href = "/" }}>Cancel</button>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}