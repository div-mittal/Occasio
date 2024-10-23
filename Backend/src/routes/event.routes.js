import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { Organizer } from "../models/organizer.model.js";

import { createEvent } from "../controllers/event.controller.js";


const router = Router();

router.route("/create").post(
    verifyJWT(Organizer),
    upload.fields([
        { name: "image", maxCount: 1 },
        { name: "coverImage", maxCount: 1 },
        { name: "gallery", maxCount: 10 }
    ]),
    createEvent
);

export default router;