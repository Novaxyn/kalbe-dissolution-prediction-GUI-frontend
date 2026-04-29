"use client";

import styles from "./Modal.module.css";

type PopupProps = {
  isOpen: boolean;
  message: string;
  onClose: () => void;
};

export default function Popup({ isOpen, message, onClose }: PopupProps) {
  if (!isOpen) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <p style={{ marginBottom: "20px" }}>{message}</p>

        <button
          onClick={onClose}
          style={{
            padding: "8px 16px",
            background: "#4CAF50",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer"
          }}
        >
          OK
        </button>
      </div>
    </div>
  );
}