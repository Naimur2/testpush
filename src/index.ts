import express from "express";
import sendPushNotification from "./utils/sendNotification";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";

const app = express();

app.use(express.json());
app.use(cors());

app.use(helmet());

app.use(morgan("dev"));

app.use(express.urlencoded({ extended: true }));

app.use(express.text());

app.use(express.static(path.join(__dirname, "dist")));

const CLIENT_DIRECTORY = path.join(__dirname, "dist");

app.get("/", (req, res) => {
    res.sendFile(path.resolve(CLIENT_DIRECTORY, "index.html"));
});

app.post("/send-notification", async (req, res) => {
    try {
        const fcmTokens = req?.body?.["fcmTokens"];
        const title = req?.body?.["title"];
        const body = req?.body?.["body"];

        if (!fcmTokens || !title || !body) {
            return res.status(400).json({
                message: "fcmTokens, title, and body are required",
            });
        }

        if (!Array.isArray(fcmTokens)) {
            return res.status(400).json({
                message: "fcmTokens must be an array",
            });
        }

        await sendPushNotification({
            fcmTokens: fcmTokens,
            title,
            body,
        });

        res.status(200).json({ message: "Notification sent successfully" });
    } catch (error) {
        console.log("error", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

// get all tokens from the firebase firestore

app.listen(10000, () => {
    console.log("Server is running on port 10000");
});
