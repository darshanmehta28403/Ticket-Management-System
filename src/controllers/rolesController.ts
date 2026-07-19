import { getRoles, getRoleById, createRole, updateRole, deleteRole } from '../service/rolesService';

export let getAllRoles = async (req: any, res: any) => {
  try {
    const data = await getRoles(req, res);
    return res.status(200).json(data);
  } catch (error: any) {
    return res.status(500).json({ message: error.message || "Failed to fetch roles." });
  }
}

export let getRole = async (req: any, res: any) => {
  try {
    const data = await getRoleById(req, res);
    if (!data) {
      return res.status(404).json({ message: "Role not found." });
    }
    return res.status(200).json(data);
  } catch (error: any) {
    return res.status(500).json({ message: error.message || "Failed to fetch role." });
  }
}

export let postRole = async (req: any, res: any) => {
  try {
    const data = await createRole(req, res);
    return res.status(201).json(data);
  } catch (error: any) {
    const status = error.message === 'Role title is required' ? 400 : 500;
    return res.status(status).json({ message: error.message || "Failed to create role." });
  }
}

export let patchRole = async (req: any, res: any) => {
  try {
    const data = await updateRole(req, res);
    return res.status(200).json(data);
  } catch (error: any) {
    const status = error.message === 'Role Not Found' ? 404 : 500;
    return res.status(status).json({ message: error.message || "Failed to update role." });
  }
}

export let removeRole = async (req: any, res: any) => {
  try {
    const data = await deleteRole(req, res);
    return res.status(200).json({ message: "Role deleted successfully.", role: data });
  } catch (error: any) {
    const status = error.message === 'Role Not Found' ? 404 : 500;
    return res.status(status).json({ message: error.message || "Failed to delete role." });
  }
}
