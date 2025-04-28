import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import * as cookie from "cookie";
import styles from "./Review.module.css";

export function Review() {
    const [reviewText, setReviewText] = useState("");
    const [rating, setRating] = useState(0);
    const navigate = useNavigate();
    const { workNum } = useParams();

    async function handleSubmit(e) {
        e.preventDefault(); // Prevent default form reload behavior

        try {
            console.log(workNum);
            const res = await fetch("/submit_review/", {
                method: "POST",
                credentials: "same-origin",
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRFToken": cookie.parse(document.cookie).csrftoken,
                },
                body: JSON.stringify({
                    review: reviewText,
                    rating: rating,
                    work_num: workNum,
                }),
            });

            if (res.ok) {
                console.log("Review submitted successfully!");
                navigate("/"); // Redirect to homepage after successful submission
            } else {
                const data = await res.json();
                console.error("Failed to submit review:", data.error || res.statusText);
            }
        } catch (error) {
            console.error("Error submitting review:", error);
        }
    }

    return (
        <div className={styles.reviewContainer}>
            <h1 className={styles.title}>Write Your Review</h1>
            <form className={styles.reviewForm} onSubmit={handleSubmit}>
                <div className={styles.formGroup}>
                    <label htmlFor="review" className={styles.label}>Review:</label>
                    <textarea
                        id="review"
                        className={styles.textarea}
                        value={reviewText}
                        onChange={(e) => setReviewText(e.target.value)}
                        rows="5"
                        required
                    />
                </div>

                <div className={styles.formGroup}>
                    <label htmlFor="rating" className={styles.label}>Rating (out of 5):</label>
                    <select
                        id="rating"
                        className={styles.select}
                        value={rating}
                        onChange={(e) => setRating(Number(e.target.value))}
                        required
                    >
                        <option value="">Select a rating</option>
                        {[1, 2, 3, 4, 5].map((num) => (
                            <option key={num} value={num}>{num}</option>
                        ))}
                    </select>
                </div>

                <button className={styles.submitButton} type="submit">Submit Review</button>
            </form>
        </div>
    );
}