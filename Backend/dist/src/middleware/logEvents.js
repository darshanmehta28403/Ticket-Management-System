"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logEvents = void 0;
const date_fns_1 = require("date-fns");
const uuid_1 = require("uuid");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
let fsPromise = fs_1.default.promises;
const logEvents = async (message, logName) => {
    const dateTime = `${(0, date_fns_1.format)(new Date(), 'yyyyMMdd\tHH:mm:ss')}`;
    const logItem = `${dateTime}\t${(0, uuid_1.v4)()}\t${message}\n`;
    try {
        const logsDirectory = path_1.default.join(process.cwd(), 'src', 'logs');
        if (!fs_1.default.existsSync(logsDirectory)) {
            await fsPromise.mkdir(logsDirectory, { recursive: true });
        }
        await fsPromise.appendFile(path_1.default.join(logsDirectory, logName), logItem);
    }
    catch (error) {
        console.log(error);
    }
};
exports.logEvents = logEvents;
