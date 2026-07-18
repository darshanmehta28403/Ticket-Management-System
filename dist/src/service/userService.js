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
    let skip = Number(req.query.skip) || 0;
    let limit = Number(req.query.limit) || 10;
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
        include: {
            role: true,
            project: true
        }
    });
    const totalCount = await db.user.count({ where });
    return { users, totalCount, skip, limit };
};
exports.getUsers = getUsers;
const getUserById = async (req, res) => {
    let id = req.params.id;
    return await db.user.findUnique({
        where: { id },
        include: {
            role: true,
            project: true
        }
    });
};
exports.getUserById = getUserById;
const createUser = async (req, res) => {
    let user = req.body;
    let hashedPassword = await bcrypt_1.default.hash(user.password, 10);
    // Exclude roleId and projectId from direct copy if we want to build schema safely
    const newUser = {
        name: user.name,
        email: user.email,
        password: hashedPassword,
        originalPassword: user.password,
        roleId: user.roleId,
        projectId: user.projectId,
        active: true
    };
    return await db.user.create({
        data: newUser,
        include: {
            role: true,
            project: true
        }
    });
};
exports.createUser = createUser;
const updateUser = async (req, res) => {
    let id = req.params.id;
    let userExists = await db.user.findUnique({
        where: { id }
    });
    if (!userExists) {
        throw new Error('User Not Found');
    }
    const updateData = Object.fromEntries(Object.entries(req.body).filter(([_, value]) => value !== undefined &&
        value !== null &&
        value !== ''));
    return await db.user.update({
        where: { id },
        data: updateData,
        include: {
            role: true,
            project: true
        }
    });
};
exports.updateUser = updateUser;
const deleteUser = async (req, res) => {
    let id = req.params.id;
    return await db.user.update({
        where: { id },
        data: { active: false }
    });
};
exports.deleteUser = deleteUser;
