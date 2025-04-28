import * as cookie from "cookie"
import { useEffect, useState } from "react";

export function AddBookButtons({ workNum, title, author, coverImage, description }) {
    const [status, setStatus] = useState("not_in_list");

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

    const addToRead = async () => {
        await addToList("read");
        setStatus("read");
    };

    return (
        <div>
            {status === null && <div>Loading...</div>}

            {status === "to_read" && (
                <div>
                    <button onClick={addToCurrentlyReading}>Add to Currently Reading</button>
                    <button onClick={addToRead}>Add to Read</button>
                </div>
            )}

            {status === "reading" && (
                <div>
                    <button onClick={addToRead}>Add to Read</button>
                </div>
            )}

            {status === "read" && (
                <div>
                    <p>This book has already been read!</p>
                </div>
            )}

            {status === "not_in_list" && (
                <div>
                    <button onClick={addToWantToRead}>Add to Want to Read</button>
                    <button onClick={addToCurrentlyReading}>Add to Currently Reading</button>
                    <button onClick={addToRead}>Add to Read</button>
                </div>
            )}
        </div>
    );
}
