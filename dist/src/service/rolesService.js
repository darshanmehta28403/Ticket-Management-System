"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteRole = exports.updateRole = exports.createRole = exports.getRoleById = exports.getRoles = void 0;
const prisma_1 = require("../../model/prisma");
let db = prisma_1.prisma;
const getRoles = async (req, res) => {
    let skip = Number(req.query.skip) || 0;
    let limit = Number(req.query.limit) || 10;
    let searchString = req.query.searchString || '';
    let sortBy = req.query.sortBy || 'createdAt';
    let sortOrder = req.query.sortOrder || 'asc';
    let where = {};
    if (searchString) {
        where.OR = [
            {
                title: {
                    contains: searchString,
                    mode: 'insensitive'
                }
            }
        ];
    }
    where.AND = [{
            active: true
        }];
    const roles = await db.role.findMany({
        where,
        orderBy: {
            [sortBy]: sortOrder
        },
        skip: skip,
        take: limit,
        include: {
            permissions: {
                include: {
                    permission: true
                }
            }
        }
    });
    const totalCount = await db.role.count({ where });
    return { roles, totalCount, skip, limit };
};
exports.getRoles = getRoles;
const getRoleById = async (req, res) => {
    let id = req.params.id;
    return await db.role.findFirst({
        where: { id, active: true },
        include: {
            permissions: {
                include: {
                    permission: true
                }
            }
        }
    });
};
exports.getRoleById = getRoleById;
const createRole = async (req, res) => {
    let role = req.body;
    if (!role.title || typeof role.title !== 'string') {
        throw new Error('Role title is required');
    }
    return await db.role.create({
        data: {
            title: role.title,
            active: true
        }
    });
};
exports.createRole = createRole;
const updateRole = async (req, res) => {
    let id = req.params.id;
    let roleExists = await db.role.findUnique({
        where: { id }
    });
    if (!roleExists) {
        throw new Error('Role Not Found');
    }
    const updateData = Object.fromEntries(Object.entries(req.body).filter(([_, value]) => value !== undefined &&
        value !== null &&
        value !== ''));
    return await db.role.update({
        where: { id },
        data: updateData
    });
};
exports.updateRole = updateRole;
const deleteRole = async (req, res) => {
    let id = req.params.id;
    const role = await db.role.findUnique({ where: { id } });
    if (!role || !role.active) {
        throw new Error('Role Not Found');
    }
    return await db.role.update({
        where: { id },
        data: { active: false }
    });
};
exports.deleteRole = deleteRole;
