"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const logEvents_1 = require("./middleware/logEvents");
const cors_1 = __importDefault(require("cors"));
const errorHandler_1 = require("./middleware/errorHandler");
const root_1 = require("./routes/root");
const users_1 = require("./routes/api/users");
const role_1 = require("./routes/api/role");
const auth_1 = require("./routes/api/auth");
const projects_1 = require("./routes/api/projects");
const tickets_1 = require("./routes/api/tickets");
const corsOptions_1 = require("../config/corsOptions");
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swagger_1 = require("./swagger");
const PORT = process.env.PORT || 3000;
const app = (0, express_1.default)();
app.use((req, res, next) => {
    (0, logEvents_1.logEvents)(`${req.method} \t ${req.headers.origin} \t ${req.url}`, `reqLog.txt`);
    next();
});
app.use((0, cors_1.default)(corsOptions_1.corsOption));
app.use(express_1.default.urlencoded({ extended: true }));
app.use(express_1.default.json());
// Swagger documentation route
app.use('/flowbit', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swagger_1.swaggerSpec));
// Base root and static routes
app.use('/', root_1.router);
app.use(express_1.default.static(path_1.default.join('D:/Training_and_Practice/Projects/FlowBit/backend', '/public')));
// API routes
app.use('/auth', auth_1.authRouter);
app.use('/users', users_1.userRouter);
app.use('/roles', role_1.roleRouter);
app.use('/projects', projects_1.projectsRouter);
app.use('/tickets', tickets_1.ticketsRouter);
// Global Error Handler Middleware
app.use(errorHandler_1.errorHandler);
app.listen(PORT, () => {
    console.log(`Running On Port: ${PORT}`);
});
