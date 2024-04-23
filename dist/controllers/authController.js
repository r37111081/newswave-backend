"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logoutUser = exports.authenticateUser = exports.registerUser = void 0;
const User_1 = __importDefault(require("../models/User"));
const auth_1 = require("../utils/auth");
const registerUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, password } = req.body;
    const userExists = yield User_1.default.findOne({ email });
    if (userExists) {
        res.status(400).json({ message: '使用者已存在' });
    }
    const user = yield User_1.default.create({
        name, email, password
    });
    if (user) {
        (0, auth_1.generateToken)(res, user._id);
        res.status(201).json({
            id: user._id,
            name: user.name,
            email: user.email
        });
    }
    else {
        res.status(400).json({ message: '建立使用者發生錯誤' });
    }
});
exports.registerUser = registerUser;
const authenticateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    const user = yield User_1.default.findOne({ email });
    if (user && (yield user.comparePassword(password))) {
        (0, auth_1.generateToken)(res, user._id);
        res.status(201).json({
            id: user._id,
            name: user.name,
            email: user.email
        });
    }
    else {
        res.status(401).json({ message: '找不到使用者 / 密碼錯誤' });
    }
});
exports.authenticateUser = authenticateUser;
const logoutUser = (req, res) => {
    (0, auth_1.clearToken)(res);
    res.status(200).json({ message: '使用者登出' });
};
exports.logoutUser = logoutUser;
