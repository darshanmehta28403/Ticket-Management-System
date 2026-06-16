import express from 'express';
import users from '../../../data/users.json';
import { deleteUser, getAllUsers, postUser, updateUser } from '../../controllers/usersController';

export const userRouter = express.Router();

const data: any = {};
data.employees = users;

userRouter.route('/')
  .get(getAllUsers)
  .post(postUser)
  .put(updateUser)
  .delete(deleteUser)

userRouter.route('/:id')
  .get((req, res) => {
    res.send({ "id": "1" });
  })