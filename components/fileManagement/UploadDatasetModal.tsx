"use client";

import { useState } from "react";
import styles from "./uploadModal.module.css";
import Popup from "../PopUp";

type Props = {
    onClose: () => void;
    onSuccess: () => void;
};

export default function UploadDatasetModal({ onClose, onSuccess }: Props) {
    const [file, setFile] = useState<File | null>(null);

    // PINDAHIN KE DALAM COMPONENT
    const [popup, setPopup] = useState({ show: false, message: "" });

    const API = process.env.NEXT_PUBLIC_API_URL;

    const handleUpload = async () => {
        if (!file) {
            setPopup({
                show: true,
                message: "Please select a file"
            });
            return;
        }

        if (!file.name.endsWith(".csv")) {
            setPopup({
                show: true,
                message: "Please select a CSV file"
            });
            return;
        }

        try {
            const token = localStorage.getItem("token");

            const formData = new FormData();
            formData.append("dataset", file);

            const res = await fetch(`${API}/api/datasets/upload`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formData,
            });

            const data = await res.json();

            if (!res.ok) {
                setPopup({
                    show: true,
                    message: data.message
                });
                return;
            }

            setPopup({
                show: true,
                message: "Upload Success"
            });

            onSuccess();
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <div className={styles.container}>
            <h2 className={styles.title}>UPLOAD DATASET</h2>

            <div className={styles.fileGroup}>
                <input
                    type="file"
                    accept=".sam"
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                />
            </div>

            <div className={styles.buttonGroup}>
                <button className={styles.cancelBtn} onClick={onClose}>
                    Cancel
                </button>

                <button className={styles.uploadBtn} onClick={handleUpload}>
                    Upload
                </button>
            </div>

            <Popup
                isOpen={popup.show}
                message={popup.message}
                onClose={() => setPopup({ show: false, message: "" })}
            />
        </div>
    );
}