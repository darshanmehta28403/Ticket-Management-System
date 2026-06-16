import users from '../../data/users.json';

const data: any = {};
data.employees = users;

export let getAllUsers = (req: any, res: any) => {
  res.send(data.employees);
}

export let postUser = (req: any, res: any) => {
  res.json({
    "name": req.body.name,
    "email": req.body.email,
    "password": req.body.password,
    "roleId": req.body.roleId,
    "projectId": req.body.projectId
  })
}

export let updateUser = (req: any, res: any) => {
  res.json({
    "email": req.body.email
  })
}

export let deleteUser = (req: any, res: any) => {
  res.json({
    "id": "1"
  })
}