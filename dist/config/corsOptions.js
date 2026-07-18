"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.corsOption = void 0;
const whiteList = ['http://localhost:4000', 'http://127.0.0.1:5500', 'https://www.playstation.com', 'http://localhost:3000'];
exports.corsOption = {
    origin: (origin, callback) => {
        if (!origin || whiteList.includes(origin)) {
            callback(null, true);
        }
        else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    optionsSuccessStatus: 200
};
