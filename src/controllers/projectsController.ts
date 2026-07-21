import {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject
} from "../service/projectsService";

export const getAllProjects = async (req: any, res: any) => {
  return await getProjects(req, res);
};

export const getProject = async (req: any, res: any) => {
  return await getProjectById(req, res);
};

export const postProject = async (req: any, res: any) => {
  return await createProject(req, res);
};

export const patchProject = async (req: any, res: any) => {
  return await updateProject(req, res);
};

export const removeProject = async (req: any, res: any) => {
  return await deleteProject(req, res);
};
