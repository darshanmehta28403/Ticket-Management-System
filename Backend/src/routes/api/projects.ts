import express from "express";
import {
  getAllProjects,
  getProject,
  postProject,
  patchProject,
  removeProject
} from "../../controllers/projectsController";
import { authenticateJWT } from "../../middleware/authMiddleware";
import { requirePermission } from "../../middleware/rbacMiddleware";

export const projectsRouter = express.Router();

// Apply authentication middleware to all project endpoints
projectsRouter.use(authenticateJWT);

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
projectsRouter.route("/")
  .get(requirePermission("read:project"), getAllProjects)
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
  .post(requirePermission("create:project"), postProject);

projectsRouter.route("/:id")
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
  .get(requirePermission("read:project"), getProject)
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
  .patch(requirePermission("update:project"), patchProject)
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
  .delete(requirePermission("delete:project"), removeProject);
