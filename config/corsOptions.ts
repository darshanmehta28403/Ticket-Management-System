import { CorsOptions } from "cors";

const whiteList = (process.env.CORS_ORIGINS ?? 'http://localhost:4000,http://127.0.0.1:5500,http://localhost:3000')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

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
