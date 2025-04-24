import { useState, useEffect } from "react";
import styles from "./SearchResult.module.css";

export function SearchResult({ workNum, cover }) {
    const [book, setBook] = useState(null);
    const [author, setAuthor] = useState("");

    useEffect(() => {
        async function fetchBook() {
            if (!workNum) {
                console.error("Work number is undefined.");
                return;
            }

            try {
                const res = await fetch(`${workNum}`, {
                    credentials: "same-origin",
                });

                if (res.ok) {
                    const data = await res.json();
                    setBook(data);

                    if (data.authors?.[0]?.author?.key) {
                        const authorRes = await fetch(
                            `https://openlibrary.org${data.authors[0].author.key}.json`
                        );
                        if (authorRes.ok) {
                            const authorData = await authorRes.json();
                            setAuthor(authorData.name);
                        }
                    }
                } else {
                    console.error("Error fetching book data:", res.statusText);
                }
            } catch (error) {
                console.error("Network error while fetching book data:", error);
            }
        }

        fetchBook();
    }, [workNum]);

    if (!book) {
        return <div>Loading...</div>;
    }
    function handleClick() {
        console.log("Book clicked:", book.title);
    }

    return (
        <div className={styles.card} onClick={handleClick}>
            <img
                src={`https://covers.openlibrary.org/b/id/${cover}-M.jpg`}
                alt={book.title}
                className={styles.cover}
            />
            <div className={styles.info}>
                <h3 className={styles.title}>{book.title}</h3>
                <p className={styles.author}><strong>Author:</strong> {author || "Unknown"}</p>
            </div>
        </div>
    );
}