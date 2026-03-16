import { Router } from "express";
import authControllers from "../controllers/auth.controller.js";
import { validate } from "../middleware/validate.js";
import { UserLoginSchema, UserSignUpSchema } from "../schemas/index.js";
const router = Router();

router.post("/login", validate(UserLoginSchema), authControllers.login);
router.post("/signup", validate(UserSignUpSchema), authControllers.signup);

export default router;
