"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeRole = exports.patchRole = exports.postRole = exports.getRole = exports.getAllRoles = void 0;
const rolesService_1 = require("../service/rolesService");
let getAllRoles = async (req, res) => {
    try {
        const data = await (0, rolesService_1.getRoles)(req, res);
        return res.status(200).json(data);
    }
    catch (error) {
        return res.status(500).json({ message: error.message || "Failed to fetch roles." });
    }
};
exports.getAllRoles = getAllRoles;
let getRole = async (req, res) => {
    try {
        const data = await (0, rolesService_1.getRoleById)(req, res);
        if (!data) {
            return res.status(404).json({ message: "Role not found." });
        }
        return res.status(200).json(data);
    }
    catch (error) {
        return res.status(500).json({ message: error.message || "Failed to fetch role." });
    }
};
exports.getRole = getRole;
let postRole = async (req, res) => {
    try {
        const data = await (0, rolesService_1.createRole)(req, res);
        return res.status(201).json(data);
    }
    catch (error) {
        return res.status(500).json({ message: error.message || "Failed to create role." });
    }
};
exports.postRole = postRole;
let patchRole = async (req, res) => {
    try {
        const data = await (0, rolesService_1.updateRole)(req, res);
        return res.status(200).json(data);
    }
    catch (error) {
        const status = error.message === 'Role Not Found' ? 404 : 500;
        return res.status(status).json({ message: error.message || "Failed to update role." });
    }
};
exports.patchRole = patchRole;
let removeRole = async (req, res) => {
    try {
        const data = await (0, rolesService_1.deleteRole)(req, res);
        return res.status(200).json({ message: "Role deleted successfully.", role: data });
    }
    catch (error) {
        return res.status(500).json({ message: error.message || "Failed to delete role." });
    }
};
exports.removeRole = removeRole;
