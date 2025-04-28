import {useContext, useEffect, useState} from "react";
import { AuthContext } from "../contexts/AuthContext.jsx";
import {BookCard} from "../components/BookCard.jsx";
import styles from "./BookShelf.module.css";

export function BookShelf() {
    const {isLoggedIn} = useContext(AuthContext);
    const [toRead, setToRead] = useState([]);
    const [currentlyReading, setCurrentlyReading] = useState([]);
    const [read, setRead] = useState([]);

    useEffect(() => {
        if (isLoggedIn) {
            async function getBookLists() {
                const res = await fetch("/book_lists/", {
                    credentials: "same-origin", // include cookies!
                });

                if (res.ok) {
                    const data = await res.json();
                    setToRead(data.to_read || []);
                    setCurrentlyReading(data.reading || []);
                    setRead(data.read || []);
                    console.log("Bookshelf data fetched successfully:", data);
                } else {
                    console.error("Error fetching bookshelf data:", res.statusText);
                }
            }

            getBookLists();
        }
    }, [isLoggedIn]);

    if (isLoggedIn) {
        return (
            <div className={styles.bookshelfPage}>
                <h1 className={styles.sectionTitle}>Want to Read</h1>
                <div className={styles.bookList}>
                    {toRead.length > 0 ? (
                        toRead.map((book) => (
                            <BookCard key={book.workNum} book={book}/>
                        ))
                    ) : (
                        <p className={styles.emptyListMessage}>
                            No books in the "Want to Read" list.
                        </p>
                    )}
                </div>

                <h1 className={styles.sectionTitle}>Currently Reading</h1>
                <div className={styles.bookList}>
                    {currentlyReading.length > 0 ? (
                        currentlyReading.map((book) => (
                            <BookCard key={book.workNum} book={book}/>
                        ))
                    ) : (
                        <p className={styles.emptyListMessage}>
                            No books in the "Currently Reading" list.
                        </p>
                    )}
                </div>

                <h1 className={styles.sectionTitle}>Read</h1>
                <div className={styles.bookList}>
                    {read.length > 0 ? (
                        read.map((book) => (
                            <BookCard key={book.workNum} book={book}/>
                        ))
                    ) : (
                        <p className={styles.emptyListMessage}>
                            No books in the "Read" list.
                        </p>
                    )}
                </div>
            </div>
        );
    } else {
        return (
            <div className={styles.notLoggedInContainer}>
                <h1 className={styles.notLoggedInTitle}>My Books</h1>
                <p className={styles.notLoggedInMessage}>
                    You are not logged in
                </p>
            </div>
        );
    }
}