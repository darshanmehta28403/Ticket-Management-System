import users from '../../model/users.json';
import { getUsers, getUserById, createUser, updateUser, deleteUser } from '../service/userService';

const data: any = {};
data.employees = users;

export let getAllUsers = async(req: any, res: any) => {
  return await getUsers(req,res);
}

export let getUser = async(req: any, res: any) => {
  return await getUserById(req, res);
}

export let postUser = async(req: any, res: any) => {
  return await createUser(req, res);
}

export let patchUser = async(req: any, res: any) => {
  return await updateUser(req, res);
}

export let removeUser = async(req: any, res: any) => {
  return await deleteUser(req, res);
}