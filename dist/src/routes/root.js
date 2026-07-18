"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
exports.router = express_1.default.Router();
const filePath = path_1.default;
exports.router.get('/', (req, res, next) => {
    next();
});
exports.router.get('/', (request, response, next) => {
    // response.sendFile("DarshanMehtaResume.pdf", { root: 'src/' });
    response.send("Hello... from Darshan..");
});
exports.router.get('/resume', (request, response, next) => {
    response.sendFile(filePath.join('D:/Training_and_Practice/Projects/FlowBit/backend', 'src', 'DarshanMehtaResume.pdf'));
});
exports.router.get('/naukri', (request, response, next) => {
    response.redirect(301, 'https://www.naukri.com');
});
exports.router.get('/test', (request, response, next) => {
    console.log("Hello World");
    next();
}, (request, response, next) => {
    response.redirect("https://www.google.com/careers");
});
