"use client";

import { useState, useEffect } from "react";
import styles from "./fileTable.module.css";
import Modal from "@/components/Modal";
import EditFileForm from "@/components/fileManagement/editFile";

type User = {
    _id: string;
    username: string;
};

type Report = {
    _id: string;
    
    dataSetId: {
        _id: string;
        originalName: string;
    };

    uploadedBy: {
        username: string;
    };

    reportCreatedBy?: {
        username: string;
    };

    predictionResult: string;
    createdAt: string;
    predictionId?: string;
};

export default function DatasetReportTable() {
    const [data, setData] = useState<Report[]>([]);

    const [showEdit, setShowEdit] = useState(false);
    const [showArchive, setShowArchive] = useState(false);
    const [selDatasetReport, setSelDatasetReport] = useState<string | null>(null);
    const [editFile, setEditFile] = useState<Report | null>(null);
    const API = process.env.NEXT_PUBLIC_API_URL;

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const token = localStorage.getItem("token");

            const res = await fetch(`${API}/api/dataset-reports`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const result = await res.json();
            setData(result.data || []);
        } catch (error) {
            console.log(error);
        }
    };

    const handleExport = async (predictionId?: string) => {
        if (!predictionId) {
            alert("Report not available");
            return;
        }

        try {
            const token = localStorage.getItem("token");

            const res = await fetch(
                `${API}/api/predictions/export/${predictionId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const data = await res.json();

            if (data.filePath) {
                window.open(`${API}/${data.filePath}`, "_blank");
            }
        } catch (error) {
            console.log(error);
        }
    };

    const handleArchive = async () => {
        if (!selDatasetReport) return;

        try {
            const token = localStorage.getItem("token");

            const res = await fetch(`${API}/api/dataset-reports/update/${selDatasetReport}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = await res.json();

            if (!res.ok) {
                alert(data.message);
                return;
            }

            setShowArchive(false);
            fetchData();
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className={styles.container}>
            <h2 className={styles.title}>Dataset Report</h2>

            <table className={styles.table}>
                <thead>
                    <tr>
                        <th>No</th>
                        <th>Dataset</th>
                        <th>Uploaded By</th>
                        <th>Prediction Result</th>
                        <th>Report Created By</th>
                        <th>Date</th>
                        <th>Actions</th>
                    </tr>
                </thead>

                <tbody>
                    {data.length === 0 ? (
                        <tr>
                            <td colSpan={6}>No data</td>
                        </tr>
                    ) : (
                        data.map((item, index) => (
                            <tr key={item._id}>
                                <td>{index + 1}</td>

                                <td>{item.dataSetId?.originalName || "-"}</td>

                                <td>
                                    {item.uploadedBy?.username || "-"}
                                </td>

                                <td>
                                    {item.predictionId ? (
                                        <span
                                            className={styles.link}
                                            onClick={() =>
                                                handleExport(item.predictionId)
                                            }
                                        >
                                            {item.predictionResult}
                                        </span>
                                    ) : (
                                        "-"
                                    )}
                                </td>

                                <td>
                                    {item.reportCreatedBy?.username || "-"}
                                </td>

                                <td>
                                    {new Date(item.createdAt).toLocaleDateString(
                                        "id-ID", {
                                            day: "numeric",
                                            month: "2-digit",
                                            year: "numeric",
                                            hour: "2-digit",
                                            minute: "2-digit",
                                        }
                                    )}
                                </td>

                                <td>
                                    <div className={styles.actionGroup}>
                                        <button onClick={() => {
                                            setShowEdit(true)
                                            setEditFile(item)
                                        }}
                                        className={styles.buttonAction}>
                                            Edit
                                        </button>
                                        <button className={styles.buttonAction}
                                            onClick={() => {
                                                setShowArchive(true)
                                                setSelDatasetReport(item._id)
                                            }}
                                        >
                                            Archive
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>

            <Modal
                isOpen={showEdit}
                onClose={() => setShowEdit(false)}
            >
                {editFile && (
                    <EditFileForm
                        file={editFile}
                        onClose={() => setShowEdit(false)}
                        onSuccess={() => {
                            setShowEdit(false);
                            fetchData();
                        }}
                    />
                )}

            </Modal>

            <Modal
                isOpen={showArchive}
                onClose={() => setShowArchive(false)}
            >
                {selDatasetReport && (
                    <div className={styles.overlay}>
                        <div className={styles.confirmBox}>
                            <h2 className={styles.title}>ARCHIVED DATASET REPORT</h2>

                            <p className={styles.text}>
                                Are you sure you want to archieve this dataset?
                            </p>

                            <div className={styles.buttonGroup}>
                                <button
                                    className={styles.noBtn}
                                    onClick={() => setShowArchive(false)}
                                >
                                    No
                                </button>

                                <button
                                    className={styles.yesBtn}
                                    onClick={() => handleArchive()}
                                >
                                    Yes
                                </button>
                            </div>
                        </div>
                    </div>
                )}

            </Modal>
        </div>
    );
}