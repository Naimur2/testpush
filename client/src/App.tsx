import { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import Login from "./pages/Login";
import SendNotification from "./pages/SendNotification";

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
                    <h1 className="m-4">Firebase Push Notification</h1>
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
