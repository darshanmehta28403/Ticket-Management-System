"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.projectsRouter = void 0;
const express_1 = __importDefault(require("express"));
const projectsController_1 = require("../../controllers/projectsController");
const authMiddleware_1 = require("../../middleware/authMiddleware");
const rbacMiddleware_1 = require("../../middleware/rbacMiddleware");
exports.projectsRouter = express_1.default.Router();
// Apply authentication middleware to all project endpoints
exports.projectsRouter.use(authMiddleware_1.authenticateJWT);
/**
 * @swagger
 * /projects:
 *   get:
 *     summary: Get All Projects
 *     tags:
 *       - Projects
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: skip
 *         required: false
 *         schema:
 *           type: integer
 *           default: 0
 *       - in: query
 *         name: limit
 *         required: false
 *         schema:
 *           type: integer
 *           default: 10
 *       - in: query
 *         name: searchString
 *         required: false
 *         schema:
 *           type: string
 *       - in: query
 *         name: sortBy
 *         required: false
 *         schema:
 *           type: string
 *           default: createdAt
 *       - in: query
 *         name: sortOrder
 *         required: false
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: asc
 *     responses:
 *       200:
 *         description: Success
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
exports.projectsRouter.route("/")
    .get((0, rbacMiddleware_1.requirePermission)("read:project"), projectsController_1.getAllProjects)
    /**
     * @swagger
     * /projects:
     *   post:
     *     summary: Create a Project
     *     tags:
     *       - Projects
     *     security:
     *       - bearerAuth: []
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             required:
     *               - name
     *             properties:
     *               name:
     *                 type: string
     *               description:
     *                 type: string
     *     responses:
     *       201:
     *         description: Project created successfully
     *       401:
     *         description: Unauthorized
     *       403:
     *         description: Forbidden
     */
    .post((0, rbacMiddleware_1.requirePermission)("create:project"), projectsController_1.postProject);
exports.projectsRouter.route("/:id")
    /**
     * @swagger
     * /projects/{id}:
     *   get:
     *     summary: Get Project details
     *     tags:
     *       - Projects
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: string
     *     responses:
     *       200:
     *         description: Success
     *       401:
     *         description: Unauthorized
     *       403:
     *         description: Forbidden
     *       404:
     *         description: Project not found
     */
    .get((0, rbacMiddleware_1.requirePermission)("read:project"), projectsController_1.getProject)
    /**
     * @swagger
     * /projects/{id}:
     *   patch:
     *     summary: Update Project details
     *     tags:
     *       - Projects
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: string
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               name:
     *                 type: string
     *               description:
     *                 type: string
     *     responses:
     *       200:
     *         description: Project updated successfully
     *       401:
     *         description: Unauthorized
     *       403:
     *         description: Forbidden
     *       404:
     *         description: Project not found
     */
    .patch((0, rbacMiddleware_1.requirePermission)("update:project"), projectsController_1.patchProject)
    /**
     * @swagger
     * /projects/{id}:
     *   delete:
     *     summary: Delete Project (soft delete)
     *     tags:
     *       - Projects
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: string
     *     responses:
     *       200:
     *         description: Project deleted successfully
     *       401:
     *         description: Unauthorized
     *       403:
     *         description: Forbidden
     *       404:
     *         description: Project not found
     */
    .delete((0, rbacMiddleware_1.requirePermission)("delete:project"), projectsController_1.removeProject);
