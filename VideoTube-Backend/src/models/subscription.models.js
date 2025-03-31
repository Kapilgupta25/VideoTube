import mongoose, { Schema } from "mongoose";

const subscriptionSchema = new Schema(
    {
        // The user who is subscribing
        subscriber: {
            typeof: Schema.Types.ObjectId,
            ref: "User"
        },
        // The user who is being subscribed to
        channel: {
            typeof: Schema.Types.ObjectId,
            ref: "User"
        }
    }, { timestamps: true }
);

export const Subscription = mongoose.model("Subscription", subscriptionSchema);