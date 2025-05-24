import mongoose, { isValidObjectId} from "mongoose";
import { ApiError } from "../utils/ApiErrors.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Like } from "../models/like.models.js";

// --------------------- 1. toogleVideoLike Controller -------------------
const toogleVideoLike = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    const user = req.user;

    // Check if the user is logged in
    if (!user) {
        throw new ApiError(401, "User not logged in");
    }

    // Check if the video id is valid
    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video id");
    }

    // Check if the user has already liked the video
    const like = await Like.findOne({ video: videoId, likedBy: user._id });

    if (like) {
        // If the user has already liked the video, remove the like
        await Like.deleteOne({ _id: like._id });
        return res.status(200).json(
            new ApiResponse(200, null, "Video unliked successfully")
        );
    } else {
        // If the user has not liked the video, add a like
        await Like.create({ video: videoId, likedBy: user._id });
        return res.status(201).json(
            new ApiResponse(201, null, "Video liked successfully")
        );
    }
});


// --------------------- 2. toogleCommentLike Controller -------------------
const toogleCommentLike = asyncHandler(async (req, res) => {
    const { commentId } = req.params;
    const user = req.user;

    // Check if the user is logged in
    if (!user) {
        throw new ApiError(401, "User not logged in");
    }

    // Check if the comment id is valid
    if (!isValidObjectId(commentId)) {
        throw new ApiError(400, "Invalid comment id");
    }

    // Check if the user has already liked the comment
    const like = await Like.findOne({ comment: commentId, likedBy: user._id });

    if (like) {
        // If the user has already liked the comment, remove the like
        await Like.deleteOne({ _id: like._id });
        return res.status(200).json(
            new ApiResponse(200, null, "Comment unliked successfully")
        );
    } else {
        // If the user has not liked the comment, add a like
        await Like.create({ comment: commentId, likedBy: user._id });
        return res.status(201).json(
            new ApiResponse(201, null, "Comment liked successfully")
        );
    }
});


// --------------------- 2. toogleTweetLike Controller -------------------
const toogleTweetLike = asyncHandler(async (req, res) => {
    const { tweetId } = req.params;
    const user = req.user;

    // Check if the user is logged in
    if (!user) {
        throw new ApiError(401, "User not logged in");
    }

    // Check if the tweet id is valid
    if (!isValidObjectId(tweetId)) {
        throw new ApiError(400, "Invalid tweet id");
    }

    // Check if the user has already liked the tweet
    const like = await Like.findOne({ tweet: tweetId, likedBy: user._id });

    if (like) {
        // If the user has already liked the tweet, remove the like
        await Like.deleteOne({ _id: like._id });
        return res.status(200).json(
            new ApiResponse(200, null, "Tweet unliked successfully")
        );
    } else {
        // If the user has not liked the tweet, add a like
        await Like.create({ tweet: tweetId, likedBy: user._id });
        return res.status(201).json(
            new ApiResponse(201, null, "Tweet liked successfully")
        );
    }
});


// --------------------- 4. getLikesdVideos Controller -------------------
const getLikedVideos = asyncHandler(async (req, res) => {
    const user = req.user;

    // Check if the user is logged in
    if (!user) {
        throw new ApiError(401, "User not logged in");
    }

    // Get all videos liked by the user
    const likes = await Like.find({ likedBy: user._id })
        .populate("video", "-password -refreshToken");

    return res.status(200).json(
        new ApiResponse(200, likes, "Liked videos fetched successfully")
    );
});



export { 
    toogleVideoLike,
    toogleCommentLike,
    toogleTweetLike,
    getLikedVideos
};