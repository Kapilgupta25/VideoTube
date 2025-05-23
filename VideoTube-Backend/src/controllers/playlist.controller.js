import mongoose, { isValidObjectId } from "mongoose";
import { Playlist } from "../models/playlist.models.js";
import { ApiError } from "../utils/ApiErrors.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";


// --------------------- 1. createPlaylist Controller -------------------
const createPlaylist = asyncHandler(async(req, res) =>{
    const { name, description } = req.body;
    const user = req.user;

    // Check if the user is logged in
    if (!user) {
        throw new ApiError(401, "User not logged in");
    }

    // Create a new playlist
    const playlist = await Playlist.create({
        name,
        description,
        owner: user._id,
    });

    return res.status(201).json(
        new ApiResponse(201, playlist, "Playlist created successfully")
    );
})


// -------------------- 2. getUserPlaylist Controller -------------------
const getUserPlaylist = asyncHandler(async(req, res) =>{
    const user = req.user;

    // Check if the user is logged in
    if (!user) {
        throw new ApiError(401, "User not logged in");
    }

    // Get all playlists to which the user has subscribed
    const playlists = await Playlist.find({ owner: user._id })
        .populate("owner", "-password -refreshToken");
        return res.status(200).json(
            new ApiResponse(200, playlists, "Playlists fetched successfully")
    );
})


// ---------------------- 3. getPlaylistById Controller -------------------
const getPlaylistById = asyncHandler(async(req, res) =>{
    const { playlistId } = req.params;
    const user = req.user;

    // Check if the user is logged in
    if (!user) {
        throw new ApiError(401, "User not logged in");
    }

    // Check if the playlist id is valid
    if (!isValidObjectId(playlistId)) {
        throw new ApiError(400, "Invalid playlist id");
    }

    // Get the playlist by id
    const playlist = await Playlist.findById(playlistId)
        .populate("owner", "-password -refreshToken");

    if (!playlist) {
        throw new ApiError(404, "Playlist not found");
    }

    return res.status(200).json(
        new ApiResponse(200, playlist, "Playlist fetched successfully")
    );  
})


// ---------------------- 4. addVideoToPlaylist Controller -------------------
const addVideoToPlaylist = asyncHandler(async(req, res) =>{
    const { playlistId, videoId } = req.params;
    const user = req.user;

    // Check if the user is logged in
    if (!user) {
        throw new ApiError(401, "User not logged in");
    }

    // Check if the playlist id is valid
    if (!isValidObjectId(playlistId)) {
        throw new ApiError(400, "Invalid playlist id");
    }

    // Check if the video id is valid
    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video id");
    }

    // Add video to playlist
    const playlist = await Playlist.findByIdAndUpdate(
        playlistId,
        { $addToSet: { videos: videoId } },
        { new: true }
    );

    if (!playlist) {
        throw new ApiError(404, "Playlist not found");
    }

    return res.status(200).json(
        new ApiResponse(200, playlist, "Video added to playlist successfully")
    );
})


// ----------------------- 5. removeVideoFromPlaylist Controller -------------------
const removeVideoFromPlaylist = asyncHandler(async(req, res) =>{
    const { playlistId, videoId } = req.params;
    const user = req.user;

    // Check if the user is logged in
    if (!user) {
        throw new ApiError(401, "User not logged in");
    }

    // Check if the playlist id is valid
    if (!isValidObjectId(playlistId)) {
        throw new ApiError(400, "Invalid playlist id");
    }

    // Check if the video id is valid
    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video id");
    }

    // Remove video from playlist
    const playlist = await Playlist.findByIdAndUpdate(
        playlistId,
        { $pull: { videos: videoId } },
        { new: true }
    );

    if (!playlist) {
        throw new ApiError(404, "Playlist not found");
    }

    return res.status(200).json(
        new ApiResponse(200, playlist, "Video removed from playlist successfully")
    );
})


// ----------------------- 6. deletePlaylist Controller -------------------
const deletePlaylist = asyncHandler(async(req, res) =>{
    const { playlistId } = req.params;
    const user = req.user;

    // Check if the user is logged in
    if (!user) {
        throw new ApiError(401, "User not logged in");
    }

    // Check if the playlist id is valid
    if (!isValidObjectId(playlistId)) {
        throw new ApiError(400, "Invalid playlist id");
    }

    // Delete the playlist
    await Playlist.findByIdAndDelete(playlistId);
    return res.status(200).json(
        new ApiResponse(200, null, "Playlist deleted successfully")
    );
})


// ----------------------- 7. updatePlaylist Controller -------------------
const updatePlaylist = asyncHandler(async(req, res) =>{
    const { playlistId } = req.params;
    const { name, description } = req.body;
    const user = req.user;

    // Check if the user is logged in
    if (!user) {
        throw new ApiError(401, "User not logged in");
    }

    // Check if the playlist id is valid
    if (!isValidObjectId(playlistId)) {
        throw new ApiError(400, "Invalid playlist id");
    }

    // Update the playlist
    const playlist = await Playlist.findByIdAndUpdate(
        playlistId,
        { name, description },
        { new: true }
    );

    if (!playlist) {
        throw new ApiError(404, "Playlist not found");
    }

    return res.status(200).json(
        new ApiResponse(200, playlist, "Playlist updated successfully")
    );
})

export {
    createPlaylist,
    getUserPlaylist,
    getPlaylistById,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    deletePlaylist,
    updatePlaylist
};
