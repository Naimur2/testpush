import { useState } from "react";
import { Button, Form } from "react-bootstrap";

function SendNotification() {
    const [title, setTitle] = useState("");
    const [body, setBody] = useState("");

    const sendNotification = async (e: { preventDefault: () => void }) => {
        try {
            e.preventDefault();

            const accessToken = localStorage.getItem("accessToken");

            console.log("accessToken", accessToken);

            const response = await fetch(
                `${import.meta.env.VITE_APP_API_URL!}/send-notification`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${accessToken}`,
                    },
                    body: JSON.stringify({
                        title,
                        body,
                    }),
                }
            );

            const data = await response.json();
            console.log(data);
            setTitle("");
            setBody("");
            alert(data.message);
        } catch (error) {
            console.error(error);
            alert("An error occurred while sending notification");
        }
    };

    return (
        <main className="py-5">
            <div className="container">
                <h1 className="m-4">Send Notification</h1>
                <Form onSubmit={sendNotification}>
                    <Form.Group className="mb-3" controlId="title">
                        <Form.Label>Title</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter Title"
                            required
                            onChange={(e) => setTitle(e.target.value)}
                            value={title}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="body">
                        <Form.Label>Body</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Body"
                            required
                            onChange={(e) => setBody(e.target.value)}
                            value={body}
                        />
                    </Form.Group>
                    <Button variant="primary" type="submit">
                        Submit
                    </Button>
                </Form>
            </div>
        </main>
    );
}

export default SendNotification;
