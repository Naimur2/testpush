import axios from "axios";
import { useState } from "react";
import { Button, Form } from "react-bootstrap";

type TLogin = {
    setLoggedIn: (loggedIn: boolean) => void;
};

function Login(props: Readonly<TLogin>) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const login = async (e: { preventDefault: () => void }) => {
        try {
            e.preventDefault();
            const response = await axios.post(
                import.meta.env.VITE_APP_API_URL + "/login",
                {
                    email,
                    password,
                }
            );

            const data = response.data;

            const accessToken = data.data?.accessToken;

            if (!accessToken) {
                alert("Invalid email or password");
                return;
            }

            localStorage.setItem("accessToken", accessToken);
            localStorage.setItem("user", email);

            props?.setLoggedIn(true);
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
            </div>
        </main>
    );
}

export default Login;
