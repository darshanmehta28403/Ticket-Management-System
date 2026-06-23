import { prisma } from "../../model/prisma";
import bcrypt from 'bcrypt';

let db = prisma;

export const getUsers = async (req: any, res: any) => {
  let skip = Number(req.params.skip) || 0;
  let limit = Number(req.params.limit) || 10;
  let searchString = req.params.searchString || '';
  let sortBy = req.params.sortBy || 'createdAt';
  let sortOrder = req.params.sortOrder || 'asc';
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
      },
      {
        role: {
          contains: searchString,
          mode: 'insensitive'
        }
      }
    ]
  }
  where.AND = [{
    active: true
  }]
  return await db.user.findMany({
    where,
    orderBy:{
      [sortBy]: sortOrder
    },
    skip: skip,
    take: limit
  });
}

export const getUserById = async (req: any, res: any) => {
  let id = req.params.id;
  return await db.user.findUnique({
    where: { id },
  });
}

export const createUser = async (req: any, res: any) => {
  let user = req.body;
  let hashedPass = await bcrypt.hash(user.password, 10);
  let newUser = Object.assign({}, user);
  newUser.password = hashedPass;
  newUser.originalPassword = user.password;
  return await db.user.create({data: newUser});
}

export const updateUser = async (req: any, res: any) => {
  let id = req.params.id;
  let user: any = await db.user.findUnique({
    where: { id }
  });
  if (!user) {
    user = Object.fromEntries(
      Object.entries(req.body).filter(
        ([_, value]) =>
          value !== undefined &&
          value !== null &&
          value !== ''
      )
    );
  }
  else{
    throw new Error('User Not Found');
  }
  return await db.user.update({
    where: { id }, data: user
  });
}

export const deleteUser = async (req: any, res: any) => {
  let id = req.params.id;
  return await db.user.update({
    where: { id }, data: {active: false}
  });
}