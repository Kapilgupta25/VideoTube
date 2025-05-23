import { registerUser, loginUser, logoutUser, refreshAccessToken, changeCurrentPassword, getCurrentUser, updateAccountDetails, updateUserAvatar, updateUserCoverImage, getUserChannelProfile, getWatchHistory } from "../controllers/user.controller.js";
import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router()

// http://localhost:8000/api/v1/user/register 
router.route('/register').post(
    // middleware to upload the file to the server before calling the registerUser function
    upload.fields([
        {
            name: 'avatar',
            maxCount: 1
        },
        {
            name: 'coverImage',
            maxCount: 1
        }
    ]),
    registerUser
)

router.route('/loginUser').post(loginUser)

// secure route - only logged in users can access this route 
router.route('/logoutUser').post( verifyJWT, logoutUser)
router.route('/refresh-Token').post(refreshAccessToken)
router.route('/change-password').post(verifyJWT, changeCurrentPassword)

// using get as we only have to get the details of the user who is logged in 
router.route('/current-user').get(verifyJWT, getCurrentUser)

// using patch as we only have to update the details of the user who is logged in and if we use post here then it will create a new user
router.route('/update-accountDetails').patch(verifyJWT, updateAccountDetails)

// here we are using two middleware as first we check if the user is logged in or not and then we upload the file to the server using multer middleware and then we call the updateUserAvatar function 
router.route('/update-avatar').patch(verifyJWT, upload.single("avatar"), updateUserAvatar)
router.route('/update-coverImage').patch(verifyJWT, upload.single("coverImage"), updateUserCoverImage)

// get the channel profile of the user and we are taking inpust using params so we use (/c/:username)
router.route('/channel/:username').get(verifyJWT, getUserChannelProfile)
router.route('/watchHistory').get(verifyJWT, getWatchHistory)

export default router;
