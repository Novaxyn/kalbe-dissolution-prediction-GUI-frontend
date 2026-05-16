"use client";

import styles from "./UserTable.module.css";
import Modal from "@/components/Modal";
import EditUserForm from "@/components/userManagement/editUser";
import { useState } from "react";
import Popup from "../PopUp";

type User = {
    _id: string;
    userId: string;
    username: string;
    email: string;
    role: string;
    status: "active" | "inactive";
    createdBy: string;
    createdAt: string;
};

type Props = {
    title: string;
    users: User[];
    type: "active" | "inactive";
};

export default function UserTable({ title, users, type }: Props) {

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);

    const usersPerPage = 5;

    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;

    const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);

    const totalPages = Math.ceil(users.length / usersPerPage);

    //Deactivate
    const [showConfirm, setShowConfirm] = useState(false);
    const [selUserId, setSelUserId] = useState<string | null>(null);

    //Edit
    const [showEdit, setShowEdit] = useState(false);
    const [editUser, setEditUser] = useState<User | null>(null);

    const [popup, setPopup] = useState({
        show: false,
        message: ""
    });

    const API = process.env.NEXT_PUBLIC_API_URL;

    const getToken = () => {
        const token = localStorage.getItem("token");

        if(!token) {
            setPopup({
                show: true,
                message: "Unauthorized"
            });
            return null;
        }

        return {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        };
    };

    // Get token and set headers
    const headers = getToken();

    if(!headers) {
        return;
    }

    const handleDelete = async () => {
        if (!selUserId) return;

        try {
            const res = await fetch(`${API}/api/users/deactivate/${selUserId}`, {
                method: "PUT",
                headers,
                body: JSON.stringify({
                    status: "inactive",
                    role: "nonActive",
                }),
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
                message: "User deactivated"
            });

            setShowConfirm(false);
            window.location.reload();
            } catch (error) {
                console.log(error);
                setPopup({
                    show: true,
                    message: "Failed to deactivate user"
                });
            }
    }

    const handleReactivate = async (id: string) => {
        try {
            const res = await fetch(`${API}/api/users/reactivate/${id}`, {
                method: "PUT",
                headers,
                body: JSON.stringify({
                    status: "active",
                    role: "operator",
                }),
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
            message: "User reactivated"
        });

        window.location.reload();
        } catch (error) {
            console.log(error);
            setPopup({
                show: true,
                message: "Failed to reactivate user"
            });
        }
    };

    return (
        <div className={styles.container}>
            <h4 className={styles.title}>{title}</h4>

            <table className={styles.table}>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Username</th>
                        <th>Role</th>
                        <th>Created At</th>
                        <th>Created By</th>
                        <th>Actions</th>
                    </tr>
                </thead>

                <tbody>
                    {currentUsers.map((user) => (
                        <tr key={user._id}>
                            <td>{user.userId}</td>
                            <td>{user.username}</td>
                            <td>{user.role}</td>
                            <td>{user.createdAt}</td>
                            <td>{user.createdBy}</td>
                            <td>
                                {type === "active" ? (
                                    <>
                                    <div className={styles.actionGroup}>
                                        <button onClick={() => {
                                            setEditUser(user);
                                            setShowEdit(true);
                                        }}
                                        className={styles.buttonAction}>
                                            Edit
                                        </button>

                                        <button onClick={() => {
                                            setSelUserId(user._id);
                                            setShowConfirm(true);
                                        }}
                                        className={styles.buttonAction}>
                                            Deactivate
                                        </button>
                                    </div>
                                    </>
                                ) : (
                                    <button
                                        onClick={() => handleReactivate(user._id)}
                                        className={styles.buttonAction}
                                    >
                                        Reactivate
                                    </button>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div
                style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: "10px",
                    marginTop: "20px"
                }}
            >
                <button
                    onClick={() => setCurrentPage((prev) => prev - 1)}
                    disabled={currentPage === 1}
                    className={styles.buttonAction}
                >
                    Prev
                </button>

                <span>
                    Page {currentPage} of {totalPages}
                </span>

                <button
                    onClick={() => setCurrentPage((prev) => prev + 1)}
                    disabled={currentPage === totalPages}
                    className={styles.buttonAction}
                >
                    Next
                </button>
            </div>

            {/* Deactivate Confirm (Manual modal)*/}
            {showConfirm && (
                <div className={styles.overlay}>
                    <div className={styles.confirmBox}>
                        <h2 className={styles.title}>DEACTIVATE USER</h2>

                        <p className={styles.text}>
                            Are you sure you want to deactivate this user?
                        </p>

                        <p className={styles.subText}>
                            Inactive user will be shown and can be reactivated
                        </p>

                        <div className={styles.buttonGroup}>
                            <button
                                className={styles.noBtn}
                                onClick={() => setShowConfirm(false)}
                            >
                                No
                            </button>

                            <button
                                className={styles.yesBtn}
                                onClick={() => handleDelete()}
                            >
                                Yes
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit */}
            <Modal
                isOpen={showEdit}
                onClose={() => setShowEdit(false)}
            >
                {editUser && (
                    <EditUserForm
                        user={editUser}
                        onClose={() => setShowEdit(false)}
                        onSuccess={() => window.location.reload()}
                    />
                )}

            </Modal>

            <Popup
                isOpen={popup.show}
                message={popup.message}
                onClose={() => setPopup({ show: false, message: "" })}
            />
        </div>
    );
}