import { prisma } from "../../Backend/model/prisma";
import type { Status, Priority } from "@prisma/client";

// --- Tickets CRUD ---

export const getTickets = async (req: any, res: any) => {
  try {
    const skip = Number(req.query.skip) || 0;
    const limit = Number(req.query.limit) || 10;
    const searchString = req.query.searchString || "";
    const status = req.query.status as Status | undefined;
    const priority = req.query.priority as Priority | undefined;
    const projectId = req.query.projectId || "";
    const sortBy = req.query.sortBy || "createdAt";
    const sortOrder = req.query.sortOrder || "desc";

    let where: any = { active: true };

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

    const tickets = await prisma.ticket.findMany({
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

    const totalCount = await prisma.ticket.count({ where });

    return res.status(200).json({ tickets, totalCount, skip, limit });
  } catch (error: any) {
    console.error("Fetch tickets error:", error);
    return res.status(500).json({ message: error.message || "Failed to fetch tickets." });
  }
};

export const getTicketById = async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const ticket = await prisma.ticket.findUnique({
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
  } catch (error: any) {
    return res.status(500).json({ message: error.message || "Failed to fetch ticket." });
  }
};

export const createTicket = async (req: any, res: any) => {
  try {
    const { title, description, priority, status, projectId, assignedToId } = req.body;
    const createdById = req.user.id;

    if (!title || !description || !priority || !status || !projectId || !assignedToId) {
      return res.status(400).json({
        message: "Title, description, priority, status, projectId, and assignedToId are required.",
      });
    }

    // Verify project exists
    const project = await prisma.project.findUnique({
      where: { id: projectId },
    });
    if (!project || !project.active) {
      return res.status(400).json({ message: "Invalid or inactive projectId." });
    }

    // Verify assignee exists
    const assignee = await prisma.user.findUnique({
      where: { id: assignedToId },
    });
    if (!assignee || !assignee.active) {
      return res.status(400).json({ message: "Invalid or inactive assignee (assignedToId)." });
    }

    // Generate ticket number sequentially
    const count = await prisma.ticket.count();
    const ticketNumber = `TICK-${1000 + count + 1}`;

    const newTicket = await prisma.ticket.create({
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
  } catch (error: any) {
    console.error("Create ticket error:", error);
    return res.status(500).json({ message: error.message || "Failed to create ticket." });
  }
};

export const updateTicket = async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const ticketExists = await prisma.ticket.findUnique({
      where: { id },
    });

    if (!ticketExists || !ticketExists.active) {
      return res.status(404).json({ message: "Ticket not found." });
    }

    // Validate foreign keys if they are being updated
    if (req.body.projectId) {
      const project = await prisma.project.findUnique({
        where: { id: req.body.projectId },
      });
      if (!project || !project.active) {
        return res.status(400).json({ message: "Invalid or inactive projectId." });
      }
    }

    if (req.body.assignedToId) {
      const assignee = await prisma.user.findUnique({
        where: { id: req.body.assignedToId },
      });
      if (!assignee || !assignee.active) {
        return res.status(400).json({ message: "Invalid or inactive assignedToId." });
      }
    }

    const updateData = Object.fromEntries(
      Object.entries(req.body).filter(
        ([_, value]) => value !== undefined && value !== null && value !== ""
      )
    );

    const updatedTicket = await prisma.ticket.update({
      where: { id },
      data: updateData,
      include: {
        creator: true,
        assignee: true,
        project: true,
      },
    });

    return res.status(200).json(updatedTicket);
  } catch (error: any) {
    return res.status(500).json({ message: error.message || "Failed to update ticket." });
  }
};

export const deleteTicket = async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const ticketExists = await prisma.ticket.findUnique({
      where: { id },
    });

    if (!ticketExists || !ticketExists.active) {
      return res.status(404).json({ message: "Ticket not found." });
    }

    const deletedTicket = await prisma.ticket.update({
      where: { id },
      data: { active: false },
    });

    return res.status(200).json({ message: "Ticket deleted successfully.", ticket: deletedTicket });
  } catch (error: any) {
    return res.status(500).json({ message: error.message || "Failed to delete ticket." });
  }
};

// --- Comments on Tickets ---

export const getTicketComments = async (req: any, res: any) => {
  try {
    const { id: ticketId } = req.params;
    
    // Verify ticket exists
    const ticketExists = await prisma.ticket.findUnique({ where: { id: ticketId } });
    if (!ticketExists || !ticketExists.active) {
      return res.status(404).json({ message: "Ticket not found." });
    }

    const comments = await prisma.comment.findMany({
      where: { ticketId, active: true },
      orderBy: { createdAt: "desc" },
    });

    return res.status(200).json(comments);
  } catch (error: any) {
    return res.status(500).json({ message: error.message || "Failed to fetch comments." });
  }
};

export const createTicketComment = async (req: any, res: any) => {
  try {
    const { id: ticketId } = req.params;
    const { description } = req.body;

    if (!description) {
      return res.status(400).json({ message: "Description is required for comments." });
    }

    // Verify ticket exists
    const ticketExists = await prisma.ticket.findUnique({ where: { id: ticketId } });
    if (!ticketExists || !ticketExists.active) {
      return res.status(404).json({ message: "Ticket not found." });
    }

    const newComment = await prisma.comment.create({
      data: {
        description,
        ticketId,
        active: true,
      },
    });

    return res.status(201).json(newComment);
  } catch (error: any) {
    return res.status(500).json({ message: error.message || "Failed to create comment." });
  }
};

// --- Files on Tickets ---

export const getTicketFiles = async (req: any, res: any) => {
  try {
    const { id: ticketId } = req.params;
    
    // Verify ticket exists
    const ticketExists = await prisma.ticket.findUnique({ where: { id: ticketId } });
    if (!ticketExists || !ticketExists.active) {
      return res.status(404).json({ message: "Ticket not found." });
    }

    const files = await prisma.file.findMany({
      where: { ticketId, active: true },
      orderBy: { createdAt: "desc" },
    });

    return res.status(200).json(files);
  } catch (error: any) {
    return res.status(500).json({ message: error.message || "Failed to fetch files." });
  }
};

export const createTicketFile = async (req: any, res: any) => {
  try {
    const { id: ticketId } = req.params;
    const { title } = req.body;

    if (!title) {
      return res.status(400).json({ message: "File title is required." });
    }

    // Verify ticket exists
    const ticketExists = await prisma.ticket.findUnique({ where: { id: ticketId } });
    if (!ticketExists || !ticketExists.active) {
      return res.status(404).json({ message: "Ticket not found." });
    }

    const newFile = await prisma.file.create({
      data: {
        title,
        ticketId,
        active: true,
      },
    });

    return res.status(201).json(newFile);
  } catch (error: any) {
    return res.status(500).json({ message: error.message || "Failed to associate file." });
  }
};
