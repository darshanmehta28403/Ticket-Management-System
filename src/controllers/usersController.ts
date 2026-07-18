import { getUsers, getUserById, createUser, updateUser, deleteUser } from '../service/userService';

export let getAllUsers = async (req: any, res: any) => {
  try {
    const data = await getUsers(req, res);
    return res.status(200).json(data);
  } catch (error: any) {
    return res.status(500).json({ message: error.message || "Failed to fetch users." });
  }
}

export let getUser = async (req: any, res: any) => {
  try {
    const data = await getUserById(req, res);
    if (!data) {
      return res.status(404).json({ message: "User not found." });
    }
    return res.status(200).json(data);
  } catch (error: any) {
    return res.status(500).json({ message: error.message || "Failed to fetch user." });
  }
}

export let postUser = async (req: any, res: any) => {
  try {
    const data = await createUser(req, res);
    return res.status(201).json(data);
  } catch (error: any) {
    return res.status(500).json({ message: error.message || "Failed to create user." });
  }
}

export let patchUser = async (req: any, res: any) => {
  try {
    const data = await updateUser(req, res);
    return res.status(200).json(data);
  } catch (error: any) {
    const status = error.message === 'User Not Found' ? 404 : 500;
    return res.status(status).json({ message: error.message || "Failed to update user." });
  }
}

export let removeUser = async (req: any, res: any) => {
  try {
    const data = await deleteUser(req, res);
    return res.status(200).json({ message: "User deleted successfully.", user: data });
  } catch (error: any) {
    return res.status(500).json({ message: error.message || "Failed to delete user." });
  }
}