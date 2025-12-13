import { Router } from "express";
import { getUsers, createUser } from "../controllers/user.controller.js";
import { authenticate, authorizeRole } from "../middleware/auth.middleware.js";

const router = Router();

router.get(
    "/",
    authenticate,
    authorizeRole(["ADMIN"]),
    getUsers
);

router.post("/", createUser);

export default router;
