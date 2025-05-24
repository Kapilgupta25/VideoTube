import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { createPlaylist, getUserPlaylist, getPlaylistById, removeVideoFromPlaylist, addVideoToPlaylist, deletePlaylist, updatePlaylist } from "../controllers/playlist.controller.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();
router.use(verifyJWT);  // apply JWT verification middleware to all routes

router
    .route('/')
    .post(  // Create a new playlist with media upload
        upload.fields([{ name: "thumbnail", maxCount: 1 }]),
        createPlaylist
    )  

router    
    .route('/u/:userId').get(getUserPlaylist); // Get the list of playlists of the user


router
    .route('/:playlistId')
    .get(getPlaylistById)   // Get a playlist by id
    .put(upload.fields([{ name: "thumbnail", maxCount: 1 }]),
        updatePlaylist)    // Update a playlist
    .delete(deletePlaylist); // Delete a playlist

router
    .route('/add-video/:playlistId/video/:videoId')
    .post(upload.fields([{ name: "videoFile", maxCount: 1 }]),  
        addVideoToPlaylist); // Add a video to a playlist

router
    .route('/remove-video/:playlistId/video/:videoId')
    .delete(removeVideoFromPlaylist); // Remove a video from a playlist

export default router;
