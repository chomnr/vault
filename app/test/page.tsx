'use client'

import { useEffect, useRef, useState } from "react";
import styles from "../page.module.css";
import { decryptVault } from "@/config/actions";
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
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <div className="vault creation">
          <h1>Vault</h1>
          <div className="divider"></div>
          <div className="flex-box row">
            <div className="flex-box col" style={{ gap: '7px' }}>
              <br/>
              <p>To access this vault, you must upload the AES 256 encryption key that is bound to it. This key is required to view the vault's contents. Once inside the vault, each value must be manually decrypted using the provided key.</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}