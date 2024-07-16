import mongoose, { Document, Schema } from "mongoose";

export type TUserDocument = Document & {
    email: string;
    password: string;
};

const UserSchema = new Schema<TUserDocument>({
    email: { type: String, required: true },
    password: { type: String, required: true },
});

const User = mongoose.model<TUserDocument>("User", UserSchema);

export default User;
