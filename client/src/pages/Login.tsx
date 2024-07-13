import { collection, getDocs } from "@firebase/firestore";
import { useState } from "react";
import { Button, Form } from "react-bootstrap";
import { db } from "../firebase";

type TLogin = {
    setLoggedIn: (loggedIn: boolean) => void;
};

function Login(props: Readonly<TLogin>) {
    const [user, setUser] = useState<string | null>(null);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const login = async (e: { preventDefault: () => void }) => {
        try {
            e.preventDefault();
            const userRef = collection(db, "users");
            const tokenSnap = await getDocs(userRef);

            const findUser = tokenSnap.docs.find(
                (doc) =>
                    doc.data().email === email &&
                    doc.data().password === password
            );

            if (!findUser) {
                alert("User not found");
                return;
            }

            setUser(findUser.data().email);

            props?.setLoggedIn(true);
            localStorage.setItem("user", findUser.data().email);
        } catch (error) {
            console.error(error);
            alert("An error occurred while logging in");
        }
    };

    return (
        <main className="py-5">
            <div className="container">
                <h1 className="m-4">Login</h1>
                <Form onSubmit={login}>
                    <Form.Group className="mb-3" controlId="email">
                        <Form.Label>Email</Form.Label>
                        <Form.Control
                            type="email"
                            placeholder="Enter Email"
                            required
                            onChange={(e) => setEmail(e.target.value)}
                            value={email}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="password">
                        <Form.Label>Password</Form.Label>
                        <Form.Control
                            type="password"
                            placeholder="Enter Password"
                            required
                            onChange={(e) => setPassword(e.target.value)}
                            value={password}
                        />
                    </Form.Group>

                    <Button variant="primary" type="submit">
                        Login
                    </Button>
                </Form>
                {user && <h3 className="mt-4">Welcome {user}</h3>}
            </div>
        </main>
    );
}

export default Login;
