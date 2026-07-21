import { format } from 'date-fns';
import {v4 as uuid} from 'uuid';
import fs from 'fs';
import path from 'path';

let fsPromise = fs.promises;

export const logEvents = async (message: string, logName: string) => {
  const dateTime = `${format(new Date(), 'yyyyMMdd\tHH:mm:ss')}`;
  const logItem = `${dateTime}\t${uuid()}\t${message}\n`;

  try {
    const logsDirectory = path.join(process.cwd(), 'src', 'logs');
    if(!fs.existsSync(logsDirectory)){
      await fsPromise.mkdir(logsDirectory, { recursive: true });
    }
    await fsPromise.appendFile(path.join(logsDirectory, logName), logItem);
  } catch (error) {
    console.log(error);
  }
}
