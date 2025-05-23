import { Router } from 'express';
import { verifyJWT } from '../middlewares/auth.middleware.js';
import { toogleVideoLike, toogleCommentLike, toogleTweetLike, getLikedVideos } from '../controllers/likes.controller.js';
import { upload } from '../middlewares/multer.middleware.js';

const router = Router();
router.use(verifyJWT);  // apply JWT verification middleware to all routes

router
    .route('/video/:videoId')
    .post(upload.fields([{ name: 'videoFile', maxCount: 1 }]), toogleVideoLike); // Like or unlike a video

router
    .route('/comment/:commentId')
    .post(toogleCommentLike); // Like or unlike a comment

router
    .route('/tweet/:tweetId')
    .post(toogleTweetLike); // Like or unlike a tweet

router
    .route('/u/:userId')
    .get(getLikedVideos); // Get the list of liked videos of the user

export default router;

