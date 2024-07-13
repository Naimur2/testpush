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
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.use((0, helmet_1.default)());
app.use((0, morgan_1.default)("dev"));
app.use(express_1.default.urlencoded({ extended: true }));
app.use(express_1.default.text());
app.use(express_1.default.static(path_1.default.join(__dirname, "../client", "dist")));
const CLIENT_DIRECTORY = path_1.default.join(__dirname, "../client", "dist");
app.get("/", (req, res) => {
    res.sendFile(path_1.default.resolve(CLIENT_DIRECTORY, "index.html"));
});
app.post("/send-notification", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    const fcmTokens = (_a = req === null || req === void 0 ? void 0 : req.body) === null || _a === void 0 ? void 0 : _a["fcmTokens"];
    const title = (_b = req === null || req === void 0 ? void 0 : req.body) === null || _b === void 0 ? void 0 : _b["title"];
    const body = (_c = req === null || req === void 0 ? void 0 : req.body) === null || _c === void 0 ? void 0 : _c["body"];
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
    yield (0, sendNotification_1.default)({
        fcmTokens: fcmTokens,
        title,
        body,
    });
    res.status(200).json({ message: "Notification sent successfully" });
}));
// get all tokens from the firebase firestore
app.listen(4000, () => {
    console.log("Server is running on port 4000");
});
