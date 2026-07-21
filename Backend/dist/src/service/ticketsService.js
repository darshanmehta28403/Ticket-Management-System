"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTicketFile = exports.getTicketFiles = exports.deleteTicketComment = exports.updateTicketComment = exports.createTicketComment = exports.getTicketComments = exports.deleteTicket = exports.updateTicket = exports.createTicket = exports.getTicketById = exports.getTickets = void 0;
const prisma_1 = require("../../model/prisma");
// --- Tickets CRUD ---
const getTickets = async (req, res) => {
    try {
        const skip = Math.max(0, Number(req.query.skip) || 0);
        const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 10));
        const searchString = req.query.searchString || "";
        const status = req.query.status;
        const priority = req.query.priority;
        const projectId = req.query.projectId || "";
        const sortBy = ["createdAt", "updatedAt", "priority", "status", "ticketNumber"].includes(req.query.sortBy) ? req.query.sortBy : "createdAt";
        const sortOrder = req.query.sortOrder === "asc" ? "asc" : "desc";
        let where = { active: true };
        if (searchString) {
            where.OR = [
                {
                    title: {
                        contains: searchString,
                        mode: "insensitive",
                    },
                },
                {
                    description: {
                        contains: searchString,
                        mode: "insensitive",
                    },
                },
                {
                    ticketNumber: {
                        contains: searchString,
                        mode: "insensitive",
                    },
                },
            ];
        }
        if (status) {
            where.status = status;
        }
        if (priority) {
            where.priority = priority;
        }
        if (projectId) {
            where.projectId = projectId;
        }
        const tickets = await prisma_1.prisma.ticket.findMany({
            where,
            orderBy: {
                [sortBy]: sortOrder,
            },
            skip,
            take: limit,
            include: {
                creator: {
                    select: { id: true, name: true, email: true, role: { select: { title: true } } },
                },
                assignee: {
                    select: { id: true, name: true, email: true, role: { select: { title: true } } },
                },
                project: {
                    select: { id: true, name: true },
                },
            },
        });
        const totalCount = await prisma_1.prisma.ticket.count({ where });
        return res.status(200).json({ tickets, totalCount, skip, limit });
    }
    catch (error) {
        console.error("Fetch tickets error:", error);
        return res.status(500).json({ message: error.message || "Failed to fetch tickets." });
    }
};
exports.getTickets = getTickets;
const getTicketById = async (req, res) => {
    try {
        const { id } = req.params;
        const ticket = await prisma_1.prisma.ticket.findUnique({
            where: { id },
            include: {
                creator: {
                    select: { id: true, name: true, email: true },
                },
                assignee: {
                    select: { id: true, name: true, email: true },
                },
                project: {
                    select: { id: true, name: true },
                },
                comments: {
                    where: { active: true },
                    orderBy: { createdAt: "desc" },
                    include: { author: { select: { id: true, name: true, email: true } } },
                },
                files: {
                    where: { active: true },
                    orderBy: { createdAt: "desc" },
                },
            },
        });
        if (!ticket || !ticket.active) {
            return res.status(404).json({ message: "Ticket not found." });
        }
        return res.status(200).json(ticket);
    }
    catch (error) {
        return res.status(500).json({ message: error.message || "Failed to fetch ticket." });
    }
};
exports.getTicketById = getTicketById;
const createTicket = async (req, res) => {
    try {
        const { title, description, priority, status, projectId, assignedToId } = req.body;
        const createdById = req.user.id;
        if (!title || !description || !priority || !status || !projectId || !assignedToId) {
            return res.status(400).json({
                message: "Title, description, priority, status, projectId, and assignedToId are required.",
            });
        }
        // Verify project exists
        const project = await prisma_1.prisma.project.findUnique({
            where: { id: projectId },
        });
        if (!project || !project.active) {
            return res.status(400).json({ message: "Invalid or inactive projectId." });
        }
        // Verify assignee exists
        const assignee = await prisma_1.prisma.user.findUnique({
            where: { id: assignedToId },
        });
        if (!assignee || !assignee.active) {
            return res.status(400).json({ message: "Invalid or inactive assignee (assignedToId)." });
        }
        // Generate ticket number sequentially
        const count = await prisma_1.prisma.ticket.count();
        const ticketNumber = `TICK-${1000 + count + 1}`;
        const newTicket = await prisma_1.prisma.ticket.create({
            data: {
                title,
                description,
                ticketNumber,
                priority,
                status,
                projectId,
                assignedToId,
                createdById,
                active: true,
            },
            include: {
                creator: true,
                assignee: true,
                project: true,
            },
        });
        return res.status(201).json(newTicket);
    }
    catch (error) {
        console.error("Create ticket error:", error);
        return res.status(500).json({ message: error.message || "Failed to create ticket." });
    }
};
exports.createTicket = createTicket;
const updateTicket = async (req, res) => {
    try {
        const { id } = req.params;
        const ticketExists = await prisma_1.prisma.ticket.findUnique({
            where: { id },
        });
        if (!ticketExists || !ticketExists.active) {
            return res.status(404).json({ message: "Ticket not found." });
        }
        // Validate foreign keys if they are being updated
        if (req.body.projectId) {
            const project = await prisma_1.prisma.project.findUnique({
                where: { id: req.body.projectId },
            });
            if (!project || !project.active) {
                return res.status(400).json({ message: "Invalid or inactive projectId." });
            }
        }
        if (req.body.assignedToId) {
            const assignee = await prisma_1.prisma.user.findUnique({
                where: { id: req.body.assignedToId },
            });
            if (!assignee || !assignee.active) {
                return res.status(400).json({ message: "Invalid or inactive assignedToId." });
            }
        }
        const updateData = Object.fromEntries(Object.entries(req.body).filter(([_, value]) => value !== undefined && value !== null && value !== ""));
        const updatedTicket = await prisma_1.prisma.ticket.update({
            where: { id },
            data: updateData,
            include: {
                creator: true,
                assignee: true,
                project: true,
            },
        });
        return res.status(200).json(updatedTicket);
    }
    catch (error) {
        return res.status(500).json({ message: error.message || "Failed to update ticket." });
    }
};
exports.updateTicket = updateTicket;
const deleteTicket = async (req, res) => {
    try {
        const { id } = req.params;
        const ticketExists = await prisma_1.prisma.ticket.findUnique({
            where: { id },
        });
        if (!ticketExists || !ticketExists.active) {
            return res.status(404).json({ message: "Ticket not found." });
        }
        const deletedTicket = await prisma_1.prisma.ticket.update({
            where: { id },
            data: { active: false },
        });
        return res.status(200).json({ message: "Ticket deleted successfully.", ticket: deletedTicket });
    }
    catch (error) {
        return res.status(500).json({ message: error.message || "Failed to delete ticket." });
    }
};
exports.deleteTicket = deleteTicket;
// --- Comments on Tickets ---
const getTicketComments = async (req, res) => {
    try {
        const { id: ticketId } = req.params;
        // Verify ticket exists
        const ticketExists = await prisma_1.prisma.ticket.findUnique({ where: { id: ticketId } });
        if (!ticketExists || !ticketExists.active) {
            return res.status(404).json({ message: "Ticket not found." });
        }
        const comments = await prisma_1.prisma.comment.findMany({
            where: { ticketId, active: true },
            orderBy: { createdAt: "desc" },
            include: { author: { select: { id: true, name: true, email: true } } },
        });
        return res.status(200).json(comments);
    }
    catch (error) {
        return res.status(500).json({ message: error.message || "Failed to fetch comments." });
    }
};
exports.getTicketComments = getTicketComments;
const createTicketComment = async (req, res) => {
    try {
        const { id: ticketId } = req.params;
        const description = typeof req.body.description === "string" ? req.body.description.trim() : "";
        if (!description) {
            return res.status(400).json({ message: "Description is required for comments." });
        }
        // Verify ticket exists
        const ticketExists = await prisma_1.prisma.ticket.findUnique({ where: { id: ticketId } });
        if (!ticketExists || !ticketExists.active) {
            return res.status(404).json({ message: "Ticket not found." });
        }
        const newComment = await prisma_1.prisma.comment.create({
            data: {
                description,
                ticketId,
                authorId: req.user.id,
                active: true,
            },
        });
        return res.status(201).json(newComment);
    }
    catch (error) {
        return res.status(500).json({ message: error.message || "Failed to create comment." });
    }
};
exports.createTicketComment = createTicketComment;
const updateTicketComment = async (req, res) => {
    try {
        const description = typeof req.body.description === "string" ? req.body.description.trim() : "";
        if (!description)
            return res.status(400).json({ message: "Description is required for comments." });
        const comment = await prisma_1.prisma.comment.findFirst({ where: { id: req.params.commentId, ticketId: req.params.id, active: true } });
        if (!comment)
            return res.status(404).json({ message: "Comment not found." });
        if (comment.authorId !== req.user.id && req.user.role !== "ADMIN")
            return res.status(403).json({ message: "You can only edit your own comments." });
        return res.status(200).json(await prisma_1.prisma.comment.update({ where: { id: comment.id }, data: { description } }));
    }
    catch (error) {
        return res.status(500).json({ message: error.message || "Failed to update comment." });
    }
};
exports.updateTicketComment = updateTicketComment;
const deleteTicketComment = async (req, res) => {
    try {
        const comment = await prisma_1.prisma.comment.findFirst({ where: { id: req.params.commentId, ticketId: req.params.id, active: true } });
        if (!comment)
            return res.status(404).json({ message: "Comment not found." });
        if (comment.authorId !== req.user.id && req.user.role !== "ADMIN")
            return res.status(403).json({ message: "You can only delete your own comments." });
        await prisma_1.prisma.comment.update({ where: { id: comment.id }, data: { active: false } });
        return res.status(200).json({ message: "Comment deleted successfully." });
    }
    catch (error) {
        return res.status(500).json({ message: error.message || "Failed to delete comment." });
    }
};
exports.deleteTicketComment = deleteTicketComment;
// --- Files on Tickets ---
const getTicketFiles = async (req, res) => {
    try {
        const { id: ticketId } = req.params;
        // Verify ticket exists
        const ticketExists = await prisma_1.prisma.ticket.findUnique({ where: { id: ticketId } });
        if (!ticketExists || !ticketExists.active) {
            return res.status(404).json({ message: "Ticket not found." });
        }
        const files = await prisma_1.prisma.file.findMany({
            where: { ticketId, active: true },
            orderBy: { createdAt: "desc" },
        });
        return res.status(200).json(files);
    }
    catch (error) {
        return res.status(500).json({ message: error.message || "Failed to fetch files." });
    }
};
exports.getTicketFiles = getTicketFiles;
const createTicketFile = async (req, res) => {
    try {
        const { id: ticketId } = req.params;
        const { title } = req.body;
        if (!title) {
            return res.status(400).json({ message: "File title is required." });
        }
        // Verify ticket exists
        const ticketExists = await prisma_1.prisma.ticket.findUnique({ where: { id: ticketId } });
        if (!ticketExists || !ticketExists.active) {
            return res.status(404).json({ message: "Ticket not found." });
        }
        const newFile = await prisma_1.prisma.file.create({
            data: {
                title,
                ticketId,
                active: true,
            },
        });
        return res.status(201).json(newFile);
    }
    catch (error) {
        return res.status(500).json({ message: error.message || "Failed to associate file." });
    }
};
exports.createTicketFile = createTicketFile;
