"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.updateUser = exports.createUser = exports.getUserById = exports.getUsers = void 0;
const prisma_1 = require("../../model/prisma");
const bcrypt_1 = __importDefault(require("bcrypt"));
let db = prisma_1.prisma;
const getUsers = async (req, res) => {
    let skip = Math.max(0, Number(req.query.skip) || 0);
    let limit = Math.min(100, Math.max(1, Number(req.query.limit) || 10));
    let searchString = req.query.searchString || '';
    let sortBy = req.query.sortBy || 'createdAt';
    let sortOrder = req.query.sortOrder || 'asc';
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
                email: {
                    contains: searchString,
                    mode: 'insensitive'
                }
            }
        ];
    }
    where.AND = [{
            active: true
        }];
    const users = await db.user.findMany({
        where,
        orderBy: {
            [sortBy]: sortOrder
        },
        skip: skip,
        take: limit,
        select: userSelect
    });
    const totalCount = await db.user.count({ where });
    return { users, totalCount, skip, limit };
};
exports.getUsers = getUsers;
const getUserById = async (req, res) => {
    let id = req.params.id;
    return await db.user.findFirst({
        where: { id, active: true },
        select: userSelect
    });
};
exports.getUserById = getUserById;
const createUser = async (req, res) => {
    let user = req.body;
    if (!user.name || !user.email || !user.password || !user.roleId || !user.projectId) {
        throw new Error('Name, email, password, roleId and projectId are required');
    }
    const existingUser = await db.user.findFirst({ where: { email: user.email } });
    if (existingUser) {
        throw new Error('A user with this email already exists');
    }
    let hashedPassword = await bcrypt_1.default.hash(user.password, 10);
    // Exclude roleId and projectId from direct copy if we want to build schema safely
    const newUser = {
        name: user.name,
        email: user.email,
        password: hashedPassword,
        roleId: user.roleId,
        projectId: user.projectId,
        active: true
    };
    return await db.user.create({
        data: newUser,
        select: userSelect
    });
};
exports.createUser = createUser;
const updateUser = async (req, res) => {
    let id = req.params.id;
    let userExists = await db.user.findUnique({
        where: { id },
    });
    if (!userExists) {
        throw new Error('User Not Found');
    }
    if (req.body.password) {
        req.body.password = await bcrypt_1.default.hash(req.body.password, 10);
    }
    const updateData = Object.fromEntries(Object.entries(req.body).filter(([_, value]) => value !== undefined &&
        value !== null &&
        value !== ''));
    return await db.user.update({
        where: { id },
        data: updateData,
        select: userSelect
    });
};
exports.updateUser = updateUser;
const deleteUser = async (req, res) => {
    let id = req.params.id;
    const user = await db.user.findFirst({ where: { id, active: true } });
    if (!user) {
        throw new Error('User Not Found');
    }
    return await db.user.update({
        where: { id },
        data: { active: false }
    });
};
exports.deleteUser = deleteUser;
const userSelect = {
    id: true,
    name: true,
    email: true,
    active: true,
    createdAt: true,
    updatedAt: true,
    role: true,
    project: true,
};
