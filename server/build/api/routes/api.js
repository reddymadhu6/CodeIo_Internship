"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.apis = void 0;
const express_1 = __importDefault(require("express"));
const students_1 = require("./students");
const teachers_1 = require("./teachers");
const branches_1 = require("./branches");
const admins_1 = require("./admins");
const classes_1 = require("./classes");
const courses_1 = require("./courses");
const login_1 = require("./login");
// At endpoint /api
exports.apis = (0, express_1.default)();
exports.apis.use("/s", students_1.api);
exports.apis.use("/t", teachers_1.api);
exports.apis.use("/a", admins_1.api);
exports.apis.use("/b", branches_1.api);
exports.apis.use("/c", classes_1.api);
exports.apis.use("/courses", courses_1.api);
exports.apis.use("/login", login_1.api);
