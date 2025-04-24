import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import 'vite/modulepreload-polyfill'
import { createHashRouter, RouterProvider} from "react-router-dom";
import { Books } from "./pages/Books.jsx";
import { Profile } from "./pages/Profile.jsx";
import { Home } from "./pages/Home.jsx";
import { Search } from "./pages/Search.jsx";

const router = createHashRouter([
    {
        path: "/",
        element: <App />,
        children:[
            {
                path: "/",
                element: <Home />,
            },
            {
                path: "/books",
                element: <Books />,
            },
            {
                path: "/profile",
                element: <Profile />,
            },
            {
                path: "/search/:query",
                element: <Search />,
            }

            ]
    }
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <RouterProvider router={router} />
)
