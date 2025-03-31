import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiErrors.js"
import jwt from 'jsonwebtoken'
import { User } from "../models/user.models.js"





// for verifying the access token for loggedOut users and loggedIn users 
export const verifyJWT = asyncHandler( async (req, _, next) => {
    try {
        // 1. get the token from the request object - cookies or headers
        const token = req.cookies?.accessToken || req.headers("Authorization")?.replace('Bearer ', '');

        // 2. if no token, throw an error - Unauthorized request
        if(!token){
            throw new ApiError(401, 'Unauthorized request');
        }

        // 3. verify the token using the jwt.verify method
        const decodedTokenInfo = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

        // 4. find the user in the database using the _id from the decoded token
        const user = await User.findById(decodedTokenInfo?._id).select('-password -refreshToken');

        if(!user){
            throw new ApiError(404, 'Inavlid Access Token');
        }

        // 5. set the user object on the request object and call the next process
        req.user = user;
        next();
    } catch (error) {
        throw new ApiError(401, error?.message || 'Invalid Access Token');
    }
    
})