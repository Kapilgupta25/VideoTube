import { Router } from "express";
import { createTweet, getUserTweets, deleteTweet, reTweet, updateTweet } from "../controllers/tweet.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router()
router.use(verifyJWT);  // apply JWT verification middleware to all routes

router
    .route('/')
    .post(  // Create a new tweet with media upload
        upload.fields([{ name: "media", maxCount: 1 }]),
        createTweet
    )   
    .get(getUserTweets); // Get the list of tweets of the user

router
    .route('/:tweetId')
    .put(upload.fields([{ name: "media", maxCount: 1 }]),
        updateTweet)   // Update a tweet
    .delete(deleteTweet); // Delete a tweet

router
    .route('/retweet/:tweetId')
    .post(upload.fields([{ name: "media", maxCount: 1 }]),
        reTweet); // ReTweet a tweet

export default router;
