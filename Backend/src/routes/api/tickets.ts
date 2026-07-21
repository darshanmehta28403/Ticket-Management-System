import express from "express";
import {
  getAllTickets,
  getTicket,
  postTicket,
  patchTicket,
  removeTicket,
  getComments,
  postComment,
  patchComment,
  removeComment,
  getFiles,
  postFile
} from "../../controllers/ticketsController";
import { authenticateJWT } from "../../middleware/authMiddleware";
import { requirePermission } from "../../middleware/rbacMiddleware";

export const ticketsRouter = express.Router();

// Apply JWT authentication to all ticket routes
ticketsRouter.use(authenticateJWT);

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
ticketsRouter.route("/")
  .get(requirePermission("read:ticket"), getAllTickets)
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
  .post(requirePermission("create:ticket"), postTicket);

ticketsRouter.route("/:id")
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
  .get(requirePermission("read:ticket"), getTicket)
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
  .patch(requirePermission("update:ticket"), patchTicket)
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
  .delete(requirePermission("delete:ticket"), removeTicket);

// --- Comments on Tickets ---
ticketsRouter.route("/:id/comments")
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
  .get(requirePermission("read:comment"), getComments)
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
  .post(requirePermission("create:comment"), postComment);

ticketsRouter.route("/:id/comments/:commentId")
  .patch(requirePermission("update:comment"), patchComment)
  .delete(requirePermission("delete:comment"), removeComment);

// --- Files on Tickets ---
ticketsRouter.route("/:id/files")
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
  .get(requirePermission("read:file"), getFiles)
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
  .post(requirePermission("create:file"), postFile);
