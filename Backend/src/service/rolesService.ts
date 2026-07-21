import { prisma } from "../../Backend/model/prisma";

let db = prisma;

export const getRoles = async (req: any, res: any) => {
  let skip = Number(req.query.skip) || 0;
  let limit = Number(req.query.limit) || 10;
  let searchString = req.query.searchString || '';
  let sortBy = req.query.sortBy || 'createdAt';
  let sortOrder = req.query.sortOrder || 'asc';
  
  let where: any = {};
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
}

export const getRoleById = async (req: any, res: any) => {
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
}

export const createRole = async (req: any, res: any) => {
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
}

export const updateRole = async (req: any, res: any) => {
  let id = req.params.id;
  let roleExists = await db.role.findUnique({
    where: { id }
  });

  if (!roleExists) {
    throw new Error('Role Not Found');
  }

  const updateData = Object.fromEntries(
    Object.entries(req.body).filter(
      ([_, value]) =>
        value !== undefined &&
        value !== null &&
        value !== ''
    )
  );

  return await db.role.update({
    where: { id }, 
    data: updateData
  });
}

export const deleteRole = async (req: any, res: any) => {
  let id = req.params.id;
  const role = await db.role.findUnique({ where: { id } });
  if (!role || !role.active) {
    throw new Error('Role Not Found');
  }
  return await db.role.update({
    where: { id }, 
    data: { active: false }
  });
}
