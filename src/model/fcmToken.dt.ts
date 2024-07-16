import mongoose, { Document, Schema } from "mongoose";

export type TFcmToken = Document & {
    token: string;
};

const FcmTokenSchema = new Schema<TFcmToken>({
    token: { type: String, required: true },
});

const FcmToken = mongoose.model<TFcmToken>("FcmToken", FcmTokenSchema);

export default FcmToken;
