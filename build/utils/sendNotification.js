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
const fcm_node_http_1 = require("@kazion/fcm-node-http");
const path_1 = __importDefault(require("path"));
const path_to_private_key = path_1.default.join(__dirname, "../../easyresult-cda44-firebase-adminsdk-dg0d9-e7eab06777.json");
var AndroidMessagePriority;
(function (AndroidMessagePriority) {
    AndroidMessagePriority["NORMAL"] = "NORMAL";
    AndroidMessagePriority["HIGH"] = "HIGH";
})(AndroidMessagePriority || (AndroidMessagePriority = {}));
const fcm = new fcm_node_http_1.FCM(path_to_private_key);
const sendPushNotification = (_a) => __awaiter(void 0, [_a], void 0, function* ({ fcmTokens, title, body, channel = "general", pressAction = "default", }) {
    try {
        yield fcm.sendAll(fcmTokens, {
            notification: {
                body: body,
                title: title,
            },
            data: {
                type: "general",
                notifee: JSON.stringify({
                    title: title,
                    body: body,
                    android: {
                        channelId: channel,
                        pressAction: {
                            id: pressAction,
                        },
                    },
                }),
            },
            android: {
                priority: AndroidMessagePriority.HIGH,
                collapse_key: "general",
                ttl: "3600s",
                restricted_package_name: "com.easyresultbd.app",
                notification: {
                    title: title,
                    body: body,
                    icon: "ic_notification",
                    channel_id: channel,
                },
                fcm_options: {
                    analytics_label: "analytics",
                },
                direct_boot_ok: true,
                data: {
                    type: "general",
                    notifee: JSON.stringify({
                        title: title,
                        body: body,
                        android: {
                            channelId: channel,
                            pressAction: {
                                id: pressAction,
                            },
                        },
                    }),
                },
            },
        });
    }
    catch (error) {
        throw new Error(error);
    }
});
exports.default = sendPushNotification;
