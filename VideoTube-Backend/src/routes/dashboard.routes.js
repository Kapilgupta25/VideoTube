import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { getChannelStatus, getChannelVideos } from "../controllers/dashboard.controller.js";

const router = Router();
router.use(verifyJWT); // Apply JWT verification middleware to all routes

router
    .route("/Channel/status")
    .get(getChannelStatus); // Get channel stats

router
    .route("/channel/videos")
    .get(getChannelVideos); // Get all videos uploaded by the channel

export default router;
