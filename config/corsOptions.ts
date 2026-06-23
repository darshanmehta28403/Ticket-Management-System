import { CorsOptions } from "cors";

const whiteList = ['http://localhost:4000','http://127.0.0.1:5500','https://www.playstation.com', 'http://localhost:3000'];

export const corsOption: CorsOptions = {
  origin: (origin, callback) => {
    if (!origin || whiteList.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  optionsSuccessStatus: 200
}