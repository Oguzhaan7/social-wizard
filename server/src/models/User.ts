import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  username: string;
  email: string;
  passwordHash: string;
  displayName: string;
  bio: string;
  location: string;
  website: string;
  birthDate: Date;
  profilePictureUrl: string;
  coverPictureUrl: string;
  isVerified: boolean;
  followers: IUser["_id"][];
  following: IUser["_id"][];
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    displayName: { type: String, required: true },
    bio: { type: String, maxlength: 160 },
    location: String,
    website: String,
    birthDate: Date,
    profilePictureUrl: String,
    coverPictureUrl: String,
    isVerified: { type: Boolean, default: false },
    followers: [{ type: Schema.Types.ObjectId, ref: "User" }],
    following: [{ type: Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

export default mongoose.model<IUser>("User", UserSchema);
