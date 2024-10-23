import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { registerOrganizer, loginOrganizer, logoutOrganizer, refreshAccessToken, updateOrganizerPassword, getCurrentOrganizer, updateOrganizerDetails, updateProfilePicture } from "../controllers/organizer.controller.js";

const router = Router();

router.route("/register").post(
    upload.single("profilePicture"),
    registerOrganizer
);

router.route("/login").post(
    loginOrganizer
);

router.route("/logout").post(
    verifyJWT,
    logoutOrganizer
);

router.route("/refresh-token").post(
    refreshAccessToken
);

router.route("/update-password").post(
    verifyJWT,
    updateOrganizerPassword
);

router.route("/me").get(
    verifyJWT,
    getCurrentOrganizer
);

router.route("/update-details").patch(
    verifyJWT,
    updateOrganizerDetails
);

router.route("/update-profile-picture").patch(
    verifyJWT,
    upload.single("profilePicture"),
    updateProfilePicture
);

export default router;
