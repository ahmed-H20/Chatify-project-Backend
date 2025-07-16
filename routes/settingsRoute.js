import express from 'express';
import { getPrivacySettings, savePrivacySettings } from "../controller/settingsController.js";
import { protectRoute } from "../middlewares/protectRoute.js";

const router = express.Router();

router.get("/privacy", protectRoute, getPrivacySettings);
router.post("/privacy", protectRoute, savePrivacySettings);

export default router;
