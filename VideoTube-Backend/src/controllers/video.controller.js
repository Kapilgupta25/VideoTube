import mongoose from "mongoose";
import jwt from 'jsonwebtoken';
import path from "path";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiErrors.js";
import { Video } from "../models/video.models.js";
import { User } from "../models/user.models.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";


// -------------------- 1. getAllvideoes Controller ------------------
const getAllVideoes = asyncHandler( async(req, res) => {
    // get the user id
    const user = req.user._id;

    if(!user) {
        throw new ApiError(401, "User not logged in");
    }

    // get the query parameters for pagination, sorting, and search
    const { page=1, limit=10, query, sort, sortType } = req.query;

    // get the videos
    const videos = await Video.find({ Owner: user})
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(parseInt(limit))
    .exec();

    // if no videos, throw an error
    if(!videos){
        throw new ApiError(404, "No video found");
    }

    return res.status(200).json(
        new ApiResponse(200, videos, "Videos fetched successfully")
    );

})


// -------------------- 2. publishAVideo Controller ----------------
const publishAVideo = asyncHandler( async(req, res) => {

    // get the data from thr req.body
    const { title, description } = req.body;
    // console.log(req.files);
    
    // get video, upload to cloudinary, create video
    const video = await Video.create({
        title,
        description,
        Owner: req.user._id,
        videoFile: req.files?.videoFile[0].path,
        thumbnail: req.files?.thumbnail[0].path
    });

    if(!video){
        throw new ApiError(500, "Failed to create video");
    }    

    // Upload video to cloudinary
    const videoUpload = await uploadOnCloudinary(video.videoFile);
    const thumbnailUpload = await uploadOnCloudinary(video.thumbnail);

    // if no video, throw an error
    if(!videoUpload || !thumbnailUpload){
        throw new ApiError(500, "Failed to upload video to cloudinary");
    }

    return res.status(201).json(
        new ApiResponse(201, video, "Video published successfully")
    );
})


// -------------------- 3. getVideoById Controller ----------------
const getVideoById = asyncHandler(async (req, res) => {
    // get the user id
    const { getvideoId } = req.params
    // console.log(req.params);
    // console.log(getvideoId);
    
    
    //get video by id
    const video = await Video.findById(getvideoId);
    console.log(video);    

    if(!video){
        throw new ApiError(404, "Video not found");
    }

    return res.status(200).json(
        new ApiResponse(200, video, "Video fetched successfully")
    );
})


// -------------------- 4. updateVideoById Controller ----------------
const updateVideo = asyncHandler(async (req, res) => {
    // get the user id
    const { getvideoId } = req.params
    
    // get video by id and update it
    const updatedVideo = await Video.findByIdAndUpdate(
        getvideoId, 
        req.body, 
        {new: true}).exec();

    // if no video, throw an error
    if(!updatedVideo){
        throw new ApiError(404, "Video not found");
    }

    return res.status(200).json(
        new ApiResponse(200, updatedVideo, "Video updated successfully")
    );

})


// -------------------- 5. deleteVideoById Controller ----------------
const deleteVideo = asyncHandler(async (req, res) => {
    // get the user id
    const { getvideoId } = req.params

    // check user is the owner of the video
    const video = await Video.findById(getvideoId).exec();

    if(video.Owner.toString() !== req.user._id.toString()){
        throw new ApiError(401, "You are not the owner of this video");
    }

    // get video by id and delete it
    const deletedVideo = await Video.findByIdAndDelete(getvideoId).exec();

    if(!deletedVideo){
        throw new ApiError(404, "Video not found");
    }

    return res.status(200).json(
        new ApiResponse(200, deletedVideo, "Video deleted successfully")
    );
})

// -------------------- 6. togglePublishStatus Controller ----------------
const togglePublishStatus = asyncHandler(async (req, res) => {

    // get the user id
    const { getvideoId } = req.params

    console.log(getvideoId);

    // check if the video is published or not
    const video = await Video.findById(getvideoId);

    console.log(video);

    // check user is the owner of the video isPublished = !isPublished 
    const updateVideo = await Video.findByIdAndUpdate(
        getvideoId, 
        { 
            $set: 
            { 
                isPublished:!(video.isPublished) 
            } 
        }, 
        { new: true });

    // if no video, throw an error
    if(!updateVideo){
        throw new ApiError(404, "Video not found");
    }

    return res.status(200).json(
        new ApiResponse(200, video, "Video updated successfully")
    );
})

// -------------------- 7. getAllPublishedVideos Controller ----------------
const getAllPublishedVideos = asyncHandler(async (req, res) => {
    const {
        page = 1,
        limit = 10,
        query = "",
        sort = "createdAt",
        sortType = "desc"
    } = req.query;

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);

    // Build search filter
    const filter = { isPublished: true };
    if (query) {
        filter.title = { $regex: query, $options: "i" }; // Case-insensitive
    }

    // Build sorting object
    const sortOrder = sortType === "asc" ? 1 : -1;
    const sortBy = { [sort]: sortOrder };

    // Get total count for pagination info
    const totalVideos = await Video.countDocuments(filter);

    // Fetch videos with filter, sorting, and pagination
    const videos = await Video.find(filter)
        .populate("Owner", "name profilePicture")
        .sort(sortBy)
        .skip((pageNum - 1) * limitNum)
        .limit(limitNum)
        .exec();

    return res.status(200).json(
        new ApiResponse(200, {
            videos,
            pagination: {
                total: totalVideos,
                page: pageNum,
                limit: limitNum,
                totalPages: Math.ceil(totalVideos / limitNum)
            }
        }, "Videos fetched successfully")
    );
});


export {
    getAllVideoes,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus,
    getAllPublishedVideos
}
