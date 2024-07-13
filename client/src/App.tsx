import { useEffect, useState } from "react";
import { collection, doc, getDocs } from "@firebase/firestore";
import { db } from "./firebase";
import { Button, Form } from "react-bootstrap";
import SendNotification from "./pages/SendNotification";
import Login from "./pages/Login";

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const user = localStorage.getItem("user");
        if (user) {
            setIsLoggedIn(true);
        }
    }, []);

    const logout = () => {
        localStorage.removeItem("user");
        setIsLoggedIn(false);
    };

    return (
        <main className="py-5">
            <div className="container">
                <div
                    className="d-flex justify-content-between align-items-center
                "
                >
                    <h1 className="m-4">Firebase Authentication</h1>
                    {isLoggedIn && <Button onClick={logout}>Logout</Button>}
                </div>
                {isLoggedIn ? (
                    <SendNotification />
                ) : (
                    <Login setLoggedIn={setIsLoggedIn} />
                )}
            </div>
        </main>
    );
}

export default App;
