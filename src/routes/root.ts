import express from 'express';
import type { Request, Response, NextFunction } from 'express';
import path from 'path';

export const router = express.Router();

const filePath = path;

router.get('/',(req: Request, res: Response, next: NextFunction)=>{
  next();
});

router.get('/', (request: Request, response: Response, next: NextFunction) => {
  // response.sendFile("DarshanMehtaResume.pdf", { root: 'src/' });
  response.send("Hello... from Darshan..");
})

router.get('/resume', (request: Request, response: Response, next: NextFunction) => {
  response.sendFile(filePath.join('D:/Training_and_Practice/Projects/FlowBit/backend', 'src', 'DarshanMehtaResume.pdf'));
})

router.get('/naukri', (request: Request, response: Response, next: NextFunction) => {
  response.redirect(301, 'https://www.naukri.com');
})

router.get('/test', (request: Request, response: Response, next: NextFunction) => {
  console.log("Hello World");
  next();
}, (request: Request, response: Response, next: NextFunction) => {
  response.redirect("https://www.google.com/careers");
})