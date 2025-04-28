import * as cookie from "cookie"

export function AddBookButtons({ workNum, title, author, coverImage, description }) {
    const addToWantToRead = async () => {
        const res = await fetch(`/add_want_to_read/${workNum}/`, {
            method: "POST",
            credentials: "same-origin",
            headers: {
                "Content-Type": "application/json",
                "X-CSRFToken": cookie.parse(document.cookie).csrftoken,
            },
            body: JSON.stringify({
                title,
                author,
                coverImage,
                description,
            }),
        });

        if (res.ok) {
            console.log("Added to Want to Read");
        } else {
            console.error("Failed to add to Want to Read");
        }
    };

    const addToCurrentlyReading = () => {
        // Add to Currently Reading logic here
        console.log("Added to Currently Reading");
    };

    const addToRead = () => {
        // Add to Read logic here
        console.log("Added to Read");
    };

    return (
        <div>
            <button onClick={addToWantToRead}>
                Add to Want to Read
            </button>
            <button onClick={addToCurrentlyReading}>
                Add to Currently Reading
            </button>
            <button onClick={addToRead}>
                Add to Read
            </button>
        </div>
    );
}
