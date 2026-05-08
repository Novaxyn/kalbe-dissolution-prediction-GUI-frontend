"use client";

import { useState, useEffect } from "react";
import styles from "./logTable.module.css";

type Log = {
    _id: string;
    description: string;
    doneBy: string;
    role: string;
    createdAt: string;
};

export default function LogTable() {
    const [logs, setLogs] = useState<Log[]>([]);

    //Pagination
    const [page, setPage] = useState(1);
    const [totalPage, setTotalPage] = useState(1);

    //Filter
    const[userFilter, setUserFilter] = useState("");
    const[roleFilter, setRoleFilter] = useState("");

    const API = process.env.NEXT_PUBLIC_LOG_API;

    useEffect(() => {
        const fetchLogs = async () => {
            try {
                const token = localStorage.getItem("token");

                const query = new URLSearchParams({
                    page: String(page),
                    limit: "10",
                    user: userFilter,
                    role: roleFilter,
                });

                const res = await fetch(`${API}/api/logs?${query}`, {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                const data = await res.json();

                if (!res.ok) {
                    throw new Error(data.message || "Failed to fetch logs");
                }

                setLogs(data.data || data.logs || []);
                setTotalPage(data.totalPage || 1);
            } catch (error) {
                console.log(error);
            }
        };

        fetchLogs();
    }, [page, userFilter, roleFilter]);

    return (
        <div className={styles.container}>
            <h2 className={styles.title}>Activity Log</h2>

            {/*filter*/}
            <div className={styles.filterContainer}>
                <input
                    type="text"
                    placeholder="Search user..."
                    value={userFilter}
                    onChange={(e) => {
                        setPage(1); // reset page
                        setUserFilter(e.target.value);
                    }}
                    className={styles.input}
                />

                <select
                    value={roleFilter}
                    onChange={(e) => {
                        setPage(1);
                        setRoleFilter(e.target.value);
                    }}
                    className={styles.select}
                >
                    <option value="">All Roles</option>
                    <option value="administrator">Admin</option>
                    <option value="operator">Operator</option>
                </select>
            </div>

            {/*table*/}
            <table className={styles.table}>
                <thead>
                    <tr>
                        <th>No</th>
                        <th>Activity</th>
                        <th>Timestamp</th>
                        <th>Done by</th>
                        <th>User's Role</th>
                    </tr>
                </thead>

                <tbody>
                    {logs.length === 0 ? (
                        <tr>
                            <td colSpan={5} className={styles.empty}>
                                No activity yet
                            </td>
                        </tr>
                    ) : (
                        logs.map((log, index) => (
                            <tr key={log._id}>
                                <td>{(page - 1) * 10 + index + 1}</td>

                                <td>{log.description}</td>

                                <td>
                                    {log.createdAt
                                        ? new Date(log.createdAt).toLocaleString("id-ID", {
                                            day: "numeric",
                                            month: "2-digit",
                                            year: "numeric",
                                            hour: "2-digit",
                                            minute: "2-digit",
                                        })
                                        : "-"}
                                </td>

                                <td>{log.doneBy || "-"}</td>

                                <td>{log.role || "-"}</td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>

            {/*Pagination*/}
            <div className={styles.pagination}>
                <button
                    onClick={() => setPage(page - 1)}
                    disabled={page === 1}
                >
                    Prev
                </button>

                <span>
                    Page {page} of {totalPage}
                </span>

                <button
                    onClick={() => setPage(page + 1)}
                    disabled={page === totalPage}
                >
                    Next
                </button>
            </div>
        </div>
    );
}