"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.roleRouter = void 0;
const express_1 = __importDefault(require("express"));
const rolesController_1 = require("../../controllers/rolesController");
const authMiddleware_1 = require("../../middleware/authMiddleware");
const rbacMiddleware_1 = require("../../middleware/rbacMiddleware");
exports.roleRouter = express_1.default.Router();
// Apply JWT authentication to all role routes
exports.roleRouter.use(authMiddleware_1.authenticateJWT);
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
exports.roleRouter.route('/').get((0, rbacMiddleware_1.requirePermission)('read:role'), rolesController_1.getAllRoles);
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
exports.roleRouter.route('/').post((0, rbacMiddleware_1.requirePermission)('create:role'), rolesController_1.postRole);
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
exports.roleRouter.route('/:id').get((0, rbacMiddleware_1.requirePermission)('read:role'), rolesController_1.getRole);
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
exports.roleRouter.route('/:id').patch((0, rbacMiddleware_1.requirePermission)('update:role'), rolesController_1.patchRole);
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
exports.roleRouter.route('/:id').delete((0, rbacMiddleware_1.requirePermission)('delete:role'), rolesController_1.removeRole);
