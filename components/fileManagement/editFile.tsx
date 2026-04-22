"use client";

import { useState } from "react";
import styles from "./editFile.module.css";

type Props = {
    file: any;
    onClose: () => void;
    onSuccess: () => void;
};

export default function EditFileForm({ file, onClose, onSuccess }: Props) {
    const [datasetName, setDatasetName] = useState(file.originalName || file.dataSetId?.originalName || "");
    const API = process.env.NEXT_PUBLIC_API_URL;

    const handleEdit = async (e: React.FormEvent) => {
        e.preventDefault();

        const token = localStorage.getItem("token");

        if (!token) {
            alert("Unauthorized");
            return;
        }

        try {
            const idDataset = file.dataSetId?._id || file._id;
            const res = await fetch(`${API}/api/datasets/${idDataset}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    originalName: datasetName,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                alert(data.message);
                return;
            }

            alert("Dataset edited");
            onSuccess();
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className={styles.container}>
            <h2 className={styles.title}>RENAME FILE</h2>

            <form onSubmit={handleEdit} style={{ width: "100%" }}>
                <div className={styles.formGroup}>
                    <label className={styles.label}>Rename file to:</label>
                    <input
                        className={styles.input}
                        value={datasetName}
                        onChange={(e) => setDatasetName(e.target.value)}
                    />
                </div>

                <div className={styles.buttonContainer}>
                    <button
                        type="button"
                        onClick={onClose}
                        className={styles.buttonCancel}
                    >
                        Cancel
                    </button>

                    <button type="submit" className={styles.buttonSave}>
                        Rename
                    </button>
                </div>
            </form>
        </div>
    );
}