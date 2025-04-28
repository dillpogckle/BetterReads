import styles from "./ReviewCard.module.css";
import { useNavigate } from "react-router-dom";

export function ReviewCard({ friend, book, review, rating, createdAt, cover }) {
    const navigate = useNavigate();
    function showBook() {
        navigate(`/book/${book.work_num}`, {
            state: {
                cover: cover,
                author: book.author,
            },
        });
    }

    return (
        <div className={styles.card} onClick={showBook}>
            <div className={styles.header}>
                <h3 className={styles.headerText}>
                    {friend.first_name} {friend.last_name} reviewed {book.title}
                </h3>
                <p className={styles.date}>{new Date(createdAt).toLocaleDateString()}</p>
            </div>

            <div className={styles.body}>
                <img src={cover} alt={`${book.title} cover`} className={styles.cover} />
                <div className={styles.info}>
                    <p className={styles.reviewContent}>"{review}"</p>
                    <div className={styles.extraInfo}>
                        <span className={styles.rating}>⭐ {rating}/5</span>
                    </div>
                </div>
            </div>
        </div>
    );
}