// src/pages/Home.jsx
import { useEffect, useState, useContext } from "react";
import { ReviewCard } from "../components/ReviewCard.jsx";
import { AuthContext } from "../contexts/AuthContext.jsx";
import styles from "./Home.module.css";

export function Home() {
    const [reviews, setReviews] = useState([]);
    const { isLoggedIn } = useContext(AuthContext);

    useEffect(() => {
        async function fetchRecentReviews() {
            try {
                const res = await fetch("/friends_recent_reviews/", {
                    credentials: "same-origin",
                });

                if (res.ok) {
                    const data = await res.json();
                    setReviews(data.reviews);
                } else {
                    console.error("Failed to fetch reviews");
                }
            } catch (error) {
                console.error("Error fetching reviews:", error);
            } finally {
                setLoading(false);
            }
        }

        fetchRecentReviews();
    }, []);

    if (!isLoggedIn) {
        return (
            <div className={styles.homeContainer}>
                <h1 className={styles.title}>Welcome to Bookstagram</h1>
                <p>Please log in to see your friends' recent reviews.</p>
            </div>
        );
    }

    if (!reviews) {
        return <div className={styles.loading}>Loading recent reviews...</div>;
    }

    return (
        <div className={styles.homeContainer}>
            <h1 className={styles.title}>Friends' Recent Reviews</h1>
            {reviews.length === 0 ? (
                <p>No recent reviews from your friends yet.</p>
            ) : (
                <div className={styles.reviewList}>
                    {reviews.map((review, index) => (
                        <ReviewCard
                            key={index}
                            friend={review.friend}
                            book={review.book}
                            review={review.review}
                            rating={review.rating}
                            createdAt={review.created_at}
                            cover={review.book.cover_image}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}