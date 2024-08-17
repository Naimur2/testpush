"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const sendNotification_1 = __importDefault(require("./utils/sendNotification"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const path_1 = __importDefault(require("path"));
const dotenv_1 = __importDefault(require("dotenv"));
const argon2_1 = __importDefault(require("argon2"));
const mongoose_1 = __importDefault(require("mongoose"));
const user_dt_1 = __importDefault(require("./model/user.dt"));
const fcmToken_dt_1 = __importDefault(require("./model/fcmToken.dt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
dotenv_1.default.config();
mongoose_1.default
    .connect(process.env.MONGO_URI)
    .then(() => {
    console.log("Connected to the database");
})
    .catch((error) => {
    console.log("error", error);
    process.exit(1);
});
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)());
app.use((0, morgan_1.default)("dev"));
app.use(express_1.default.urlencoded({ extended: true }));
app.use(express_1.default.text());
app.use(express_1.default.static(path_1.default.join(__dirname, "../views")));
const CLIENT_DIRECTORY = path_1.default.join(__dirname, "../views");
app.get("/", (req, res) => {
    res.sendFile(path_1.default.resolve(CLIENT_DIRECTORY, "index.html"));
});
app.post("/register", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const email = (_a = req === null || req === void 0 ? void 0 : req.body) === null || _a === void 0 ? void 0 : _a["email"];
        const password = (_b = req === null || req === void 0 ? void 0 : req.body) === null || _b === void 0 ? void 0 : _b["password"];
        if (!email || !password) {
            return res.status(400).json({
                message: "email and password are required",
            });
        }
        // check if the user already exists
        const user = yield user_dt_1.default.findOne({ email });
        if (user) {
            return res.status(400).json({
                message: "User already exists",
            });
        }
        const hashedPassword = yield argon2_1.default.hash(password);
        const newUser = new user_dt_1.default({
            email,
            password: hashedPassword,
        });
        yield newUser.save();
        const dataToSend = {
            email,
        };
        res.status(200).json({
            message: "Token registered successfully",
            data: dataToSend,
        });
    }
    catch (error) {
        console.log("error", error);
        res.status(500).json({ message: "Internal server error" });
    }
}));
app.post("/send-notification", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d;
    try {
        const accessToken = (_b = (_a = req === null || req === void 0 ? void 0 : req.headers) === null || _a === void 0 ? void 0 : _a["authorization"]) === null || _b === void 0 ? void 0 : _b.split(" ")[1];
        console.log("accessToken", accessToken);
        if (!accessToken) {
            return res.status(401).json({
                message: "Access token is required",
            });
        }
        const decoded = jsonwebtoken_1.default.verify(accessToken, process.env.JWT_SECRET);
        if (!decoded) {
            return res.status(401).json({
                message: "Invalid access token",
            });
        }
        const title = (_c = req === null || req === void 0 ? void 0 : req.body) === null || _c === void 0 ? void 0 : _c["title"];
        const body = (_d = req === null || req === void 0 ? void 0 : req.body) === null || _d === void 0 ? void 0 : _d["body"];
        if (!title || !body) {
            return res.status(400).json({
                message: "title and body are required",
            });
        }
        const fcmTokens = yield fcmToken_dt_1.default.find();
        const tokens = fcmTokens.map((fcmToken) => fcmToken.token);
        if (!tokens.length) {
            return res.status(400).json({
                message: "No devices registered",
            });
        }
        yield (0, sendNotification_1.default)({
            fcmTokens: fcmTokens.map((fcmToken) => fcmToken.token),
            title,
            body,
        });
        res.status(200).json({ message: "Notification sent successfully" });
    }
    catch (error) {
        console.log("error", error);
        res.status(500).json({ message: "Internal server error" });
    }
}));
app.post("/register-token", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const token = (_a = req === null || req === void 0 ? void 0 : req.body) === null || _a === void 0 ? void 0 : _a["token"];
        const deviceId = (_b = req === null || req === void 0 ? void 0 : req.body) === null || _b === void 0 ? void 0 : _b["deviceId"];
        const existingToken = yield fcmToken_dt_1.default.findOne({
            deviceId,
        });
        if (existingToken) {
            yield existingToken.updateOne({
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
        yield fcmToken_dt_1.default.create({
            token,
            deviceId,
        });
        res.status(200).json({
            message: "Token registered successfully",
        });
    }
    catch (error) {
        console.log("error", error);
        res.status(500).json({ message: "Internal server error" });
    }
}));
app.post("/login", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const email = (_a = req === null || req === void 0 ? void 0 : req.body) === null || _a === void 0 ? void 0 : _a["email"];
        const password = (_b = req === null || req === void 0 ? void 0 : req.body) === null || _b === void 0 ? void 0 : _b["password"];
        if (!email || !password) {
            return res.status(400).json({
                message: "email and password are required",
            });
        }
        const user = yield user_dt_1.default.findOne({ email });
        if (!user) {
            return res.status(400).json({
                message: "User not found",
            });
        }
        const isPasswordValid = yield argon2_1.default.verify(user.password, password);
        const jwtToken = jsonwebtoken_1.default.sign({ email }, process.env.JWT_SECRET, {
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
    }
    catch (error) {
        console.log("error", error);
        res.status(500).json({ message: "Internal server error" });
    }
}));
app.listen(process.env.PORT || 4000, () => {
    console.log("Server is running on port", process.env.PORT || 4000);
});
