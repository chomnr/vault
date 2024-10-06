'use client'

import { useEffect, useRef, useState } from "react";
import styles from "../page.module.css";
import { Input } from "@/components/input";
import { Alert } from "@/components/alert";
import { CheckMark } from "@/components/icons";

export default function Test() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <div className="vault creation">
          <h1>Vault Creation</h1>
          <div className="divider"></div>
          <form className="flex-box row">
            <div id="1" className="vault">
              <div className="inner">
                <div className="icon">1</div>
              </div>
            </div>
            <div className="flex-box col" style={{ gap: '7px' }}>
              <h2>Vault Name</h2>
              <p>The name you would like your vault to be</p>
              <Input type="text" placeholder="Name" />
              <h2>Maximum Credentials</h2>
              <p>This vault can store a maximum of 100 credentials</p>
              <Input type="number" placeholder="Maximum" />
              <h2>Personal Key (Optional)</h2>
              <p>You have the option to upload your own AES 256 encryption key. If not provided, a key will be automatically generated for you.</p>
              <label className="custom-file-upload">Custom AES 256 Key</label>
              <Input type="file" placeholder="Maximum" />
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
/*

<div className="flex-box">
            <div id="1" className="vault">
              <div className="inner">
                <div className="icon">1</div>
              </div>
              <div className="name">VAULT ONE</div>
            </div>
          </div>


export default function Test() {
  const [fileName, setFileName] = useState<string | null>(null);
  const keyUploadRef = useRef<HTMLInputElement>(null)
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    setFileName(file ? file.name : null);
    if (keyUploadRef.current) {
      keyUploadRef.current.disabled = true
    }
  };
  // show error if key is incorrect show proceed button if it's successful
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <form className="key-upload">
          <Alert type={"danger"} code="ERR_BAD_KEY" message="The key you uploaded does not belong to the corresponding vault" />
          <Alert type={"success"} code="Success" message="The key has successfully decrypted the contents you may proceed" />
          <label htmlFor="key-upload" className="custom-file-upload">
            {fileName ? fileName : 'Upload AES 256 Key'}
          </label>
          <Input id="key-upload" ref={keyUploadRef} name="key-upload" type={"file"} onchange={handleFileChange} />
          {fileName ? <button className="submit">
            Decrypt Vault
          </button> : null}
        </form>
      </main>
    </div>
  );
}
*/