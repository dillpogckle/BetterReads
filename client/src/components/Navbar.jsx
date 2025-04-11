import { Link } from "react-router-dom";
import styles from './Navbar.module.css';
import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext.jsx";

export function Navbar() {
    const { isLoggedIn, setIsLoggedIn } = useContext(AuthContext);

    async function logout() {
        const res = await fetch("/registration/logout/", {
            credentials: "same-origin", // include cookies!
        });

        if (res.ok) {
            // navigate away from the single page app!
            setIsLoggedIn(false);
            window.location = "/";
        } else {
            // handle logout failed!
        }
    }


    return (
        <nav className={styles.navbar}>
            <div className={styles.pages}>
                <div className={styles.title}> Bookstagram </div>
                <Link className={styles.home} to="/">Home</Link>
                <Link className={styles.books} to="/books">My Books</Link>
                <Link className={styles.profile} to="/profile">Profile</Link>
            </div>

            <div className={styles.auth}>
                {!isLoggedIn ? (
                    <>
                        <a href="/registration/sign_in/" className={styles.login}>Login</a>
                        <a href="/registration/sign_up/" className={styles.signup}>Sign Up</a>
                    </>
                ) : (
                    <button className={styles.logout} onClick={logout}>Logout</button>
                )}
            </div>
        </nav>
    );
}