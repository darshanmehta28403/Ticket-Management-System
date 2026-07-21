"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeProject = exports.patchProject = exports.postProject = exports.getProject = exports.getAllProjects = void 0;
const projectsService_1 = require("../service/projectsService");
const getAllProjects = async (req, res) => {
    return await (0, projectsService_1.getProjects)(req, res);
};
exports.getAllProjects = getAllProjects;
const getProject = async (req, res) => {
    return await (0, projectsService_1.getProjectById)(req, res);
};
exports.getProject = getProject;
const postProject = async (req, res) => {
    return await (0, projectsService_1.createProject)(req, res);
};
exports.postProject = postProject;
const patchProject = async (req, res) => {
    return await (0, projectsService_1.updateProject)(req, res);
};
exports.patchProject = patchProject;
const removeProject = async (req, res) => {
    return await (0, projectsService_1.deleteProject)(req, res);
};
exports.removeProject = removeProject;
