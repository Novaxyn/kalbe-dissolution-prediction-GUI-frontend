"use client";

import UserTable from "@/components/userManagement/UserTable";
import Button from "@/components/userManagement/Button";
import Modal from "@/components/Modal";
import CreateUser from "@/components/userManagement/createUser";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

// Define the User
type User = {
    _id: string;
    userId: string;
    username: string;
    email: string;
    role: string;
    status: "active" | "inactive";
    createdAt: string;
    createdBy: string;
};

export default function UserManagementPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [modalOpen, setModalOpen] = useState(false);

    const router = useRouter();

    useEffect(() => {
        const fetchUsers = async () => {
            //Get the token
            const token = localStorage.getItem("token");

            //If there is no token, redirect to login
            if (!token) {
                router.push("/login");
                return;
            }

            try {
                const res = await fetch(
                    `${process.env.NEXT_PUBLIC_USER_API}/api/users/`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                if (!res.ok) {
                    throw new Error("Failed to fetch users");
                }

                //Take the response
                const result = await res.json();
                const rawUsers = result.data || result;

                //Format the users
                const formattedUsers = rawUsers.map((user: any) => ({
                    _id: user._id?.toString(),
                    userId: user.userId,
                    username: user.username,
                    email: user.email || user.user_email,
                    role: user.role,
                    status: user.status || "active",
                    createdBy: user.createdBy || user.created_by,
                    createdAt: new Date(
                        user.createdAt || user.created_at
                    ).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                    }),
                }));

                setUsers(formattedUsers);
            } catch (error) {
                console.log(error);
            }
        };

        fetchUsers();
    }, []);

    const activeUsers = users.filter(
        (user) => user.role === "administrator" || user.role === "operator"
    );

    const inactiveUsers = users.filter(
        (user) => user.role === "nonActive"
    );

    return (
        <div>
            <UserTable
                title="List of Active Users"
                users={activeUsers}
                type="active"
            />
            <div className="ml-5">
                <Button 
                    label="Create User"
                    onClick={() => setModalOpen(true)}
                />
            </div>

            <UserTable
                title="List of Inactive Users"
                users={inactiveUsers}
                type="inactive"
            />

            <Modal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
            >
                <CreateUser
                    onSuccess={() => {
                        setModalOpen(false);
                        window.location.reload();
                    }}
                />

            </Modal>
        </div>
    );
}