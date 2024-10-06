'use client'

import { useEffect, useRef, useState } from "react";
import styles from "../../page.module.css";
import { Input } from "@/components/input";

export default function Home() {
    const [fileName, setFileName] = useState<string | null>(null)
    const keyUploadRef = useRef<HTMLInputElement>(null)
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files ? e.target.files[0] : null
        setFileName(file ? file.name : null)
    }
    useEffect(() => {
        if (keyUploadRef.current) {
            keyUploadRef.current.disabled = !!fileName
        }
    }, [fileName])
    
    return (
        <div className={styles.page}>
            <main className={styles.main}>
                <div className="vault creation">
                    <h1>Vault Creation</h1>
                    <div className="divider"></div>
                    <form className="flex-box row">
                        <div id="1" className="vault">
                            <div className="inner">
                                <div className="icon">?</div>
                            </div>
                        </div>
                        <div className="flex-box col" style={{ gap: '7px' }}>
                            <h2>Vault Name</h2>
                            <p>The name you would like your vault to be</p>
                            <Input type="text" placeholder="Name" />
                            <h2>Maximum Credentials</h2>
                            <p>This vault can store a maximum of VAULT_CREDENTIAL_LIMIT credentials.</p>
                            <Input type="number" placeholder="Maximum" oninput={(e) => e.currentTarget.value = e.currentTarget.value.replace(/[^0-9]/g, '')} />
                            <h2>Personal Key (Optional)</h2>
                            <p>You have the option to upload your own AES 256 encryption key. If not provided, a key will be automatically generated for you.</p>
                            <label htmlFor="key-upload" className="custom-file-upload">
                                {fileName ? fileName : 'Upload AES 256 Key'}
                            </label>
                            <Input id="key-upload" ref={keyUploadRef} placeholder="Maximum" name="key-upload" type={"file"} onchange={handleFileChange} />
                        </div>
                    </form>
                    <div className="divider" style={{ marginTop: '11px', marginBottom: '11px' }}></div>
                    <div className="actions">
                        <button>Save</button>
                        <button>Cancel</button>
                    </div>
                </div>
            </main>
        </div>
    )
}
