import express from 'express';
import type { NextFunction, Request, Response } from 'express';
import path from 'path';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import { logEvents } from './middleware/logEvents';
import { errorHandler } from './middleware/errorHandler';
import { router } from './routes/root';
import { userRouter } from './routes/api/users';
import { roleRouter } from './routes/api/role';
import { authRouter } from './routes/api/auth';
import { projectsRouter } from './routes/api/projects';
import { ticketsRouter } from './routes/api/tickets';
import { corsOption } from '../config/corsOptions';
import { swaggerSpec } from './swagger';

export const app = express();

app.use((req: Request, _res: Response, next: NextFunction) => {
  logEvents(`${req.method}\t${req.headers.origin ?? '-'}\t${req.url}`, 'reqLog.txt');
  next();
});
app.use(cors(corsOption));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use('/flowbit', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use(express.static(path.join(process.cwd(), 'public')));
app.use('/', router);
app.use('/auth', authRouter);
app.use('/users', userRouter);
app.use('/roles', roleRouter);
app.use('/projects', projectsRouter);
app.use('/tickets', ticketsRouter);
app.use(errorHandler);
