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
Object.defineProperty(exports, "__esModule", { value: true });
const MSG = require('../constants/msg');
const { getUserByEmail, getNotifications } = require('../services/firestore.service');
const CONFIG = require('../../config');
const crypter_1 = require("../utils/crypter");
const signinController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let data = Object.assign({}, req.body);
    if (!data.email || !data.pswd) {
        res.json(MSG.SIGNIN_PARAMSMISSING);
        return;
    }
    try {
        let user = yield getUserByEmail(data.email);
        if (!user) {
            res.json(MSG.SIGNIN_EMAILNOTEXIST);
            return;
        }
        if (crypter_1.hash(data.pswd) !== user.pswd) {
            res.json(MSG.SIGNIN_IDPSWDMISMATCH);
            return;
        }
        user.notifs = (yield getNotifications('forEmails', data.email));
        user.notifs = user.notifs.map(notif => {
            notif.forEmails = [];
            if ('requestorEmail' in notif && notif.requestorEmail !== data.email) {
                notif.requestorEmail = '';
            }
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
        res.json(MSG.GENERIC_FAILURE);
    }
});
module.exports = signinController;
//# sourceMappingURL=signin.js.map