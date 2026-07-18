import { prisma } from "../../model/prisma";
import bcrypt from 'bcrypt';

let db = prisma;

export const getUsers = async (req: any, res: any) => {
  let skip = Number(req.query.skip) || 0;
  let limit = Number(req.query.limit) || 10;
  let searchString = req.query.searchString || '';
  let sortBy = req.query.sortBy || 'createdAt';
  let sortOrder = req.query.sortOrder || 'asc';
  
  let where: any = {};
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
}

export const getUserById = async (req: any, res: any) => {
  let id = req.params.id;
  return await db.user.findUnique({
    where: { id },
    include: {
      role: true,
      project: true
    }
  });
}

export const createUser = async (req: any, res: any) => {
  let user = req.body;
  let hashedPassword = await bcrypt.hash(user.password, 10);
  
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
}

export const updateUser = async (req: any, res: any) => {
  let id = req.params.id;
  let userExists = await db.user.findUnique({
    where: { id }
  });
  
  if (!userExists) {
    throw new Error('User Not Found');
  }

  const updateData = Object.fromEntries(
    Object.entries(req.body).filter(
      ([_, value]) =>
        value !== undefined &&
        value !== null &&
        value !== ''
    )
  );

  return await db.user.update({
    where: { id }, 
    data: updateData,
    include: {
      role: true,
      project: true
    }
  });
}

export const deleteUser = async (req: any, res: any) => {
  let id = req.params.id;
  return await db.user.update({
    where: { id }, 
    data: { active: false }
  });
}