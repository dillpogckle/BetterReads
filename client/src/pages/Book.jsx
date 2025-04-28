import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { AddBookButtons } from "../components/AddBookButtons.jsx";
import styles from "./Book.module.css";

export function Book() {
    const location = useLocation();
    const { cover, author } = location.state;
    const { workNum } = useParams();
    const [book, setBook] = useState(null);

    useEffect(() => {
        async function fetchBook() {
            if (!workNum) {
                console.error("Work number is undefined.");
                return;
            }

            const res = await fetch(`works/${workNum}`, {
                credentials: "same-origin",
            });

            if (res.ok) {
                const data = await res.json();
                setBook(data);
            } else {
                console.error("Error fetching book data:", res.statusText);
            }
        }

        fetchBook();
    }
    , [workNum]);

    return (
        <div>
            {book ? (
                <div className={styles.bookPage}>
                    <h1 className={styles.bookTitle}>{book.title}</h1>
                    <img
                        className={styles.bookCover}
                        src={cover}
                        alt={book.title}
                    />
                    <p className={styles.bookDescription}>
                        {book.description?.value || book.description || "No description available."}
                    </p>
                    <p className={styles.bookAuthor}>Author: {author}</p>
                    <AddBookButtons
                        title={book.title}
                        author={author}
                        workNum={workNum}
                        coverImage={cover}
                        description={book.description?.value || book.description || "No description available."}
                    />
                </div>
            ) : (
                <div className={styles.loading}>Loading...</div>
            )}
        </div>
    );
}