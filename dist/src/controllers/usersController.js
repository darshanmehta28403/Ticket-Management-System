"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeUser = exports.patchUser = exports.postUser = exports.getUser = exports.getAllUsers = void 0;
const userService_1 = require("../service/userService");
let getAllUsers = async (req, res) => {
    try {
        const data = await (0, userService_1.getUsers)(req, res);
        return res.status(200).json(data);
    }
    catch (error) {
        return res.status(500).json({ message: error.message || "Failed to fetch users." });
    }
};
exports.getAllUsers = getAllUsers;
let getUser = async (req, res) => {
    try {
        const data = await (0, userService_1.getUserById)(req, res);
        if (!data) {
            return res.status(404).json({ message: "User not found." });
        }
        return res.status(200).json(data);
    }
    catch (error) {
        return res.status(500).json({ message: error.message || "Failed to fetch user." });
    }
};
exports.getUser = getUser;
let postUser = async (req, res) => {
    try {
        const data = await (0, userService_1.createUser)(req, res);
        return res.status(201).json(data);
    }
    catch (error) {
        const status = error.message?.includes('required') || error.message?.includes('already exists') ? 400 : 500;
        return res.status(status).json({ message: error.message || "Failed to create user." });
    }
};
exports.postUser = postUser;
let patchUser = async (req, res) => {
    try {
        const data = await (0, userService_1.updateUser)(req, res);
        return res.status(200).json(data);
    }
    catch (error) {
        const status = error.message === 'User Not Found' ? 404 : 500;
        return res.status(status).json({ message: error.message || "Failed to update user." });
    }
};
exports.patchUser = patchUser;
let removeUser = async (req, res) => {
    try {
        const data = await (0, userService_1.deleteUser)(req, res);
        return res.status(200).json({ message: "User deleted successfully.", user: data });
    }
    catch (error) {
        const status = error.message === 'User Not Found' || error.code === 'P2025' ? 404 : 500;
        return res.status(status).json({ message: error.message || "Failed to delete user." });
    }
};
exports.removeUser = removeUser;
