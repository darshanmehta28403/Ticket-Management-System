import { format } from 'date-fns';
import {v4 as uuid} from 'uuid';
import fs from 'fs';
import path from 'path';

let fsPromise = fs.promises;

export const logEvents = async (message: string, logName: string) => {
  const dateTime = `${format(new Date(), 'yyyyMMdd\tHH:mm:ss')}`;
  const logItem = `${dateTime}\t${uuid()}\t${message}\n`;

  try {
    if(!fs.existsSync(path.join('D:/Training_and_Practice/Projects/FlowBit/backend','src/','logs'))){
      await fsPromise.mkdir(path.join('D:/Training_and_Practice/Projects/FlowBit/backend','src/','logs'));
    }
    await fsPromise.appendFile(path.join('D:/Training_and_Practice/Projects/FlowBit/backend','/src','logs',logName), logItem);
  } catch (error) {
    console.log(error);
  }
}
