"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRouter = void 0;
const express_1 = __importDefault(require("express"));
const authController_1 = require("../../controllers/authController");
exports.authRouter = express_1.default.Router();
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
exports.authRouter.post("/register", authController_1.register);
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
exports.authRouter.post("/login", authController_1.login);
