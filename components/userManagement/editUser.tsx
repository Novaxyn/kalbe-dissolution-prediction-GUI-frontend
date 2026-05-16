"use client";

import {useState} from "react";
import styles from "./editUser.module.css";
import Popup from "../PopUp";

type props = {
    user: any;
    onClose: () => void;
    onSuccess: () => void;
};

export default function EditUserForm({user, onClose, onSuccess}: props) {
    const [username, setUsername] = useState(user.username);
    const [email, setEmail] = useState(user.email || "");
    const [role, setRole] = useState(user.role);

    const [popup, setPopup] = useState({
        show: false,
        message: ""
    });

    const API = process.env.NEXT_PUBLIC_USER_API;

    const handleEdit = async (e: React.FormEvent) => {
        e.preventDefault();

        const token = localStorage.getItem("token");

        if (!token) {
            setPopup({
                show: true,
                message: "Unauthorized"
            });
            return;
        }

        try {
            const res = await fetch(`${API}/api/users/${user._id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    username,
                    email,
                    role,
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
                    message: "User Updated"
                });
                onSuccess();

            } catch (error) {
                console.log(error);
                setPopup({
                    show: true,
                    message: "Failed to update user"
                });
            }
        }

    return (
        <div className={styles.container}>
            <h2 className={styles.title}>EDIT USER</h2>

            <form onSubmit={handleEdit}>
                <div className={styles.formGroup}>
                    <label>Rename user to:</label>
                    <input
                        className={styles.input}
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </div>

                <div className={styles.formGroup}>
                    <label>Change email to:</label>
                    <input
                        className={styles.input}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>

                <div className={styles.formGroup}>
                    <label>Change role to:</label>
                    <select
                        className={styles.select}
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                    >
                        <option value="operator">Operator</option>
                        <option value="administrator">Administrator</option>
                    </select>
                </div>
                <div className={styles.buttonGroup}>
                    <button type="button" onClick={onClose} className={styles.cancelBtn}>
                        Cancel
                    </button>

                    <button type="submit" className={styles.submitBtn}>
                        Edit User
                    </button>
                </div>
            </form>
            <Popup
                isOpen={popup.show}
                message={popup.message}
                onClose={() => setPopup({ show: false, message: "" })}
            />
        </div>
    )


}
