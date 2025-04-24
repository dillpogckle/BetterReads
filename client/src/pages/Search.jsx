import { useParams} from "react-router-dom";
import {SearchResult} from "../components/SearchResult.jsx";
import { useEffect, useState } from "react";

export function Search() {
    async function makeQuery(query) {
        const res = await fetch(`/search/${query}`, {
            credentials: "same-origin",
        });

        if (res.ok) {
            const data = await res.json();
            return data;
        } else {
            // handle error
            console.error("Error fetching search results:", res.statusText);
            return [];
        }
    }

    const {query} = useParams();
    const [results, setResults] = useState([]);

    useEffect(() => {
        async function fetchData() {
            const data = await makeQuery(query);
            setResults(data.docs);
            console.log(data.docs[0].key);
        }

        fetchData();
    }, [query]);

    return (
        <div className="search-results">
            <h1>Search Results for "{query}"</h1>
            <div className="search-results-list">
                {results.map((book) => (
                    <SearchResult key={book.key} />
                ))}
            </div>
        </div>
    );
}
