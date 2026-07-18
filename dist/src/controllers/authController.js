"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.register = void 0;
const authService_1 = require("../service/authService");
const register = async (req, res) => {
    return await (0, authService_1.registerUser)(req, res);
};
exports.register = register;
const login = async (req, res) => {
    return await (0, authService_1.loginUser)(req, res);
};
exports.login = login;
