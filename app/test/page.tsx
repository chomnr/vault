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
        <div className="vault-creation">
          <div className="vault-creation-title">Edit Vault</div>
          <form>
            <Input type={"text"} placeholder="Name" />
            <div className="divider"></div>
            <div className="button-group">
              <button>Save</button>
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}
/*
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