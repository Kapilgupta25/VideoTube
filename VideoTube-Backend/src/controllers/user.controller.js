import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiErrors.js';
import { User } from '../models/user.models.js';
import { uploadOnCloudinary } from '../utils/cloudinary.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { deleteOldImage } from '../utils/DeleteOldImage.js';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';


// ------------- 1. registerUser controller ------------------
const registerUser = asyncHandler( async (req, res) => {

    // 1. get user data from frontend through req.body
    const { fullName, email, username, password } = req.body;
    console.log('fullName: ', fullName);
    console.log('email: ', email);
    console.log('username: ', username);
    console.log('password', password);
    // console log the request object to see the files object in the request object
    // console.log(req.body);

    // 2. validation of user data - Not Empty

    if( 
        [fullName, email, username, password].some( (field) => 
        field?.trim() === "" ) ){
        throw new ApiError(400, 'Please fill all the required fields');
    }

        // if(!fullName || !email || !username || !password){
        //     throw new ApiError(400, 'Please fill all the required fields');
        // }

    // 3. check if user already exists in the database: email, username

    const userExtisted = await User.findOne({ 
        $or: [{ email }, { username }] 
    });

    if(userExtisted){
        throw new ApiError(409, 'User with this email or username already exists');
    }

    // 4. check for images and avatar and coverImage in the request object and get the local path of the images from the request object

    const avatarLocalPath = req.files?.avatar[0]?.path;
    // const coverImageLocalPath = req.files?.coverImage[0]?.path;

    let coverImageLocalPath;
    if(req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0){
        coverImageLocalPath = req.files.coverImage[0].path;
    }

    // console.log(req.files);

    if(!avatarLocalPath){
        throw new ApiError(400 , "Avatar is required");
    }

    // 5. upload them to cloudinay

    const avatar = await uploadOnCloudinary(avatarLocalPath);
    const coverImage = await uploadOnCloudinary(coverImageLocalPath);

    if(!avatar){
        throw new ApiError(500, "Failed to upload avatar image");
    }

    // 6. create the object of the user in the database

    const newUser = await User.create({
        fullName,
        email,
        username: username.toLowerCase(),
        password,
        avatar: avatar.url,
        coverImage: coverImage?.url || ""
    });

    // 7. check the user created successfully or not and remove the password and refreshToken from the response object to send to the frontend 

    const createdUserSuccessfully = await User.findById(newUser._id).select(
        '-password -refreshToken'
    );

    if(!createdUserSuccessfully){
        throw new ApiError(500, 'Failed to create the user');
    }

    // 8. send the response to the frontend

    // console.log(res)

    return res.status(201).json(
        new ApiResponse(201, createdUserSuccessfully, 'User registered successfully')
    );

})


// -------------- 2. loginUser controller --------------------

    // sub method to generate the access and refresh token for the user after successful login 
const generateAccessAndRefreshToken = async (userId) => {
    try{
        const user = await User.findById(userId);
        const accessToken = await user.generateAccessToken();
        const refreshToken = await user.generateRefreshToken();

        console.log('accessToken: ', accessToken);
        console.log('refreshToken: ', refreshToken);

        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });

        return { accessToken, refreshToken };

    } catch (error){
        throw new ApiError(500, 'Something went wrong while generating Access or Refresh tokens');
    }
}


    // loginUser function to login the user and generate the access and refresh token for the user
const loginUser = asyncHandler( async (req, res) => {
    
    // 1. get user data from frontend through req.body
    const { username, email, password } = req.body;
    console.log('email: ', email);
    console.log('password', password);

    // 2. check if username or email is provided or not 
    if( !(username || email)){
        throw new ApiError(400, 'Email or username is required');
    }

    // 4. find the user in the database using the email or username
    const user = await User.findOne({
        $or: [ { email }, { username } ]
    })

    if(!user){
        throw new ApiError(404, 'User not found');
    }

    // 5. check if the password is correct or not
    const isPasswordValid = await user.verifyPassword(password);

    if(!isPasswordValid){
        throw new ApiError(401, 'Invalid password');
    }

    // 6. generate the access and refresh token for the user and send it to the frontend after destructuring the access and refresh token from the response object
    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id);

    // {create a new object of the user without the password and refreshToken to send to the frontend as our erlier object of user dose not have the access token and refresh token in it } or { we can update the user object in the database with the new access token and refresh token and send the user object to the frontend without the password and refreshToken}
    const loggedInUser = await User.findById(user._id).
    select('-password -refreshToken');

    // now the cookies are only modified by the server and not by the frontend 
    const options = {
        httpOnly: true,
        secure: true
    }

    return res
    .status(200)
    .cookie('accessToken', accessToken, options)
    .cookie('refreshToken', refreshToken, options)
    .json(
        new ApiResponse(200,
            {
                user, loggedInUser, accessToken, refreshToken
            },
            'User logged in successfully')
    );
    
})


// ----------------- 3. logoutUser controller ------------------------

const logoutUser = asyncHandler( async (req, res) => {

    console.log("I am presfvghscuh");

    await User.findByIdAndUpdate(
        req.user._id, 
        { 
            $unset: {
                refreshToken: 1      // it will unset the refreshToken field from the user object in the database or we can use $set and then refreshToken: null to set the refreshToken field to null
            }
        },
        {
            new: true
        }
    )

    // now the cookies are only modified by the server and not by the frontend 
    const options = {
        httpOnly: true,
        secure: true
    }

    return res
    .status(200)
    .clearCookie('accessToken', options)
    .clearCookie('refreshToken', options)
    .json(
        new ApiResponse(200, {}, 'User logged out successfully')
    );
})


// -------------- 4. refreshAccessToken controller ----------------------
const refreshAccessToken = asyncHandler( async (req, res) => {

    // 1. get the refresh token from the request object - cookies or body
    const incomingRefreshToken = req.cookies?.refreshToken || req.body?.refreshToken;

    if(!incomingRefreshToken){
        throw new ApiError(401, 'Unauthorized request');
    }

    try {
        // 2. verify the refresh token
        const decodedTokenInfo = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET);

        // 3. find the user in the database using the _id from the decoded token
        const user = await User.findById(decodedTokenInfo?._id);

        if(!user){
            throw new ApiError(401, 'Inavlid Refresh Token');
        }

        // 4. check if the refreshToken is valid or not
        if(incomingRefreshToken !== user?.refreshToken){
            throw new ApiError(401, 'Refresh Token is expired or used');
        }

        // 5. generate the new access and refresh token for the user
        const options = {
            httpOnly: true,
            secure: true
        }

        const { accessToken, newRefreshToken } =await generateAccessAndRefreshToken(user._id);

        return res
        .status(200)
        .cookie('accessToken', accessToken, options)
        .cookie('refreshToken', newRefreshToken, options)
        .json(
            new ApiResponse(200, { accessToken, newRefreshToken }, 'Access Token refreshed successfully')
        );
    } catch (error) {
        throw new ApiError(401, error?.message || 'Invalid Refresh Token');
    }

})


// -------------- 5. changeCurrentPassword controller --------------------
const changeCurrentPassword = asyncHandler( async (req, res) => {
    // 1. get the current password and new password from the request object
    const { oldPassword, newPassword } = req.body;

    // 2. get the user from the database using the _id from the request object
    const user = await User.findById(req.user?._id);

    // 3. check if the old password is correct or not
    const isPasswordValid = await user.verifyPassword(oldPassword);
    if(!isPasswordValid){
        throw new ApiError(401, 'Invalid old password');
    }

    // 4. update the password of the user in the database
    user.password = newPassword;
    await user.save({ validateBeforeSave: false });

    return res.status(200).json(
        new ApiResponse(200, {}, 'Password changed successfully')
    );

})


// ---------------- 6. getCurrentUser controller -------------------------
const getCurrentUser = asyncHandler( async (req, res) => {
    return res.status(200).json(
        new ApiResponse(200, req.user, 'User found successfully')
    );
});


// ---------------- 7. updateAccountDetails controller -------------------------
const updateAccountDetails = asyncHandler( async(req, res) => {
    // 1. get the user data from the request object
    const { fullName, email } = req.body;

    // 2. check if the required fields are not empty
    if( !(fullName || email) ){
        throw new ApiError(400, 'Please fill all the required fields');
    }

    // 3. check if the email is already taken by another user
    const existedUser = await User.findOne({ email });

    if(existedUser){
        throw new ApiError(409, 'Email is already taken by another user');
    }

    // 4. update the user in the database
    const user = await User.findByIdAndUpdate( req.user?._id,
        {
            $set:{
                fullName,
                email
            }
        },
        {
            new: true
        }
    ).select('-password')

    // 5. check if the user is updated successfully or not
    if(!user){
        throw new ApiError(500, 'Failed to update the user');
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, user, 'User updated successfully')
    );

})


// ---------------- 8. updateUserAvatar controller -------------------------
const updateUserAvatar = asyncHandler( async(req, res) => {

    // 1. check if the avatar is provided in the request object
    const avatarLocalPath = req.file?.path;

    if(!avatarLocalPath){
        throw new ApiError(400, "Avatar file is missing");
    }

    // 2. upload the avatar to cloudinary
    const avatar = await uploadOnCloudinary(avatarLocalPath);

    // 3. check if the avatar is uploaded successfully or not
    if(!avatar.url){
        throw new ApiError(500, "Error while uploading avatar image");
    }

    // 4. update the user in the database with the new avatar
    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                avatar: avatar.url
            }
        },
        {
            new: true
        }
    ).select('-password');

    // 5. check if the user is updated successfully or not
    if(!user){
        throw new ApiError(500, 'Failed to update the user');
    }

    // 6. Delete the previous avatar from cloudinary if the user has already an avatar
    const previousAvatarPublicId = user.avatar?.split('/').pop()?.split('.')[0];
    if(previousAvatarPublicId){
        await deleteOldImage(previousAvatarPublicId);
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, user, 'Avatar updated successfully')
    );
})


// ---------------- 9. updateUserCoverImage controller -------------------------
const updateUserCoverImage = asyncHandler( async(req, res) => {

    // 1. check if the coverImage is provided in the request object
    const coverImageLocalPath = req.file?.path;

    if(!coverImageLocalPath){
        throw new ApiError(400, "CoverImage file is missing");
    }

    // 2. upload the coverImage to cloudinary
    const coverImage = await uploadOnCloudinary(coverImageLocalPath);

    // 3. check if the coverImage is uploaded successfully or not
    if(!coverImage.url){
        throw new ApiError(500, "Error while uploading coverImage.");
    }

    // 4. update the user in the database with the new avatar
    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                coverImage: coverImage.url
            }
        },
        {
            new: true
        }
    ).select('-password');

    // 5. check if the user is updated successfully or not
    if(!user){
        throw new ApiError(500, 'Failed to update the user');
    }

    // 6. Delete the previous coverImage from cloudinary if the user has already a coverImage
    const previousCoverImagePublicId = user.coverImage?.split('/').pop()?.split('.')[0];
    if(previousCoverImagePublicId){
        await deleteOldImage(previousCoverImagePublicId);
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, user, 'coverImage updated successfully')
    );
})


// ---------------- 10. getUserChannelProfile controller -------------------------
const getUserChannelProfile = asyncHandler( async(req, res) => {
    // 1. get the username from the request object
    const { username } = req.params;

    if(!username?.trim()){
        throw new ApiError(400, 'Username is missing');
    }

    // 2. get the channel from the database using the username and count the subscribers
    const channel = await User.aggregate([
        {
            // match the user with the username and pass to next aggregation pilpeline
            $match: {
                username: username.toLowerCase()
            }
        },
        {
            // now lookup the new subscription collection to get the subscribers of the channel by selecting the channel field from the subscription collection and match it with the _id(mere channel ko sbscribe krne wala) of the user
            $lookup: {
                from: 'subscriptions',
                localField: '_id',
                foreignField: 'channel',     // count the subscribers of the channel by selecting channel as common field
                as: 'subscribers'
            }
        },
        {
            // now lookup the new subscription collection to get the subscriptions of the channel by selecting the subscriber field from the subscription collection and match it with the _id(kitne user ne mere cjannel ko sbuscribe kr rakha hai) of the user
            $lookup: {
                from: 'subscriptions',
                localField: '_id',
                foreignField: 'subscriber',   // count the subscriptions of the channel by selecting subscriber as common field
                as: 'subscribedTo'
            }
        },
        {
            // add the subscriberCount, subscribedToCount, isSubscribed fields to the channel object 
            $addFields: {
                subscriberCount: { 
                    $size: '$subscribers' 
                },
                subscribedToCount: { 
                    $size: '$subscribedTo' 
                },
                isSubscribed: {
                    $cond: {
                        if: {
                            $in: [req.user?._id, "$subscribers.subscriber"],
                            then: true,
                            else: false
                        }
                    }
                }
            }
        },
        {
            $project: {
                fullName : 1,
                username: 1,
                email: 1,
                avatar: 1,
                coverImage: 1,
                subscriberCount: 1,
                subscribedToCount: 1,
                isSubscribed: 1
            }
        }
    ]);

    console.log(channel);

    // 3. check if the channel is found or not
    if(!channel?.length){
        throw new ApiError(404, 'Channel not found');
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, channel[0], 'Channel found successfully')
    );

})


// ---------------- 11. getWatchHistory controller -------------------------
const getWatchHistory = asyncHandler( async(req, res) => {
    // 1. get the user from the request object
    const user = await User.aggregate([
        {
            // match the user with the _id (in mongoose formate) and pass to the next aggregation pipeline
            $match: {
                _id: new mongoose.Types.ObjectId(req.user._id)
            }
        },
        {
            // now lookup the videos collection to get the watchHistory of the user by selecting the watchHistory field from the user collection and match it with the _id of the videos collection
            $lookup: {
                from: 'videos',
                localField: 'watchHistory',
                foreignField: '_id',         // get the watchHistory of the user by selecting _id as common field
                as: 'watchHistory',
                pipeline: [
                    {
                        // lookup for the video owner in the users collection by selecting the Owner field from the videos collection and match it with the _id of the users collection
                        $lookup: {
                            from: 'users',
                            localField: 'owner',
                            foreignField: '_id',      // get the owner of the video by selecting _id as common field
                            as: 'owners',
                            // get only the required fields from the owners collection such as fullName, username, avatar using nested pipeline
                            pipeline: [
                                {
                                    $project: {
                                        fullName: 1,
                                        username: 1,
                                        avatar: 1
                                    }
                                }
                            ]
                        }
                    },
                    // (OPTIONAL) now add the owner field to the video object from the owners array to make it easy for the frontend to access the owner of the video directly using the ownerfield._____
                    {
                        $addFields: {
                            first: '$owners'
                        }
                    }
                ]
            }
        },
        {
            $project: {
                watchHistory: 1
            }
        }
    ])

    // 2. check if the watchHistory is found or not
    if(!user?.length){
        throw new ApiError(404, 'Watch History not found');
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, user[0]?.watchHistory, "Watch History found successfully")
    )
})


export { 
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    changeCurrentPassword,
    getCurrentUser,
    updateAccountDetails,
    updateUserAvatar,
    updateUserCoverImage,
    getUserChannelProfile,
    getWatchHistory

}

