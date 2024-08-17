import express from "express";
import sendPushNotification from "./utils/sendNotification";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import dotenv from "dotenv";
import argon2 from "argon2";
import mongoose from "mongoose";
import User from "model/user.dt";
import FcmToken from "model/fcmToken.dt";
import jwt from "jsonwebtoken";

dotenv.config();

mongoose
    .connect(process.env.MONGO_URI!)
    .then(() => {
        console.log("Connected to the database");
    })
    .catch((error) => {
        console.log("error", error);
        process.exit(1);
    });

const app = express();

app.use(express.json());

app.use(helmet());

app.use(cors());

app.use(morgan("dev"));

app.use(express.urlencoded({ extended: true }));

app.use(express.text());

app.use(express.static(path.join(__dirname, "../views")));

const CLIENT_DIRECTORY = path.join(__dirname, "../views");

app.get("/", (req, res) => {
    res.sendFile(path.resolve(CLIENT_DIRECTORY, "index.html"));
});

app.post("/register", async (req, res) => {
    try {
        const email = req?.body?.["email"];
        const password = req?.body?.["password"];

        if (!email || !password) {
            return res.status(400).json({
                message: "email and password are required",
            });
        }

        // check if the user already exists
        const user = await User.findOne({ email });

        if (user) {
            return res.status(400).json({
                message: "User already exists",
            });
        }

        const hashedPassword = await argon2.hash(password);

        const newUser = new User({
            email,
            password: hashedPassword,
        });

        await newUser.save();

        const dataToSend = {
            email,
        };

        res.status(200).json({
            message: "Token registered successfully",
            data: dataToSend,
        });
    } catch (error) {
        console.log("error", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

app.post("/send-notification", async (req, res) => {
    try {
        const accessToken = req?.headers?.["authorization"]?.split(" ")[1];

        console.log("accessToken", accessToken);

        if (!accessToken) {
            return res.status(401).json({
                message: "Access token is required",
            });
        }

        const decoded = jwt.verify(accessToken, process.env.JWT_SECRET!);

        if (!decoded) {
            return res.status(401).json({
                message: "Invalid access token",
            });
        }

        const title = req?.body?.["title"];
        const body = req?.body?.["body"];

        if (!title || !body) {
            return res.status(400).json({
                message: "title and body are required",
            });
        }

        const fcmTokens = await FcmToken.find();

        const tokens = fcmTokens.map((fcmToken) => fcmToken.token);

        if (!tokens.length) {
            return res.status(400).json({
                message: "No devices registered",
            });
        }

        await sendPushNotification({
            fcmTokens: fcmTokens.map((fcmToken) => fcmToken.token),
            title,
            body,
        });

        res.status(200).json({ message: "Notification sent successfully" });
    } catch (error) {
        console.log("error", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

app.post("/register-token", async (req, res) => {
    try {
        const token = req?.body?.["token"];
        const deviceId = req?.body?.["deviceId"];

        const existingToken = await FcmToken.findOne({
            deviceId,
        });

        if (existingToken) {
            await existingToken.updateOne({
                token,
            });

            return res.status(200).json({
                message: "Token updated successfully",
            });
        }

        if (!token) {
            return res.status(400).json({
                message: "token is required",
            });
        }

        await FcmToken.create({
            token,
        });

        res.status(200).json({
            message: "Token registered successfully",
        });
    } catch (error) {
        console.log("error", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

app.post("/login", async (req, res) => {
    try {
        const email = req?.body?.["email"];
        const password = req?.body?.["password"];

        if (!email || !password) {
            return res.status(400).json({
                message: "email and password are required",
            });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({
                message: "User not found",
            });
        }

        const isPasswordValid = await argon2.verify(user.password, password);

        const jwtToken = jwt.sign({ email }, process.env.JWT_SECRET!, {
            expiresIn: "365d",
        });

        console.log({ jwtToken });

        if (!isPasswordValid) {
            return res.status(400).json({
                message: "Invalid password",
            });
        }

        res.status(200).json({
            message: "Login successful",
            data: {
                accessToken: jwtToken,
            },
        });
    } catch (error) {
        console.log("error", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

app.listen(process.env.PORT || 4000, () => {
    console.log("Server is running on port", process.env.PORT || 4000);
});
