import { prisma } from "../../model/prisma";

export const getProjects = async (req: any, res: any) => {
  try {
    const skip = Number(req.query.skip) || 0;
    const limit = Number(req.query.limit) || 10;
    const searchString = req.query.searchString || '';
    const sortBy = req.query.sortBy || 'createdAt';
    const sortOrder = req.query.sortOrder || 'asc';
    
    let where: any = {};
    if (searchString) {
      where.OR = [
        {
          name: {
            contains: searchString,
            mode: 'insensitive'
          }
        },
        {
          description: {
            contains: searchString,
            mode: 'insensitive'
          }
        }
      ];
    }
    
    where.AND = [{ active: true }];

    const projects = await prisma.project.findMany({
      where,
      orderBy: {
        [sortBy]: sortOrder
      },
      skip,
      take: limit
    });

    const totalCount = await prisma.project.count({ where });

    return res.status(200).json({ projects, totalCount, skip, limit });
  } catch (error: any) {
    return res.status(500).json({ message: error.message || "Failed to fetch projects." });
  }
};

export const getProjectById = async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const project = await prisma.project.findUnique({
      where: { id }
    });

    if (!project) {
      return res.status(404).json({ message: "Project not found." });
    }

    return res.status(200).json(project);
  } catch (error: any) {
    return res.status(500).json({ message: error.message || "Failed to fetch project details." });
  }
};

export const createProject = async (req: any, res: any) => {
  try {
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Project name is required." });
    }

    const newProject = await prisma.project.create({
      data: {
        name,
        description: description || '',
        active: true
      }
    });

    return res.status(201).json(newProject);
  } catch (error: any) {
    return res.status(500).json({ message: error.message || "Failed to create project." });
  }
};

export const updateProject = async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const projectExists = await prisma.project.findUnique({
      where: { id }
    });

    if (!projectExists) {
      return res.status(404).json({ message: "Project not found." });
    }

    const updateData = Object.fromEntries(
      Object.entries(req.body).filter(
        ([_, value]) => value !== undefined && value !== null && value !== ''
      )
    );

    const updatedProject = await prisma.project.update({
      where: { id },
      data: updateData
    });

    return res.status(200).json(updatedProject);
  } catch (error: any) {
    return res.status(500).json({ message: error.message || "Failed to update project." });
  }
};

export const deleteProject = async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const projectExists = await prisma.project.findUnique({
      where: { id }
    });

    if (!projectExists) {
      return res.status(404).json({ message: "Project not found." });
    }

    const deletedProject = await prisma.project.update({
      where: { id },
      data: { active: false }
    });

    return res.status(200).json({ message: "Project deleted successfully.", project: deletedProject });
  } catch (error: any) {
    return res.status(500).json({ message: error.message || "Failed to delete project." });
  }
};
