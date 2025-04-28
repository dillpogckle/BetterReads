import { useState, useEffect } from "react";
import styles from "./SearchResult.module.css";
import { useNavigate } from "react-router-dom";

export function SearchResult({ workNum, cover }) {
    const [book, setBook] = useState(null);
    const navigate = useNavigate();
    const [author, setAuthor] = useState("");

    useEffect(() => {
        async function fetchBook() {
            if (!workNum) {
                console.error("Work number is undefined.");
                return;
            }

            const res = await fetch(`${workNum}`, {
                credentials: "same-origin",
            });

            if (res.ok) {
                const data = await res.json();
                setBook(data);

                const authorKey = data.authors?.[0]?.author?.key;

                if (authorKey) {
                    const authorRes = await fetch(`${authorKey}`, {
                        credentials: "same-origin",
                    });
                    if (authorRes.ok) {
                        const authorData = await authorRes.json();
                        setAuthor(authorData.name);
                    }
                }
            } else {
                console.error("Error fetching book data:", res.statusText);
            }
        }

        fetchBook();
    }, [workNum]);

    if (!book) {
        return <div>Loading...</div>;
    }
    const handleClick = () => {
        navigate(`/book/${workNum.split("/")[2]}`, {
            state: { cover: `https://covers.openlibrary.org/b/id/${cover}-M.jpg` , author: author },
        });
    };

    return (
        <div className={styles.card} onClick={handleClick}>
            <img
                src={`https://covers.openlibrary.org/b/id/${cover}-M.jpg`}
                alt={book.title}
                className={styles.cover}
            />
            <div className={styles.info}>
                    <h3 className={styles.title}> {book.title} </h3>
                    <p className={styles.author}><strong>Author:</strong> {author || "Unknown"}</p>
            </div>
        </div>
    );
}