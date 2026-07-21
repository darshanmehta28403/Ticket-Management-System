"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const logEvents_1 = require("./logEvents");
const errorHandler = (err, req, res, next) => {
    (0, logEvents_1.logEvents)(`${err.name} : ${err.message}`, 'errorStack.txt');
    if (res.headersSent) {
        return next(err);
    }
    res.status(500).json({ message: 'Internal server error.' });
};
exports.errorHandler = errorHandler;
