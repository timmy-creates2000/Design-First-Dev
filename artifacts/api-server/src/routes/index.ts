import { Router, type IRouter } from "express";
import healthRouter from "./health";
import authRouter from "./auth";
import profileRouter from "./profile";
import careersRouter from "./careers";
import roadmapRouter from "./roadmap";
import chatRouter from "./chat";
import progressRouter from "./progress";
import resourcesRouter from "./resources";

const router: IRouter = Router();

router.use(healthRouter);
router.use(authRouter);
router.use(profileRouter);
router.use(careersRouter);
router.use(roadmapRouter);
router.use(chatRouter);
router.use(progressRouter);
router.use(resourcesRouter);

export default router;
