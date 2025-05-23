import mongoose, { Schema } from "mongoose";

const subscriptionSchema = new Schema(
    {
        // The user who is subscribing
        subscriber: {
            type: Schema.Types.ObjectId,
            ref: "User"
        },
        // The user who is being subscribed to
        channel: {
            type: Schema.Types.ObjectId,
            ref: "User"
        }
    }, { timestamps: true }
);

export const Subscription = mongoose.model("Subscription", subscriptionSchema);