import express from 'express';
import{login , signup, logout, onboard} from '../controllers/auth.controllers.js';
import { protectRoute } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/login', login);

router.post('/logout', logout);

router.post('/signup', signup);

router.post('/onboarding', protectRoute, onboard)

router.get("/me" , protectRoute, (req,res) =>{
res.status(200).json({success : true, user: req.user})
} )
export default router;

