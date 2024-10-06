'use client'

import { useEffect, useRef, useState } from "react";
import styles from "../../page.module.css";
import { Input } from "@/components/input";
import { createVault } from "@/config/actions";
import { useFormState } from "react-dom";
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
    const [fileName, setFileName] = useState<string | null>(null);
    const keyUploadRef = useRef<HTMLInputElement>(null);
    const formRef = useRef<HTMLFormElement>(null);
    const [state, formAction] = useFormState(createVault, initialState);
    const [message, setMessage] = useState("uhh...");
    const [alertMessage, setAlertMessage] = useState("SUCCESS (CLICK TO COPY) SAVE AS .ASE");
    const handleCopy = async (msg: string) => {
      try {
        await navigator.clipboard.writeText(msg);
        console.log("Message copied to clipboard!");
        setAlertMessage("COPIED");
        setTimeout(() => setAlertMessage("SUCCESS (CLICK TO COPY)"), 2000);
      } catch (err) {
        console.error("Failed to copy message: ", err);
      }
    };
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files ? e.target.files[0] : null;
        setFileName(file ? file.name : null);
    };
    useEffect(() => {
        if (state?.result?.data) {
            setMessage(state.result.data); 
        }
    }, [state?.result?.data]);

    useEffect(() => {
        if (keyUploadRef.current) {
            keyUploadRef.current.disabled = !!fileName;
        }
    }, [fileName]);
    const handleSubmit = () => {
        if (formRef.current) {
            formRef.current.requestSubmit()
        }
    };
    return (
        <div className={styles.page}>
    <main className={styles.main}>
        {state?.result?.data ? (
            <div className="key-reveal">
            <Alert
              type={"success"}
              code={alertMessage}
              message={message}
              onClick={() => handleCopy(message)}
            />
          </div>
        ) : (
            <div className="vault creation">
                <h1>Vault Creation</h1>
                {state?.result?.error && (
                    <Alert type={"danger"} code={state.result.code} message={state.result.error} />
                )}
                <div className="divider"></div>
                <form ref={formRef} className="flex-box row" action={formAction}>
                    <div id="1" className="vault">
                        <div className="inner">
                            <div className="icon">?</div>
                        </div>
                    </div>
                    <div className="flex-box col" style={{ gap: '7px' }}>
                        <h2>Vault Name</h2>
                        <p>The name you would like your vault to be</p>
                        <Input name="name" type="text" placeholder="Name" />
                        <h2>Maximum Credentials</h2>
                        <p>This vault can store a maximum of VAULT_CREDENTIAL_LIMIT credentials.</p>
                        <Input
                            name="maxCredentials"
                            type="number"
                            placeholder="Maximum"
                            oninput={(e) => e.currentTarget.value = e.currentTarget.value.replace(/[^0-9]/g, '')}
                        />
                        <h2>Personal Key (Optional)</h2>
                        <p>You have the option to upload your own AES 256 encryption key <b>(must be in base64)</b>. If not provided, a key will be automatically generated for you.</p>
                        <label htmlFor="key-upload" className="custom-file-upload">
                            {fileName ? fileName : 'Upload AES 256 Key'}
                        </label>
                        <Input
                            id="key-upload"
                            ref={keyUploadRef}
                            name="key-upload"
                            type="file"
                            onchange={handleFileChange}
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