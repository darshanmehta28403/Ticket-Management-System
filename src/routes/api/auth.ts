import express from "express";
import { register, login } from "../../controllers/authController";

export const authRouter = express.Router();

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               roleId:
 *                 type: string
 *                 description: Optional. Role UUID (Defaults to END_USER if omitted)
 *               projectId:
 *                 type: string
 *                 description: Optional. Project UUID (Defaults to FlowBit Platform if omitted)
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Bad request (missing fields or email already exists)
 *       500:
 *         description: Internal server error
 */
authRouter.post("/register", register);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: User Login
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful, returns token
 *       401:
 *         description: Unauthorized (invalid credentials)
 *       400:
 *         description: Bad request (missing email or password)
 *       500:
 *         description: Internal server error
 */
authRouter.post("/login", login);
