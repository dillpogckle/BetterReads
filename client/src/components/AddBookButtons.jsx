import * as cookie from "cookie"
import { useEffect, useState } from "react";
import {ReviewModal} from "./ReviewModal.jsx";
import styles from "./AddBookButtons.module.css";
import {useNavigate} from "react-router-dom";

export function AddBookButtons({ workNum, title, author, coverImage, description }) {
    const [status, setStatus] = useState("not_in_list");
    const [showModal, setShowModal] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        async function fetchCurrentStatus() {
            const res = await fetch(`/book_status/${workNum}`, {
                credentials: "same-origin",
            });

            if (res.ok) {
                const data = await res.json();
                setStatus(data.status);  // Update status based on the response from the server.
            } else {
                console.error("Failed to fetch book status");
            }
        }

        fetchCurrentStatus();
    }, [workNum]);

    async function addToList(list){
        const res = await fetch(`/add_to_list/${workNum}/`, {
            method: "POST",
            credentials: "same-origin",
            headers: {
                "Content-Type": "application/json",
                "X-CSRFToken": cookie.parse(document.cookie).csrftoken,
            },
            body: JSON.stringify({
                list,
                title,
                author,
                coverImage,
                description,
            }),
        });

        if (res.ok) {
            console.log("Added to list");
        } else {
            console.error("Failed to add");
        }
    }

    const addToWantToRead = async () => {
        await addToList("to_read");
        setStatus("to_read");
    };

    const addToCurrentlyReading = async () => {
        await addToList("reading");
        setStatus("reading");
    };

    const handleAddToRead = () => {
        // Instead of adding immediately, open the modal
        setShowModal(true);
    };

    const confirmAddToRead = async () => {
        await addToList("read");
        setStatus("read");
        setShowModal(false);
        navigate(`/write-review/${workNum}`); // Redirect to the review page

    };

    const cancelAddToRead = async () => {
        await addToList("read");
        setStatus("read");
        setShowModal(false);
    };



    return (
        <div className={styles.buttonsContainer}>
            {status === null && <div className={styles.loadingMessage}>Loading...</div>}

            {status === "to_read" && (
                <div className={styles.buttonGroup}>
                    <button className={styles.button} onClick={addToCurrentlyReading}>Add to Currently Reading</button>
                    <button className={styles.button} onClick={handleAddToRead}>Add to Read</button>
                </div>
            )}

            {status === "reading" && (
                <div className={styles.buttonGroup}>
                    <button className={styles.button} onClick={handleAddToRead}>Add to Read</button>
                </div>
            )}

            {status === "read" && (
                <div className={styles.readMessage}>
                    This book has already been read!
                </div>
            )}

            {status === "not_in_list" && (
                <div className={styles.buttonGroup}>
                    <button className={styles.button} onClick={addToWantToRead}>Add to Want to Read</button>
                    <button className={styles.button} onClick={addToCurrentlyReading}>Add to Currently Reading</button>
                    <button className={styles.button} onClick={handleAddToRead}>Add to Read</button>
                </div>
            )}

            {showModal && (
                <ReviewModal
                    onConfirm={confirmAddToRead}
                    onCancel={cancelAddToRead}
                />
            )}
        </div>
    );
}
