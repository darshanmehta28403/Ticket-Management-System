import express from 'express';
import type { NextFunction, Response, Request } from 'express';
import path from 'path';
import { logEvents } from './middleware/logEvents';
import cors from 'cors';
import { errorHandler } from './middleware/errorHandler';
import { router } from './routes/root';
import { userRouter } from './routes/api/users';
import { corsOption } from '../config/corsOptions'
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './swagger';

const PORT = process.env.PORT || 3000;
const app = express();

app.use((req: Request, res: Response, next: NextFunction) => {
  logEvents(`${req.method} \t ${req.headers.origin} \t ${req.url}`, `reqLog.txt`);
  next();
});

app.use(cors(corsOption));

app.use(express.urlencoded({ extended: true }));

app.use(express.json());

app.use('/flowbit',swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use('/', router);
app.use('/users', userRouter);

app.use(express.static(path.join('D:/Training_and_Practice/Projects/FlowBit/backend', '/public')));

app.use(errorHandler);

// app.use((request: Request, response: Response, next: NextFunction)=>{
//   response.send("......of to Google");
// })

app.listen(PORT, () => {
  console.log(`Running On Port: ${PORT}`);
});