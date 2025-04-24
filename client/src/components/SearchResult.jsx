import { useState, useEffect } from "react";

export function SearchResult({ key }) {
    const [book, setBook] = useState({});

    useEffect(() => {
        async function fetchBook() {
            const res = await fetch(`/search/${key}`, {
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
    }, [key]);

    return (
        <div className="search-result">
            <img src={book.cover_image} alt={book.title} />
            <div className="search-result-info">
                <h3>{book.title}</h3>
                <p>{book.author}</p>
            </div>
        </div>
    );
}