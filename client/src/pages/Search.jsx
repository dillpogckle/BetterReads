import { useParams } from "react-router-dom";
import { SearchResult } from "../components/SearchResult.jsx";
import { useEffect, useState } from "react";
import styles from "./Search.module.css";

export function Search() {
    const { query } = useParams();
    const [results, setResults] = useState([]);

    async function makeQuery(query) {
        const res = await fetch(`/search/${query}`, {
            credentials: "same-origin",
        });

        if (res.ok) {
            const data = await res.json();
            data.docs = data.docs.slice(0, 5);
            return data;
        } else {
            console.error("Error fetching search results:", res.statusText);
            return [];
        }
    }

    useEffect(() => {
        async function fetchData() {
            const data = await makeQuery(query);
            setResults(data.docs);
        }

        fetchData();
    }, [query]);


    return (
        <div className={styles.container}>
            <h1 className={styles.heading}>
                Search Results for "{query ? query.replace(/\+/g, " ") : "..."}"
            </h1>
            <div className={styles.resultsList}>
                {results.map((book) => (
                    <SearchResult
                        key={book.lending_edition}
                        workNum={book.key}
                        cover={book.cover_i}
                    />
                ))}
            </div>
        </div>
    );
}