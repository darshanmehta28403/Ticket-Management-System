import express from 'express';
import users from '../../../model/users.json';
import { removeUser, getAllUsers, getUser, postUser, patchUser } from '../../controllers/usersController';

export const userRouter = express.Router();

const data: any = {};
data.employees = users;

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get All Users
 *     tags:
 *       - Users
 *     parameters:
 *       - in: query
 *         name: skip
 *         required: true
 *         schema:
 *           type: integer
 *           default: 0
 *
 *       - in: query
 *         name: limit
 *         required: true
 *         schema:
 *           type: integer
 *           default: 10
 *
 *       - in: query
 *         name: searchString
 *         required: false
 *         schema:
 *           type: string
 *
 *     responses:
 *       200:
 *         description: Success
 */
userRouter.route('/').get(getAllUsers)

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Create user
 *     tags:
 *       - Users
 * 
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               roleId:
 *                 type: string
 *               projectId:
 *                 type: string
 *     responses:
 *       201:
 *         description: User created successfully
 */
userRouter.route('/').post(postUser)

/**
 * @swagger
 * /users/:id:
 *   get:
 *     summary: get user
 *     tags:
 *       - Users
 *     responses:
 *       201:
 *         description: User retrieved successfully
 */
userRouter.route('/:id').get(getUser)

/**
 * @swagger
 * /users/:id:
 *   patch:
 *     summary: Update user
 *     tags:
 *       - Users
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               roleId:
 *                 type: string
 *               projectId:
 *                 type: string
 *     responses:
 *       201:
 *         description: User updated successfully
 */
userRouter.route('/:id').patch(patchUser)

/**
 * @swagger
 * /users/:id:
 *   delete:
 *     summary: Delete user
 *     tags:
 *       - Users
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               active:
 *                 type: boolean
 *                 default: true
 *     responses:
 *       201:
 *         description: User deleted successfully
 */
userRouter.route('/:id').delete(removeUser)