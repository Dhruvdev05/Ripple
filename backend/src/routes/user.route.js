import express from 'express';
import { protectRoute } from '../middleware/auth.middleware.js';
import { getRecomendedUsers, getMyFriends } from '../controllers/user.controller.js';
import { sendFriendRequest , acceptFriendRequest } from '../controllers/user.controller.js';
import { getFriendRequest , getOutgoingFriendReqs} from '../controllers/user.controller.js';

const router = express.Router();

router.use(protectRoute);

router.get("/" , getRecomendedUsers);
router.get("/friends" , getMyFriends);

router.post("/friend-request/:id" , sendFriendRequest);
router.put("/friend-request/:id/accept" , acceptFriendRequest);

router.get("/friend-request" , getFriendRequest)
router.get("/outgoing-friend-requests" , getOutgoingFriendReqs)

export default router;