import express from "express";
import createUserPostController from "../controllers/user/createUserPostController.js";
import createFunctionPostController from "../controllers/user/createFunctionPostController.js";

const router = express.Router();
router.post('/signup', createUserPostController);
router.post('/function', createFunctionPostController)
export default router;
