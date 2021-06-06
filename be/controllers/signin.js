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
const CONFIG = require('../../config');
const crypter_1 = require("../utils/crypter");
const msg_1 = __importDefault(require("../constants/msg"));
const mongo_1 = require("../services/mongo");
const signinController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let data = Object.assign({}, req.body);
    if (!data.email || !data.pswd) {
        res.json(msg_1.default.SIGNIN_PARAMSMISSING);
        return;
    }
    try {
        const db = mongo_1.getDB();
        let user = yield db.collection(CONFIG.usersCollection).findOne({ email: data.email });
        if (!user) {
            res.json(msg_1.default.SIGNIN_EMAILNOTEXIST);
            return;
        }
        if (crypter_1.hash(data.pswd) !== user.pswd) {
            res.json(msg_1.default.SIGNIN_IDPSWDMISMATCH);
            return;
        }
        user.notifs = yield db.collection(CONFIG.notifCollection).find({ forEmails: data.email }).toArray();
        user.notifs = user.notifs.map(notif => {
            notif.forEmails = [];
            if ('requestorEmail' in notif)
                notif.requestorEmail = '';
            return notif;
        });
        user.pswd = user._id = '';
        res.json({
            status: 200,
            msg: 'Sign in successful ...',
            user,
            tok: crypter_1.createToken({ email: user.email })
        });
    }
    catch (err) {
        console.log(err);
        res.json(msg_1.default.GENERIC_FAILURE);
    }
});
module.exports = signinController;
//# sourceMappingURL=signin.js.map