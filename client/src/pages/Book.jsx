import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

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
                <div>
                    <h1>{book.title}</h1>
                    <img
                        src={`https://covers.openlibrary.org/b/id/${cover}-M.jpg`}
                        alt={book.title}
                    />
                    <p>{book.description?.value || book.description || "No description available."}</p>
                    <p>Author: {author}</p>
                </div>
            ) : (
                <div>Loading...</div>
            )}
        </div>
    );
}