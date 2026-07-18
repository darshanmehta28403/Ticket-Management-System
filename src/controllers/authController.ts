import { registerUser, loginUser } from "../service/authService";

export const register = async (req: any, res: any) => {
  return await registerUser(req, res);
};

export const login = async (req: any, res: any) => {
  return await loginUser(req, res);
};
