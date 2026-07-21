import express from 'express';
import {
  removeRole,
  getAllRoles,
  getRole,
  postRole,
  patchRole
} from '../../controllers/rolesController';
import { authenticateJWT } from '../../middleware/authMiddleware';
import { requirePermission } from '../../middleware/rbacMiddleware';

export const roleRouter = express.Router();

// Apply JWT authentication to all role routes
roleRouter.use(authenticateJWT);

/**
 * @swagger
 * /roles:
 *   get:
 *     summary: Get All Roles
 *     tags:
 *       - Roles
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
 *     responses:
 *       200:
 *         description: Success
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
roleRouter.route('/').get(requirePermission('read:role'), getAllRoles);

/**
 * @swagger
 * /roles:
 *   post:
 *     summary: Create Role
 *     tags:
 *       - Roles
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *             properties:
 *               title:
 *                 type: string
 *     responses:
 *       201:
 *         description: Role created successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
roleRouter.route('/').post(requirePermission('create:role'), postRole);

/**
 * @swagger
 * /roles/{id}:
 *   get:
 *     summary: Get Role
 *     tags:
 *       - Roles
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
 *         description: Role retrieved successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Role not found
 */
roleRouter.route('/:id').get(requirePermission('read:role'), getRole);

/**
 * @swagger
 * /roles/{id}:
 *   patch:
 *     summary: Update Role
 *     tags:
 *       - Roles
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
 *               title:
 *                 type: string
 *               active:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Role updated successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Role not found
 */
roleRouter.route('/:id').patch(requirePermission('update:role'), patchRole);

/**
 * @swagger
 * /roles/{id}:
 *   delete:
 *     summary: Delete Role (soft delete)
 *     tags:
 *       - Roles
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
 *         description: Role deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Role not found
 */
roleRouter.route('/:id').delete(requirePermission('delete:role'), removeRole);