import {useEffect, useState} from 'react'
import {Outlet, useLocation} from "react-router-dom";
import { Navbar } from './components/Navbar'
import { AuthContext } from "./contexts/AuthContext.jsx";

function App() {

    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        async function checkLoginStatus() {
            const res = await fetch("/registration/check_login/", {
                credentials: "same-origin",
            });

            if (res.ok) {
                const data = await res.json();
                setIsLoggedIn(data.is_authenticated);
            } else {
                // handle error
            }
        }

        checkLoginStatus();
    }, [useLocation()]);

    return (
    <AuthContext.Provider value={{isLoggedIn, setIsLoggedIn}}>
        <Navbar />
        <Outlet />
    </AuthContext.Provider>
    )
}

export default App;
