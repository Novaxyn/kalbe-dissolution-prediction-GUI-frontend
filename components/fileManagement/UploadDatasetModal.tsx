"use client";

import {useState} from "react";
import styles from "./uploadModal.module.css";

type Props = {
    onClose: () => void;
    onSuccess: () => void;
};

export default function UploadDatasetModal({ onClose, onSuccess }: Props) {
    const [file, setFile] = useState<File | null>(null);
    const API = process.env.NEXT_PUBLIC_API_URL;

    const handleUpload = async () => {
        if (!file) {
            alert("Please select a file");
            return;
        }

        if (!file.name.endsWith(".csv")) {
            alert("Please select a CSV file");
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
                alert(data.message);
                return;
            }

            alert("Upload Success");
            onSuccess();
        } catch (err) {
            console.log(err);
        }
    };

    return (
    <div className={styles.container}>
      <h2 className={styles.title}>UPLOAD DATASET</h2>

      {/* FILE INPUT */}
      <div className={styles.fileGroup}>
        <input
          type="file"
          accept=".csv"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
        />
        {file && <p className={styles.fileName}>{file.name}</p>}
      </div>

      {/* BUTTON */}
      <div className={styles.buttonGroup}>
        <button className={styles.cancelBtn} onClick={onClose}>
          Cancel
        </button>

        <button className={styles.uploadBtn} onClick={handleUpload}>
          Upload
        </button>
      </div>
    </div>
  );
}