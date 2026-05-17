"use client";

import UserTable from "@/components/userManagement/UserTable";
import Button from "@/components/userManagement/Button";
import Modal from "@/components/Modal";
import CreateUser from "@/components/userManagement/createUser";

import { useState } from "react";

export default function UserManagementPage() {

    const [modalOpen, setModalOpen] = useState(false);

    return (
        <div>

            <UserTable
                title="List of Active Users"
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