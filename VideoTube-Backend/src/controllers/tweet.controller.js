import mongoose, { isValidObjectId } from "mongoose";
import { Tweet } from "../models/tweet.models.js";
import { User } from "../models/user.models.js";
import { ApiError } from "../utils/ApiErrors.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";


// ----------------- 1. createTweet Controller ----------------
const createTweet = asyncHandler(async (req, res) => {
    const { content } = req.body;
    const user = req.user;

    // Check if the user is logged in
    if (!user) {
        throw new ApiError(401, "User not logged in");
    }

    // Create a new tweet
    const tweet = await Tweet.create({
        content,
        owner: user._id,
        media: req.files?.media[0].path,
    });

    return res.status(201).json(
        new ApiResponse(201, tweet, "Tweet created successfully")
    );
})


// ----------------- 2. getUserTweets Controller ----------------
const getUserTweets = asyncHandler(async (req, res) => {
    const user = req.user;

    // Check if the user is logged in
    if (!user) {
        throw new ApiError(401, "User not logged in");
    }

    // Get the tweets of the user
    const tweets = await Tweet.find({ owner: user._id })
        .populate("owner", "name profilePic")
        .sort({ createdAt: -1 });

    return res.status(200).json(
        new ApiResponse(200, tweets, "Tweets fetched successfully")
    );
})


// ------------------ 3. updateTweet Controller ----------------
const updateTweet = asyncHandler(async (req, res) => {
    console.log('req.params', req.params);
    console.log('req.body', req.body);
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

    // Check if the tweet exists
    const tweet = await Tweet.findById(tweetId);
    if (!tweet) {
        throw new ApiError(404, "Tweet not found");
    }

    // Check if the user is the owner of the tweet
    if (tweet.owner.toString() !== user._id.toString()) {
        throw new ApiError(403, "You are not authorized to update this tweet");
    }

    // Update the tweet
    const updatedTweet = await Tweet.findByIdAndUpdate(
        tweetId,
        {   content: req.body.content,
            media: req.files?.media[0].path
        },
        { new: true }
    );

    return res.status(200).json(
        new ApiResponse(200, updatedTweet, "Tweet updated successfully")
    );
})


// ------------------ 4. deleteTweet Controller ----------------
const deleteTweet = asyncHandler(async (req, res) => {
    
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

    // Check if the tweet exists
    const tweet = await Tweet.findById(tweetId);
    if (!tweet) {
        throw new ApiError(404, "Tweet not found");
    }
    // Check if the user is the owner of the tweet
    if (tweet.owner.toString() !== user._id.toString()) {
        throw new ApiError(403, "You are not authorized to delete this tweet");
    }
    // Delete the tweet
    await Tweet.findByIdAndDelete(tweetId);
    return res.status(200).json(
        new ApiResponse(200, null, "Tweet deleted successfully")
    );
})

// ------------------ 5. reTweet Controller ----------------
const reTweet = asyncHandler(async (req, res) => {
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

    // Check if the tweet exists
    const tweet = await Tweet.findById(tweetId);
    if (!tweet) {
        throw new ApiError(404, "Tweet not found");
    }

    // Create a new tweet with the same content and owner
    const reTweet = await Tweet.create({
        content: tweet.content,
        owner: user._id,
        media: tweet.media,
    });

    return res.status(201).json(
        new ApiResponse(201, reTweet, "ReTweeted successfully")
    );
})


export { 
    createTweet,
    getUserTweets,
    updateTweet,
    deleteTweet,
    reTweet,
}
