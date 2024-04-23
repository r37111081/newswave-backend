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
exports.authenticate = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = __importDefault(require("../models/User"));
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const errorMiddleware_1 = require("./errorMiddleware");
const authenticate = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let token = req.cookies.jwt;
        if (!token) {
            throw new errorMiddleware_1.AuthenticationError('Token not found');
        }
        const jwtSecret = process.env.JWT_SECRET || '';
        const decoded = jsonwebtoken_1.default.verify(token, jwtSecret);
        if (!decoded || !decoded.userId) {
            throw new errorMiddleware_1.AuthenticationError('UserId not found');
        }
        const user = yield User_1.default.findById(decoded.userId, '_id name email');
        if (!user) {
            throw new errorMiddleware_1.AuthenticationError('User not found');
        }
        req.user = user;
        next();
    }
    catch (e) {
        throw new errorMiddleware_1.AuthenticationError('Invalid token');
    }
}));
exports.authenticate = authenticate;
