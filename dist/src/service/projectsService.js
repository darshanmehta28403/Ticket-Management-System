"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProject = exports.updateProject = exports.createProject = exports.getProjectById = exports.getProjects = void 0;
const prisma_1 = require("../../model/prisma");
const getProjects = async (req, res) => {
    try {
        const skip = Number(req.query.skip) || 0;
        const limit = Number(req.query.limit) || 10;
        const searchString = req.query.searchString || '';
        const sortBy = req.query.sortBy || 'createdAt';
        const sortOrder = req.query.sortOrder || 'asc';
        let where = {};
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
        const projects = await prisma_1.prisma.project.findMany({
            where,
            orderBy: {
                [sortBy]: sortOrder
            },
            skip,
            take: limit
        });
        const totalCount = await prisma_1.prisma.project.count({ where });
        return res.status(200).json({ projects, totalCount, skip, limit });
    }
    catch (error) {
        return res.status(500).json({ message: error.message || "Failed to fetch projects." });
    }
};
exports.getProjects = getProjects;
const getProjectById = async (req, res) => {
    try {
        const { id } = req.params;
        const project = await prisma_1.prisma.project.findUnique({
            where: { id }
        });
        if (!project) {
            return res.status(404).json({ message: "Project not found." });
        }
        return res.status(200).json(project);
    }
    catch (error) {
        return res.status(500).json({ message: error.message || "Failed to fetch project details." });
    }
};
exports.getProjectById = getProjectById;
const createProject = async (req, res) => {
    try {
        const { name, description } = req.body;
        if (!name) {
            return res.status(400).json({ message: "Project name is required." });
        }
        const newProject = await prisma_1.prisma.project.create({
            data: {
                name,
                description: description || '',
                active: true
            }
        });
        return res.status(201).json(newProject);
    }
    catch (error) {
        return res.status(500).json({ message: error.message || "Failed to create project." });
    }
};
exports.createProject = createProject;
const updateProject = async (req, res) => {
    try {
        const { id } = req.params;
        const projectExists = await prisma_1.prisma.project.findUnique({
            where: { id }
        });
        if (!projectExists) {
            return res.status(404).json({ message: "Project not found." });
        }
        const updateData = Object.fromEntries(Object.entries(req.body).filter(([_, value]) => value !== undefined && value !== null && value !== ''));
        const updatedProject = await prisma_1.prisma.project.update({
            where: { id },
            data: updateData
        });
        return res.status(200).json(updatedProject);
    }
    catch (error) {
        return res.status(500).json({ message: error.message || "Failed to update project." });
    }
};
exports.updateProject = updateProject;
const deleteProject = async (req, res) => {
    try {
        const { id } = req.params;
        const projectExists = await prisma_1.prisma.project.findUnique({
            where: { id }
        });
        if (!projectExists) {
            return res.status(404).json({ message: "Project not found." });
        }
        const deletedProject = await prisma_1.prisma.project.update({
            where: { id },
            data: { active: false }
        });
        return res.status(200).json({ message: "Project deleted successfully.", project: deletedProject });
    }
    catch (error) {
        return res.status(500).json({ message: error.message || "Failed to delete project." });
    }
};
exports.deleteProject = deleteProject;
