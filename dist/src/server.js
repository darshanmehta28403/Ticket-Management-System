"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const PORT = process.env.PORT || 3000;
const app_1 = require("./app");
app_1.app.listen(PORT, () => {
    console.log(`Running On Port: ${PORT}`);
});
