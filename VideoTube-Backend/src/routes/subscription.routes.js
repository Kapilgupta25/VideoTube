import { Router } from "express";
import { getSubscribedChannels, toggleSubscription, getUserChannelSubscribers} from "../controllers/subscription.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router()
router.use(verifyJWT);  // apply JWT verification middleware to all routes


router
    .route('/ch/:channelId')
    .get(getUserChannelSubscribers)    // Get the list of subscribers for a channel(my subscribers)
    .post(toggleSubscription);    // Subscribe or unsubscribe to a channel

// Get the list of channels subscribed by the user(my subscriptions)
router.route("/u/:subscriberId").get(getSubscribedChannels);

export default router;
