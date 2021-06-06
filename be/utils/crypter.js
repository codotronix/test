"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.decodeToken = exports.createToken = exports.jwtSign = exports.hash = exports.decrypt = exports.encrypt = void 0;
const CONFIG = require('../../config');
const crypto_js_1 = __importDefault(require("crypto-js"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const encrypt = (txt) => crypto_js_1.default.AES.encrypt(txt, CONFIG.encSecret).toString();
exports.encrypt = encrypt;
const decrypt = (txt) => crypto_js_1.default.AES.decrypt(txt, CONFIG.encSecret).toString(crypto_js_1.default.enc.Utf8);
exports.decrypt = decrypt;
const hash = (txt) => crypto_js_1.default.SHA256(txt, CONFIG.encSecret).toString();
exports.hash = hash;
const jwtSign = (jsonData) => jsonwebtoken_1.default.sign(jsonData, CONFIG.jwtSecret, { expiresIn: '12h' });
exports.jwtSign = jwtSign;
const createToken = (jsonData) => {
    let enc = exports.encrypt(JSON.stringify(jsonData));
    return exports.jwtSign({ enc });
};
exports.createToken = createToken;
const decodeToken = (tok) => {
    try {
        let jwtDecoded = jsonwebtoken_1.default.verify(tok, CONFIG.jwtSecret);
        if (jwtDecoded) {
            return JSON.parse(exports.decrypt(jwtDecoded.enc));
        }
        else {
            return false;
        }
    }
    catch (e) {
        return false;
    }
};
exports.decodeToken = decodeToken;
//# sourceMappingURL=crypter.js.map