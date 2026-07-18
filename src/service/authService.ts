import { prisma } from "../../model/prisma";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "flowbit_jwt_secret_key";

export const registerUser = async (req: any, res: any) => {
  try {
    const { name, email, password, roleId, projectId } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email and password are required." });
    }

    const existingUser = await prisma.user.findFirst({
      where: { email }
    });

    if (existingUser) {
      return res.status(400).json({ message: "User with this email already exists." });
    }

    // Set default role if not provided
    let finalRoleId = roleId;
    if (!finalRoleId) {
      const defaultRole = await prisma.role.findFirst({
        where: { title: "END_USER" }
      });
      if (!defaultRole) {
        return res.status(500).json({ message: "Default role END_USER not found in DB." });
      }
      finalRoleId = defaultRole.id;
    }

    // Set default project if not provided
    let finalProjectId = projectId;
    if (!finalProjectId) {
      const defaultProject = await prisma.project.findFirst({
        where: { name: "FlowBit Platform" }
      });
      if (!defaultProject) {
        return res.status(500).json({ message: "Default project not found in DB." });
      }
      finalProjectId = defaultProject.id;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        originalPassword: password,
        roleId: finalRoleId,
        projectId: finalProjectId,
        active: true
      },
      include: {
        role: true,
        project: true
      }
    });

    // Generate JWT
    const token = jwt.sign(
      { userId: newUser.id, email: newUser.email, role: newUser.role.title },
      JWT_SECRET,
      { expiresIn: "1d" }
    );

    return res.status(201).json({
      message: "User registered successfully.",
      token,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role.title,
        project: newUser.project.name
      }
    });
  } catch (error: any) {
    console.error("Registration error:", error);
    return res.status(500).json({ message: error.message || "Internal server error." });
  }
};

export const loginUser = async (req: any, res: any) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required." });
    }

    const user = await prisma.user.findFirst({
      where: { email, active: true },
      include: {
        role: true,
        project: true
      }
    });

    if (!user) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    // Generate JWT
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role.title },
      JWT_SECRET,
      { expiresIn: "1d" }
    );

    return res.status(200).json({
      message: "Login successful.",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role.title,
        project: user.project.name
      }
    });
  } catch (error: any) {
    console.error("Login error:", error);
    return res.status(500).json({ message: error.message || "Internal server error." });
  }
};
