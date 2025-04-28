import styles from "./ReviewModal.module.css";

export function ReviewModal({ onConfirm, onCancel }) {
    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modal}>
                <h2>Would you like to write a review?</h2>
                <div className={styles.modalButtons}>
                    <button onClick={onConfirm} className={styles.modalButton}>Yes</button>
                    <button onClick={onCancel} className={styles.modalButtonCancel}>No</button>
                </div>
            </div>
        </div>
    );
}