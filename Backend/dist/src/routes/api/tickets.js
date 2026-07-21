"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ticketsRouter = void 0;
const express_1 = __importDefault(require("express"));
const ticketsController_1 = require("../../controllers/ticketsController");
const authMiddleware_1 = require("../../middleware/authMiddleware");
const rbacMiddleware_1 = require("../../middleware/rbacMiddleware");
exports.ticketsRouter = express_1.default.Router();
// Apply JWT authentication to all ticket routes
exports.ticketsRouter.use(authMiddleware_1.authenticateJWT);
/**
 * @swagger
 * /tickets:
 *   get:
 *     summary: Get All Tickets
 *     tags:
 *       - Tickets
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
 *         name: status
 *         required: false
 *         schema:
 *           type: string
 *           enum: [IN_PROGRESS, NEED_INFORMATION, TO_DO, READY_FOR_UAT, READY_FOR_PROD, DEPLOYED, DONE, ON_HOLD, BACKLOG]
 *       - in: query
 *         name: priority
 *         required: false
 *         schema:
 *           type: string
 *           enum: [HIGHEST, HIGH, MEDIUM, LOW, LOWEST]
 *       - in: query
 *         name: projectId
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
 *           default: desc
 *     responses:
 *       200:
 *         description: Success
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
exports.ticketsRouter.route("/")
    .get((0, rbacMiddleware_1.requirePermission)("read:ticket"), ticketsController_1.getAllTickets)
    /**
     * @swagger
     * /tickets:
     *   post:
     *     summary: Create a Ticket
     *     tags:
     *       - Tickets
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
     *               - description
     *               - priority
     *               - status
     *               - projectId
     *               - assignedToId
     *             properties:
     *               title:
     *                 type: string
     *               description:
     *                 type: string
     *               priority:
     *                 type: string
     *                 enum: [HIGHEST, HIGH, MEDIUM, LOW, LOWEST]
     *               status:
     *                 type: string
     *                 enum: [IN_PROGRESS, NEED_INFORMATION, TO_DO, READY_FOR_UAT, READY_FOR_PROD, DEPLOYED, DONE, ON_HOLD, BACKLOG]
     *               projectId:
     *                 type: string
     *               assignedToId:
     *                 type: string
     *     responses:
     *       201:
     *         description: Ticket created successfully
     *       400:
     *         description: Bad request (missing required fields or invalid UUIDs)
     *       401:
     *         description: Unauthorized
     *       403:
     *         description: Forbidden
     */
    .post((0, rbacMiddleware_1.requirePermission)("create:ticket"), ticketsController_1.postTicket);
exports.ticketsRouter.route("/:id")
    /**
     * @swagger
     * /tickets/{id}:
     *   get:
     *     summary: Get Ticket details
     *     tags:
     *       - Tickets
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
     *         description: Ticket not found
     */
    .get((0, rbacMiddleware_1.requirePermission)("read:ticket"), ticketsController_1.getTicket)
    /**
     * @swagger
     * /tickets/{id}:
     *   patch:
     *     summary: Update Ticket details
     *     tags:
     *       - Tickets
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
     *               description:
     *                 type: string
     *               priority:
     *                 type: string
     *                 enum: [HIGHEST, HIGH, MEDIUM, LOW, LOWEST]
     *               status:
     *                 type: string
     *                 enum: [IN_PROGRESS, NEED_INFORMATION, TO_DO, READY_FOR_UAT, READY_FOR_PROD, DEPLOYED, DONE, ON_HOLD, BACKLOG]
     *               projectId:
     *                 type: string
     *               assignedToId:
     *                 type: string
     *     responses:
     *       200:
     *         description: Ticket updated successfully
     *       401:
     *         description: Unauthorized
     *       403:
     *         description: Forbidden
     *       404:
     *         description: Ticket not found
     */
    .patch((0, rbacMiddleware_1.requirePermission)("update:ticket"), ticketsController_1.patchTicket)
    /**
     * @swagger
     * /tickets/{id}:
     *   delete:
     *     summary: Delete Ticket (soft delete)
     *     tags:
     *       - Tickets
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
     *         description: Ticket deleted successfully
     *       401:
     *         description: Unauthorized
     *       403:
     *         description: Forbidden
     *       404:
     *         description: Ticket not found
     */
    .delete((0, rbacMiddleware_1.requirePermission)("delete:ticket"), ticketsController_1.removeTicket);
// --- Comments on Tickets ---
exports.ticketsRouter.route("/:id/comments")
    /**
     * @swagger
     * /tickets/{id}/comments:
     *   get:
     *     summary: Get comments for a ticket
     *     tags:
     *       - Ticket Comments
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
     *         description: Ticket not found
     */
    .get((0, rbacMiddleware_1.requirePermission)("read:comment"), ticketsController_1.getComments)
    /**
     * @swagger
     * /tickets/{id}/comments:
     *   post:
     *     summary: Create a comment on a ticket
     *     tags:
     *       - Ticket Comments
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
     *             required:
     *               - description
     *             properties:
     *               description:
     *                 type: string
     *     responses:
     *       201:
     *         description: Comment created successfully
     *       400:
     *         description: Bad request
     *       401:
     *         description: Unauthorized
     *       403:
     *         description: Forbidden
     *       404:
     *         description: Ticket not found
     */
    .post((0, rbacMiddleware_1.requirePermission)("create:comment"), ticketsController_1.postComment);
exports.ticketsRouter.route("/:id/comments/:commentId")
    .patch((0, rbacMiddleware_1.requirePermission)("update:comment"), ticketsController_1.patchComment)
    .delete((0, rbacMiddleware_1.requirePermission)("delete:comment"), ticketsController_1.removeComment);
// --- Files on Tickets ---
exports.ticketsRouter.route("/:id/files")
    /**
     * @swagger
     * /tickets/{id}/files:
     *   get:
     *     summary: Get files associated with a ticket
     *     tags:
     *       - Ticket Files
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
     *         description: Ticket not found
     */
    .get((0, rbacMiddleware_1.requirePermission)("read:file"), ticketsController_1.getFiles)
    /**
     * @swagger
     * /tickets/{id}/files:
     *   post:
     *     summary: Associate a file with a ticket
     *     tags:
     *       - Ticket Files
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
     *             required:
     *               - title
     *             properties:
     *               title:
     *                 type: string
     *     responses:
     *       201:
     *         description: File associated successfully
     *       400:
     *         description: Bad request
     *       401:
     *         description: Unauthorized
     *       403:
     *         description: Forbidden
     *       404:
     *         description: Ticket not found
     */
    .post((0, rbacMiddleware_1.requirePermission)("create:file"), ticketsController_1.postFile);
