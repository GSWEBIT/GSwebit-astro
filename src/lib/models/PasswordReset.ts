import mongoose, { Schema, type Document, type Model } from 'mongoose';

export interface IPasswordReset extends Document {
  email: string;
  token: string;
  expiresAt: Date;
  used: boolean;
}

const PasswordResetSchema = new Schema<IPasswordReset>({
  email: { type: String, required: true, trim: true },
  token: { type: String, required: true, unique: true },
  expiresAt: { type: Date, required: true },
  used: { type: Boolean, default: false },
});

export const PasswordReset: Model<IPasswordReset> =
  (mongoose.models.PasswordReset as Model<IPasswordReset>) ||
  mongoose.model<IPasswordReset>('PasswordReset', PasswordResetSchema);

