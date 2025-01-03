import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { Organizer } from "../models/organizer.model.js";
import { User } from "../models/user.model.js";

import { createEvent, updateEvent, removeImagesFromGallery, addImagesToGallery, getEventInfo, verifyRSVPUsingQRCode, disableRegistrations, getAllOpenEvents, sendMailToParticipants } from "../controllers/event.controller.js";
import { registerForEvent, checkParticipant, unregisterFromEvent } from "../controllers/participant.controller.js";


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

router.route("/update/:eventid").post(
    verifyJWT(Organizer),
    updateEvent
);

router.route("/add-images/:eventid").put(
    verifyJWT(Organizer),
    upload.fields([
        { name: "galleryImages", maxCount: 10 }
    ]),
    addImagesToGallery
);

router.route("/remove-images/:eventid").delete(
    verifyJWT(Organizer),
    removeImagesFromGallery
);

router.route("/info/:eventid").get(
    getEventInfo
);

router.route("/disable/:eventid").put(
    verifyJWT(Organizer),
    disableRegistrations
);

router.route("/verify-rsvp/:eventid").post(
    verifyJWT(Organizer),
    verifyRSVPUsingQRCode
);

router.route("/send-mail/:eventid").post(
    verifyJWT(Organizer),
    sendMailToParticipants
);

router.route("/register/:eventID").post(
    verifyJWT(User),
    registerForEvent
);

router.route("/check/:eventID").get(
    verifyJWT(User),
    checkParticipant
);

router.route("/unregister/:eventID").delete(
    verifyJWT(User),
    unregisterFromEvent
);

router.route("/open").get(
    getAllOpenEvents
);

export default router;