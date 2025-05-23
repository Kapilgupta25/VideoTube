import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware";
import { createPlaylist, getUserPlaylist, getPlaylistById, removeVideoFromPlaylist, addVideoToPlaylist, deletePlaylist, updatePlaylist } from "../controllers/playlist.controller";
import { upload } from "../middlewares/multer.middleware";

const router = Router();
router.use(verifyJWT);  // apply JWT verification middleware to all routes

router
    .route('/')
    .post(  // Create a new playlist with media upload
        upload.fields([{ name: "thumbnail", maxCount: 1 }]),
        createPlaylist
    )  
    .route('/u/:userId').get(getUserPlaylist); // Get the list of playlists of the user

router
    .route('/:playlistId')
    .get(getPlaylistById)   // Get a playlist by id
    .put(upload.fields([{ name: "thumbnail", maxCount: 1 }]),
        updatePlaylist)   // Update a playlist
    .delete(deletePlaylist); // Delete a playlist

router
    .route('/add-video/:playlistId')
    .post(upload.fields([{ name: "videoFile", maxCount: 1 }]),  
        addVideoToPlaylist); // Add a video to a playlist

router
    .route('/remove-video/:playlistId')
    .delete(removeVideoFromPlaylist); // Remove a video from a playlist

export default router;