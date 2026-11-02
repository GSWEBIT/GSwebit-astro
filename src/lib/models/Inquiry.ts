import mongoose, { Schema, type Document, type Model } from 'mongoose';

export interface IInquiry extends Document {
  name: string;
  email: string;
  topic?: string;
  msg?: string;
  createdAt: Date;
  updatedAt: Date;
}

const InquirySchema = new Schema<IInquiry>(
  {
    name: { type: String, required: true, trim: true, maxlength: 100 },
    email: { type: String, required: true, trim: true, maxlength: 200 },
    topic: { type: String, trim: true, maxlength: 100 },
    msg: { type: String, trim: true, maxlength: 3000 },
  },
  { timestamps: true }
);

export const Inquiry: Model<IInquiry> =
  (mongoose.models.Inquiry as Model<IInquiry>) ||
  mongoose.model<IInquiry>('Inquiry', InquirySchema);

