"use client";

import { useState, useEffect } from "react";
import styles from "./fileTable.module.css";
import Modal from "@/components/Modal";
import Popup from "@/components/PopUp";
import EditFileForm from "@/components/fileManagement/editFile";
import UploadDatasetModal from "./UploadDatasetModal";
import styles2 from "./buttonUpload.module.css";

type User = {
    _id: string;
    username: string;
};

type Dataset = {
    _id: string;
    originalName: string;
    uploadTime: string;
    uploadedBy: User;
}

type Report = {
    _id: string;
    
    dataSetId: {
        _id: string;
        originalName: string;
    };

    uploadedBy: {
        username: string;
    };

    uploadedOn: string;

    reportCreatedBy?: {
        username: string;
    };

    predictionResult: string;
    createdAt: string;
    predictionId?: string;
};

export default function DatasetReportTable() {
    const [file, setFile] = useState<File | null>(null);
    const [datasets, setDatasets] = useState<Dataset[]>([]);
    const [reports, setReports] = useState<Report[]>([]);

    const [showEditDataset, setShowEditDataset] = useState(false);
    const [showEditReport, setShowEditReport] = useState(false);

    const [showArchiveDataset, setShowArchiveDataset] = useState(false);
    const [showArchiveReport, setShowArchiveReport] = useState(false);

    const [selDatasetReport, setSelDatasetReport] = useState<string | null>(null);
    const [selDataset, setSelDataset] = useState<string | null>(null);

    const [editDataset, setEditDataset] = useState<Dataset | null>(null);
    const [editReport, setEditReport] = useState<Report | null>(null);

    const [showUploadModal, setShowUploadModal] = useState(false);
    const API = process.env.NEXT_PUBLIC_DATASET_API;

    const [popup, setPopup] = useState({
        show: false,
        message: ""
    });

    useEffect(() => {
        fetchDatasetReport();
        fetchDataset();
    }, []);

    const fetchDatasetReport = async () => {
        try {
            const token = localStorage.getItem("token");

            const res = await fetch(`${API}/api/reports/`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const result = await res.json();
            setReports(result.data || []);
        } catch (error) {
            console.log(error);
        }
    };

    const fetchDataset = async () => {
        try {
            const token = localStorage.getItem("token");

            const res = await fetch(`${API}/api/datasets/`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const result = await res.json();
            setDatasets(result.datasets || []);
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

    const handleArchiveDataset = async () => {
        if (!selDataset) return;

        try {
            const token = localStorage.getItem("token");

            const res = await fetch(`${API}/api/datasets/archive/${selDataset}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = await res.json();

            if (!res.ok) {
                setPopup({
                    show: true,
                    message: data.message
                });
                return;
            }

            setShowArchiveDataset(false);
            fetchDataset();
        } catch (error) {
            console.log(error);
        }
    };

    const uploadDataset = async () => {
        if (!file) {
            setPopup({
            show: true,
            message: "Please select a file"
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

            setFile(null);
            fetchDataset(); // Refresh the table
        } catch (error) {
            console.log(error);
        }
    }

    const handleArchiveReport = async () => {
        if (!selDatasetReport) return;

        try {
            const token = localStorage.getItem("token");

            const res = await fetch(`${API}/api/reports/archive/${selDatasetReport}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = await res.json();

            if (!res.ok) {
                setPopup({
                    show: true,
                    message: data.message
                });
                return;
            }

            setShowArchiveReport(false);
            fetchDatasetReport();
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className={styles.container}>
            <h2 className={styles.title}>Dataset Report</h2>

        {/* Dataset */}
            <table className={styles.table}>
                <thead>
                    <tr>
                        <th>No</th>
                        <th>MicroNIR Dataset</th>
                        <th>Uploaded By</th>
                        <th>Date</th>
                        <th>Action</th>
                    </tr>
                </thead>

                <tbody>
                    {datasets.length === 0 ? (
                        <tr>
                            <td colSpan={6}>No data</td>
                        </tr>
                    ) : (
                        datasets.map((item, index) => (
                            <tr key={item._id}>
                                <td>{index + 1}</td>

                                <td>{item.originalName || "-"}</td>

                                <td>
                                    {item.uploadedBy?.username || "-"}
                                </td>

                                <td>
                                    {new Intl.DateTimeFormat("id-ID", {
                                        timeZone: "Asia/Jakarta",
                                        year: "numeric",
                                        month: "2-digit",
                                        day: "2-digit",
                                        hour: "2-digit",
                                        minute: "2-digit",
                                        second: "2-digit",
                                    }).format(new Date(item.uploadTime)) +
                                    "." +
                                    String(new Date(item.uploadTime).getMilliseconds()).padStart(3, "0")}
                                </td>

                                <td>
                                    <div className={styles.actionGroup}>
                                        <button onClick={() => {
                                            setShowEditDataset(true);
                                            setEditDataset(item);
                                        }}
                                        className={styles.buttonAction}>
                                            Edit
                                        </button>
                                        <button className={styles.buttonAction}
                                            onClick={() => {
                                                setShowArchiveDataset(true)
                                                setSelDataset(item._id)
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

            <div style={{marginBottom: "20px", marginTop: "20px"}}>
                <button 
                    onClick={() => {
                        setShowUploadModal(true)
                    }}
                    className={styles2.buttonUpload}
                >
                    Upload Dataset
                </button>
            </div>

            {/* Dataset Report */}
            <table className={styles.table}>
                <thead>
                    <tr>
                        <th>No</th>
                        <th>Dataset</th>
                        <th>Uploaded By</th>
                        <th>Uploaded On</th>
                        <th>Prediction Result</th>
                        <th>Report Created By</th>
                        <th>Report Created On</th>
                        <th>Actions</th>
                    </tr>
                </thead>

                <tbody>
                    {reports.length === 0 ? (
                        <tr>
                            <td colSpan={6}>No data</td>
                        </tr>
                    ) : (
                        reports.map((item, index) => (
                            <tr key={item._id}>
                                <td>{index + 1}</td>

                                <td>{item.dataSetId?.originalName || "-"}</td>

                                <td>
                                    {item.uploadedBy?.username || "-"}
                                </td>

                                <td>
                                    {new Intl.DateTimeFormat("id-ID", {
                                        timeZone: "Asia/Jakarta",
                                        year: "numeric",
                                        month: "2-digit",
                                        day: "2-digit",
                                        hour: "2-digit",
                                        minute: "2-digit",
                                        second: "2-digit",
                                    }).format(new Date(item.uploadedOn)) +
                                    "." +
                                    String(new Date(item.uploadedOn).getMilliseconds()).padStart(3, "0")}
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
                                    {new Intl.DateTimeFormat("id-ID", {
                                        timeZone: "Asia/Jakarta",
                                        year: "numeric",
                                        month: "2-digit",
                                        day: "2-digit",
                                        hour: "2-digit",
                                        minute: "2-digit",
                                        second: "2-digit",
                                    }).format(new Date(item.createdAt)) +
                                    "." +
                                    String(new Date(item.createdAt).getMilliseconds()).padStart(3, "0")}
                                </td>

                                <td>
                                    <div className={styles.actionGroup}>
                                        <button onClick={() => {
                                            setShowEditReport(true)
                                            setEditReport(item)
                                        }}
                                        className={styles.buttonAction}>
                                            Edit
                                        </button>
                                        <button className={styles.buttonAction}
                                            onClick={() => {
                                                setShowArchiveReport(true)
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

            {/* Dataset */}
            <Modal
                isOpen={showEditDataset}
                onClose={() => setShowEditDataset(false)}
            >
                {editDataset && (
                    <EditFileForm
                        file={editDataset}
                        onClose={() => setShowEditDataset(false)}
                        onSuccess={() => {
                            setShowEditDataset(false);
                            fetchDataset();
                        }}
                    />
                )}

            </Modal>

            {/* Upload Dataset */}
            <Modal
                isOpen={showUploadModal}
                onClose={() => setShowUploadModal(false)}
            >
                <UploadDatasetModal 
                    onClose={() => setShowUploadModal(false)}
                    onSuccess={() => {
                        setShowUploadModal(false);
                        fetchDatasetReport();
                    }}
                />
            </Modal>

            {/* Dataset Report */}
            <Modal
                isOpen={showEditReport}
                onClose={() => setShowEditReport(false)}
            >
                {editReport && (
                    <EditFileForm
                        file={editReport}
                        onClose={() => setShowEditReport(false)}
                        onSuccess={() => {
                            setShowEditReport(false);
                            fetchDatasetReport();
                        }}
                    />
                )}

            </Modal>

            {/* Dataset Report */}
            <Modal
                isOpen={showArchiveReport}
                onClose={() => setShowArchiveReport(false)}
            >
                {selDatasetReport && (
                    <div className={styles.overlay}>
                        <div className={styles.confirmBox}>
                            <h2 className={styles.title}>ARCHIVED DATASET REPORT</h2>

                            <p className={styles.text}>
                                Are you sure you want to archive this report?
                            </p>

                            <div className={styles.buttonGroup}>
                                <button
                                    className={styles.noBtn}
                                    onClick={() => setShowArchiveReport(false)}
                                >
                                    No
                                </button>

                                <button
                                    className={styles.yesBtn}
                                    onClick={() => handleArchiveReport()}
                                >
                                    Yes
                                </button>
                            </div>
                        </div>
                    </div>
                )}

            </Modal>

            {/* Dataset */}
            <Modal
                isOpen={showArchiveDataset}
                onClose={() => setShowArchiveDataset(false)}
            >
                {selDataset && (
                    <div className={styles.overlay}>
                        <div className={styles.confirmBox}>
                            <h2 className={styles.title}>ARCHIVED DATASET</h2>

                            <p className={styles.text}>
                                Are you sure you want to archive this dataset?
                            </p>

                            <div className={styles.buttonGroup}>
                                <button
                                    className={styles.noBtn}
                                    onClick={() => setShowArchiveDataset(false)}
                                >
                                    No
                                </button>

                                <button
                                    className={styles.yesBtn}
                                    onClick={() => handleArchiveDataset()}
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