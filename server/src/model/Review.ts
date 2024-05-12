import mongoose, { Document, Model, Schema } from 'mongoose';

interface IReview extends Document {
    userEmail: string,
    modelName: string,
    score: number
    text: string,
}

const ReviewSchema: Schema<IReview> = new mongoose.Schema({
    userEmail: { type: String, required: true },
    modelName: { type: String, required: true },
    score: { type: Number, required: true },
    text: { type: String, required: true }
});

export const Review: Model<IReview> = mongoose.model<IReview>('Review', ReviewSchema);
