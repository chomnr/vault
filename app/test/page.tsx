'use client'

import { useEffect, useRef, useState } from "react";
import styles from "../page.module.css";
import { decryptVault } from "@/config/actions";
import { useFormState } from "react-dom";
import { Alert } from "@/components/alert";
import React from "react";
import { Input } from "@/components/input";
import { Trashcan } from "@/components/icons";

const initialState = {
    result: {
        error: null,
        code: null,
        timestamp: null,
        data: null
    },
};

export default function Home() {
    const [vault, setVault] = useState<{ id: string; name: string } | null>(null);
    const [loading, setLoading] = useState(true);
    return (
        <div className={styles.page}>
            <main className={styles.main}>
                <div className="vault deletion">
                    <h1>Warning: Deleting Vault</h1>
                    <div className="divider" style={{ marginBottom: '7px' }}></div>
                    <form className="flex-box row">
                        <div className="flex-box col" style={{ gap: '7px' }}>
                            <p>Are you sure you want to delete this vault? Once deleted, all associated credentials and data within the vault will be permanently removed and cannot be recovered. This action cannot be undone. Please ensure you have backed up any important information before proceeding.</p>
                            <h2>Please type <i>cool vault name heroes here</i> to confirm</h2>
                            <Input placeholder="Vault Name" type={"search"} />
                        </div>
                    </form>
                    <div className="divider" style={{ marginTop: '11px', marginBottom: '11px' }}></div>
                    <div className="actions" style={{display: "flex", gap: '5px'}}>
                        <button type="button">Delete</button>
                        <button onClick={() => { window.location.href = "/" }}>Cancel</button>
                    </div>
                </div>
            </main>
        </div>
    );
}