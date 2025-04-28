import { useNavigate} from "react-router-dom";
import styles from "./BookCard.module.css";

export function BookCard({ book }) {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate(`/book/${book.work_num}`, {
            state: { cover: book.cover_image, author: book.author },
        });
    };

    return (
        <div className={styles.bookCard} onClick={handleClick}>
            <img
                src={book.cover_image}
                alt={`${book.title} cover`}
                className={styles.bookCover}
            />
            <h3 className={styles.bookTitle}>{book.title}</h3>
            <p className={styles.bookAuthor}>{book.author}</p>
        </div>
    );
}