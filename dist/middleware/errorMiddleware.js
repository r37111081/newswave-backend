"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthenticationError = exports.errorHandler = void 0;
const errorHandler = (err, req, res, next) => {
    console.error(err.stack);
    if (err instanceof AuthenticationError) {
        res.status(401).json({ message: 'Unauthorized: ' + err.message });
    }
    else {
        res.status(500).json({ message: 'Internal Server Error' });
    }
};
exports.errorHandler = errorHandler;
class AuthenticationError extends Error {
    constructor(message) {
        super(message);
        this.name = 'AuthenticationError';
    }
}
exports.AuthenticationError = AuthenticationError;
