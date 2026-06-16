import type { NextFunction, Request, Response } from "express";
import { logEvents } from "./logEvents";

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) =>{
  logEvents(`${err.name} : ${err.message}`,'errorStack.txt');
  res.status(500).send(err.message);  
}