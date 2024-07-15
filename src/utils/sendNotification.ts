type SendNotificationProps = {
    fcmTokens: string[];
    title: string;
    body: string;
    channel?: string;
    pressAction?: string;
};

import { FCM } from "@kazion/fcm-node-http";
import admin from "config/firebase.config";
import { Message } from "firebase-admin/lib/messaging/messaging-api";
import path from "path";

const path_to_private_key = path.join(
    __dirname,
    "../../easyresult-cda44-firebase-adminsdk-dg0d9-e7eab06777.json"
);

enum AndroidMessagePriority {
    NORMAL = "NORMAL",
    HIGH = "HIGH",
}

const fcm = new FCM(path_to_private_key);

const sendPushNotification = async ({
    fcmTokens,
    title,
    body,
    channel = "general",
    pressAction = "default",
}: SendNotificationProps) => {
    try {
        const messages: Message[] = [];

        fcmTokens.forEach((token) => {
            const msz: Message = {
                token: token,
                notification: {
                    title: title,
                    body: body,
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
                    priority: "high",
                    collapseKey: "general",
                    restrictedPackageName: "com.easyresultbd.app",
                    notification: {
                        title: title,
                        body: body,
                        icon: "ic_notification",
                        channelId: channel || "general",
                        sticky: true,
                        priority: "high",
                        clickAction: "easyresultbd://notice",
                    },
                    fcmOptions: {
                        analyticsLabel: "analytics",
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
                    ttl: 3600,
                },
            };

            messages.push(msz);
        });

        await admin.messaging().sendEach(messages);

        // await fcm.sendAll(fcmTokens, {
        //     notification: {
        //         body: body,
        //         title: title,
        //     },
        //     data: {
        //         type: "general",
        //         notifee: JSON.stringify({
        //             title: title,
        //             body: body,
        //             android: {
        //                 channelId: channel,
        //                 pressAction: {
        //                     id: pressAction,
        //                 },
        //             },
        //         }),
        //     },
        //     android: {
        //         priority: AndroidMessagePriority.HIGH,
        //         collapse_key: "general",
        //         ttl: "3600s",
        //         restricted_package_name: "com.easyresultbd.app",
        //         notification: {
        //             title: title,
        //             body: body,
        //             icon: "ic_notification",
        //             channel_id: channel,
        //         },
        //         fcm_options: {
        //             analytics_label: "analytics",
        //         },
        //         direct_boot_ok: true,
        //         data: {
        //             type: "general",
        //             notifee: JSON.stringify({
        //                 title: title,
        //                 body: body,
        //                 android: {
        //                     channelId: channel,
        //                     pressAction: {
        //                         id: pressAction,
        //                     },
        //                 },
        //             }),
        //         },
        //     },
        // });
    } catch (error: any) {
        console.log(JSON.stringify(error));
        throw new Error(error);
    }
};

export default sendPushNotification;
