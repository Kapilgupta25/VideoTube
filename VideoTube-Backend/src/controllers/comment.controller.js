import mongoose from "mongoose";
import { Comment } from "../models/comment.models.js";
import { ApiError } from "../utils/ApiErrors.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";


// ---------------------- 1. getVideoComments Controller -------------------
const getVideoComments = asyncHandler(async (req, res) => {
    const { videoId } = req.params;

    // Check if the video id is valid
    if (!mongoose.isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video id");
    }

    // Fetch comments for the video
    const comments = await Comment.find({ video: videoId })
        .populate("owner", "username profilePicture")
        .sort({ createdAt: -1 });

    return res.status(200).json(
        new ApiResponse(200, comments, "Comments fetched successfully")
    );
});


// ---------------------- 2. addComment Controller -------------------
const addComment = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    const { content } = req.body;
    const user = req.user;

    // Check if the user is logged in
    if (!user) {
        throw new ApiError(401, "User not logged in");
    }

    // Check if the video id is valid
    if (!mongoose.isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video id");
    }

    // Create a new comment
    const comment = await Comment.create({
        content,
        video: videoId,
        owner: user._id,
    });

    return res.status(201).json(
        new ApiResponse(201, comment, "Comment added successfully")
    );
});


// ---------------------- 3. deleteComment Controller -------------------
const deleteComment = asyncHandler(async (req, res) => {
    const { commentId } = req.params;
    const user = req.user;

    // Check if the user is logged in
    if (!user) {
        throw new ApiError(401, "User not logged in");
    }

    // Check if the comment id is valid
    if (!mongoose.isValidObjectId(commentId)) {
        throw new ApiError(400, "Invalid comment id");
    }

    // Delete the comment
    await Comment.findByIdAndDelete(commentId);
    return res.status(200).json(
        new ApiResponse(200, null, "Comment deleted successfully")
    );
});


// ---------------------- 4. updateComment Controller -------------------
const updateComment = asyncHandler(async (req, res) => {
    const { commentId } = req.params;
    const { content } = req.body;
    const user = req.user;

    // Check if the user is logged in
    if (!user) {
        throw new ApiError(401, "User not logged in");
    }

    // Check if the comment id is valid
    if (!mongoose.isValidObjectId(commentId)) {
        throw new ApiError(400, "Invalid comment id");
    }

    // Update the comment
    const updatedComment = await Comment.findByIdAndUpdate(
        commentId,
        { content },
        { new: true }
    );

    return res.status(200).json(
        new ApiResponse(200, updatedComment, "Comment updated successfully")
    );
});


export {
    getVideoComments,
    addComment,
    deleteComment,
    updateComment,
};