import { Router } from "express";
import { getAllVideoes, publishAVideo, getVideoById, deleteVideo, updateVideo, togglePublishStatus } from "../controllers/video.controller.js";

const router = Router()

import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

// it will verify all routes in this file
router.use(verifyJWT)


router.route("/")
    .get(getAllVideoes)
    .post(
        upload.fields([
            {
                name: 'videoFile',
                maxCount: 1
            },
            {
                name: 'thumbnail',
                maxCount: 1
            }
        ]), publishAVideo
    );

router.route("/:getvideoId")
    .get(getVideoById)
    .delete(deleteVideo)
    .patch(upload.single("thumbnail"), updateVideo);


router.route("/toggle/publish/:getvideoId").patch(togglePublishStatus);

export default router;