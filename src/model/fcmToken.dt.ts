import mongoose, { Document, Schema } from "mongoose";

export type TFcmToken = Document & {
    token: string;
    deviceId?: string;
};

const FcmTokenSchema = new Schema<TFcmToken>({
    token: { type: String, required: true },
    deviceId: { type: String, required: false },
});

const FcmToken = mongoose.model<TFcmToken>("FcmToken", FcmTokenSchema);

export default FcmToken;
