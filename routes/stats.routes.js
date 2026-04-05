import { Router } from "express";
import statsController from "../controllers/stats.controller.js";
import { authenticate, authorize, requireToken } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { SetSpendingLimitSchema } from "../schemas/index.js";

const router = Router();

router.use(requireToken, authenticate, authorize(["user"]));

router.get("/stats", statsController.getUserStats);
router.patch("/spending-limit", validate(SetSpendingLimitSchema), statsController.setSpendingLimit);

export default router;
