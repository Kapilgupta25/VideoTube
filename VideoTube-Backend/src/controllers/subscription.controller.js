import mongoose, { isValidObjectId } from "mongoose";
import { User } from "../models/user.models.js";
import { ApiError } from "../utils/ApiErrors.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Subscription } from "../models/subscription.models.js";


// -------------------- 1. toggleSubscription Controller ----------------
const toggleSubscription = asyncHandler( async(req, res) =>{
    console.log('req.params', req.params);

    const { channelId } = req.params;
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

    // Prevent subscribing to self
    if (channelId === user._id.toString()) {
        throw new ApiError(400, "You cannot subscribe to your own channel");
    }

    // check existing subscription
    const subscription = await Subscription.findOne({ subscriber: user._id, channel: channelId });

    if (subscription) {
        // Unsubscribe
        await Subscription.findByIdAndDelete(subscription._id);
        console.log("Unsubscribed from channel");
        return res.status(200).json(
            new ApiResponse(200, null, "Unsubscribed successfully")
        );
    } 
    else {
        // Subscribe
        await Subscription.create({
            subscriber: user._id,
            channel: channelId
        });
        console.log("Subscribed to channel");
        return res.status(201).json(
            new ApiResponse(201, null, "Subscribed successfully")
        );
    }

} )

// ---------------- 2. getUserSubscribedChannels Controller ----------------
//             // controller to return subscriber list of a channel
const getUserChannelSubscribers = asyncHandler(async (req, res) => {

    const { channelId } = req.params;
    const user = req.user;

    // console.log('user', user);
    // console.log('channelId', channelId);
    // Check if the channel id is valid
    if (!isValidObjectId(channelId)) {
        throw new ApiError(400, "Invalid channel id");
    }

    // Check if the user is logged in
    if (!user) {
        throw new ApiError(401, "User not logged in");
    }

    // Check if the channel exists
    const channel = await User.findById(channelId);
    if (!channel) {
        throw new ApiError(400, "Channel not found");
    }

    // Get all users subscribed to this channel
    const subscribers = await Subscription.find({ channel: channelId })
        .populate("subscriber", "-password -refreshToken");

    return res.status(200).json(
        new ApiResponse(200, subscribers, "Subscribers fetched successfully")
    );
})


// ---------------- 3. getUserSubscriptions Controller ----------------
//            //controller to return channel list to which user has subscribed
const getSubscribedChannels = asyncHandler(async (req, res) => {
  
    const { subscriberId } = req.params
    const user = req.user;

    // console.log('user', user);
    // console.log('subscriberId', subscriberId);
    // Check if the subscriber id is valid
    if (!isValidObjectId(subscriberId)) {
        throw new ApiError(400, "Invalid subscriber id");
    }
    // Check if the user is logged in
    if (!user) {
        throw new ApiError(401, "User not logged in");
    }
    // Check if the subscriber exists
    const subscriber = await User.findById(subscriberId);
    if (!subscriber) {
        throw new ApiError(400, "Subscriber not found");
    }
    // Get all channels to which the user has subscribed
    const subscriptions = await Subscription.find({ subscriber: subscriberId })
        .populate("channel", "-password -refreshToken");
        return res.status(200).json(
            new ApiResponse(200, subscriptions, "Subscriptions fetched successfully")
    );

})


export { 
    toggleSubscription, 
    getUserChannelSubscribers, 
    getSubscribedChannels 
};
