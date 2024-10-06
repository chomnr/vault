'use client'
import { useState } from "react";
import { Alert } from "@/components/alert";
import styles from "../page.module.css";


export default function Test() {
  const [message, setMessage] = useState("YWRzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nz");
  const [alertMessage, setAlertMessage] = useState("SUCCESS (CLICK TO COPY)");

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

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <div className="key-reveal">
          <Alert
            type={"success"}
            code={alertMessage}
            message={message}
            onClick={() => handleCopy(message)}
          />
        </div>
      </main>
    </div>
  );
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