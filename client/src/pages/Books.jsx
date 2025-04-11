import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext.jsx";

export function Books() {
    const { isLoggedIn } = useContext(AuthContext);

    if (isLoggedIn) {
        return (
            <div>
                <h1>My Books</h1>
                <p>Here you can find a list of all the books you have read.</p>
            </div>
        );
    }
    else {
        return (
            <div>
                <h1>My Books</h1>
                <p>You are not logged in</p>
            </div>
        );
    }
}