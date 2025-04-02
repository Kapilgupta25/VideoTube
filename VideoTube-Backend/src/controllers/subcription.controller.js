import mongoose, { isValidObjectId } from "mongoose";
import { User } from "../models/user.models.js";
import { ApiError } from "../utils/ApiErrors.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Subscription } from "../models/subscription.models.js";


// -------------------- 1. toggleSubscription Controller ----------------
const toggleSubscription = asyncHandler( async(req, res) =>{
    const { channelId } = req.prams;
    const user = req.user;

    // Check if the channel id is valid or not
    if(!isValidObjectId(channelId)){
        throw new ApiError(400, "Invalid channel id");
    }

    // Check if the user is logged in or not
    if(!user){
        throw new ApiError(401, "User not logged in");
    }

    // Check if the user is already subscribed to the channel or not
    const channel = await User.findById(channelId);

    // if user is not subscribed to the channel then he is unable to unsubscribe
    if(!channel){
        throw new ApiError(400, "Channel not found");
    }

    // get the subscription of the user and channel
    const subscription = await Subscription.findOne({ user: user._id, channel: channelId });

    // toggle the subscription by deleting the document if exists or creating a new one if not exists
    if(subscription){
        await Subscription.findByIdAndDelete(subscription._id);
    }else{
        await Subscription.create({ user: user._id, channel: channelId });
    }

    return res.status(200).json(
        new ApiResponse(200, "Subscription toggled successfully")
    );

} )

// ---------------- 2. getUserSubscribedChannels Controller ----------------
//             // controller to return subscriber list of a channel
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
    const {channelId} = req.params
    const user = req.user;
})