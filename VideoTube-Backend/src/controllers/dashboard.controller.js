import { ApiError } from "../utils/ApiErrors.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.models.js";
import { Video } from "../models/video.models.js";
import { Subscription } from "../models/subscription.models.js";
import { Like } from "../models/like.models.js";
import mongoose from "mongoose";


// --------------------- 1 getChannelStatus Controller ---------------------
//   This controller Get the channel status like total video views, total subscribers, total videos, total likes etc.
const getChannelStatus = asyncHandler(async (req, res) => {
    const userId = req.user.id;

    // Validate user ID
    if (!mongoose.Types.ObjectId.isValid(userId)) {
        throw new ApiError(400, "Invalid user ID");
    }

    // Fetch user details
    const user = await User.findById(userId).select("name email profilePicture");
    if (!user) {
        throw new ApiError(404, "User not found");
    }

    // Fetch channel stats
    const totalVideos = await Video.countDocuments({ Owner: userId });
    const totalSubscribers = await Subscription.countDocuments({ channel: userId });
    const totalLikes = await Like.countDocuments({ likedBy: userId });
    const totalSubscribersCount = await Subscription.countDocuments({ subscriber: userId });
    
    // Calculate total views across all videos
    const totalViews = await Video.aggregate([
        { $match: { user: userId } },
        { $group: { _id: null, totalViews: { $sum: "$views" } } }
    ]);

    return res.status(200).json(
        new ApiResponse(200, {
            name: user.name,
            email: user.email,
            profilePicture: user.profilePicture,
            totalVideos,
            totalSubscribers,
            totalSubscribersCount,
            totalLikes,
            totalViews: totalViews[0] ? totalViews[0].totalViews : 0
        }, "Channel stats fetched successfully")
    );
})


// --------------------- 2 getChannelVideos Controller ---------------------
//   This controller Get all the videos uploaded by the channel
const getChannelVideos = asyncHandler(async (req, res) => {
    const userId = req.user.id;

    // Validate user ID
    if (!mongoose.Types.ObjectId.isValid(userId)) {
        throw new ApiError(400, "Invalid user ID");
    }

    // Fetch videos uploaded by the user
    const videos = await Video.find( { Owner: userId } )
        .populate("Owner", "name profilePicture")
        .sort({ createdAt: -1 }); // Sort by most recent

    if (!videos || videos.length === 0) {
        return res.status(404).json(
            new ApiResponse(404, null, "No videos found for this channel")
        );
    }

    return res.status(200).json(
        new ApiResponse(200, videos, "Channel videos fetched successfully")
    );
})


export {
    getChannelStatus, 
    getChannelVideos
}
