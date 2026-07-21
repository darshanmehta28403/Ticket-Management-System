"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = require("../model/prisma");
const bcrypt_1 = __importDefault(require("bcrypt"));
async function main() {
    console.log("Starting database seeding...");
    // 1. Seed Permissions
    const permissionsList = [
        // Ticket permissions
        "create:ticket",
        "read:ticket",
        "update:ticket",
        "delete:ticket",
        // Project permissions
        "create:project",
        "read:project",
        "update:project",
        "delete:project",
        // User permissions
        "create:user",
        "read:user",
        "update:user",
        "delete:user",
        // Role permissions
        "create:role",
        "read:role",
        "update:role",
        "delete:role",
        // Comment permissions
        "create:comment",
        "read:comment",
        "update:comment",
        "delete:comment",
        // File permissions
        "create:file",
        "read:file"
    ];
    const dbPermissions = [];
    for (const name of permissionsList) {
        const perm = await prisma_1.prisma.permission.upsert({
            where: { name },
            update: {},
            create: { name, active: true },
        });
        dbPermissions.push(perm);
    }
    console.log(`Seeded ${dbPermissions.length} permissions.`);
    // 2. Seed Roles
    const roles = [
        { title: "ADMIN" },
        { title: "AGENT" },
        { title: "END_USER" }
    ];
    const dbRoles = {};
    for (const r of roles) {
        let existing = await prisma_1.prisma.role.findFirst({
            where: { title: r.title }
        });
        if (!existing) {
            existing = await prisma_1.prisma.role.create({
                data: { title: r.title, active: true }
            });
        }
        dbRoles[r.title] = existing;
    }
    console.log("Seeded roles: ADMIN, AGENT, END_USER.");
    // 3. Map Permissions to Roles
    // ADMIN gets all permissions
    for (const perm of dbPermissions) {
        await prisma_1.prisma.rolePermission.upsert({
            where: {
                roleId_permissionId: {
                    roleId: dbRoles["ADMIN"].id,
                    permissionId: perm.id
                }
            },
            update: { active: true },
            create: {
                roleId: dbRoles["ADMIN"].id,
                permissionId: perm.id,
                active: true
            }
        });
    }
    // AGENT gets ticket read/update, project read, user read, comment create/read, file create/read
    const agentPermNames = [
        "read:ticket",
        "update:ticket",
        "read:project",
        "read:user",
        "create:comment",
        "read:comment",
        "update:comment",
        "delete:comment",
        "create:file",
        "read:file"
    ];
    for (const perm of dbPermissions) {
        if (agentPermNames.includes(perm.name)) {
            await prisma_1.prisma.rolePermission.upsert({
                where: {
                    roleId_permissionId: {
                        roleId: dbRoles["AGENT"].id,
                        permissionId: perm.id
                    }
                },
                update: { active: true },
                create: {
                    roleId: dbRoles["AGENT"].id,
                    permissionId: perm.id,
                    active: true
                }
            });
        }
    }
    // END_USER gets ticket create/read, project read, comment create/read, file create/read
    const endUserPermNames = [
        "create:ticket",
        "read:ticket",
        "read:project",
        "create:comment",
        "read:comment",
        "update:comment",
        "delete:comment",
        "create:file",
        "read:file"
    ];
    for (const perm of dbPermissions) {
        if (endUserPermNames.includes(perm.name)) {
            await prisma_1.prisma.rolePermission.upsert({
                where: {
                    roleId_permissionId: {
                        roleId: dbRoles["END_USER"].id,
                        permissionId: perm.id
                    }
                },
                update: { active: true },
                create: {
                    roleId: dbRoles["END_USER"].id,
                    permissionId: perm.id,
                    active: true
                }
            });
        }
    }
    console.log("Configured RolePermissions.");
    // 4. Seed a Default Project
    const defaultProject = await prisma_1.prisma.project.upsert({
        where: { id: "default-project-id" }, // We can use a deterministic ID for convenience
        update: {},
        create: {
            id: "default-project-id",
            name: "FlowBit Platform",
            description: "Main issue tracking project for FlowBit development",
            active: true,
        }
    });
    console.log("Seeded default project.");
    // 5. Seed Users
    const userSeeds = [
        {
            name: "Chandler Bing",
            email: "cb@gmail.com",
            password: "cb@1234",
            roleTitle: "ADMIN",
            projectId: defaultProject.id
        },
        {
            name: "Monica Geller",
            email: "mg@gmail.com",
            password: "mg@1234",
            roleTitle: "AGENT",
            projectId: defaultProject.id
        },
        {
            name: "Rachel Green",
            email: "rg@gmail.com",
            password: "rg@1234",
            roleTitle: "END_USER",
            projectId: defaultProject.id
        }
    ];
    for (const u of userSeeds) {
        const hashedPassword = await bcrypt_1.default.hash(u.password, 10);
        const existingUser = await prisma_1.prisma.user.findFirst({
            where: { email: u.email }
        });
        if (!existingUser) {
            await prisma_1.prisma.user.create({
                data: {
                    name: u.name,
                    email: u.email,
                    password: hashedPassword,
                    roleId: dbRoles[u.roleTitle].id,
                    projectId: u.projectId,
                    active: true
                }
            });
            console.log(`Seeded user: ${u.name} (${u.roleTitle})`);
        }
        else {
            // Ensure existing user has correct role/project setup
            await prisma_1.prisma.user.update({
                where: { id: existingUser.id },
                data: {
                    password: hashedPassword,
                    roleId: dbRoles[u.roleTitle].id,
                    projectId: u.projectId,
                }
            });
            console.log(`Updated user: ${u.name} (${u.roleTitle})`);
        }
    }
    console.log("Database seeding completed successfully!");
}
main()
    .catch((e) => {
    console.error("Error seeding database:", e);
    process.exit(1);
})
    .finally(async () => {
    await prisma_1.prisma.$disconnect();
});
