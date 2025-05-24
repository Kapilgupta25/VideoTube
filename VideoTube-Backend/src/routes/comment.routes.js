import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { getVideoComments, addComment, deleteComment, updateComment } from "../controllers/comment.controller.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();
router.use(verifyJWT); // Apply JWT verification middleware to all routes   

router
    .route("/:videoId")
    .get(getVideoComments) // Get comments for a video
    .post(upload.fields([{ name: "commentFile", maxCount: 1 }]), addComment); // Add a comment to a video

router
    .route("/:commentId")
    .delete(deleteComment); // Delete a comment

router
    .route("/:commentId/update")
    .put(upload.fields([{ name: "commentFile", maxCount: 1 }]), updateComment); // Update a comment 

export default router;
