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
const TNotification_1 = require("../types/TNotification");
const MSG = require('../constants/msg');
const CONFIG = require('../../config');
const { getUserByEmail, getNotifsBy, setNotification } = require('../services/firestore.service');
const crypter_1 = require("../utils/crypter");
const requestLinkATaleController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { fromUrl, fromStoryName, fromStoryUrl, fromStID, toUrl, choiceTxt, authorEmailEnc } = req.body;
    if (!fromUrl || !fromStoryName || !fromStoryUrl || !fromStID || !toUrl || !choiceTxt || !authorEmailEnc) {
        res.json(MSG.SIGNIN_PARAMSMISSING);
        return;
    }
    try {
        let user = yield getUserByEmail(req.email);
        if (!user) {
            res.json(MSG.SIGNIN_EMAILNOTEXIST);
            return;
        }
        const authorEmail = crypter_1.decrypt(authorEmailEnc);
        if (authorEmail === req.email) {
            res.json(MSG.NOTIF_LINKTOSELFNOTALLOWED);
            return;
        }
        let newLinkReqObj = {
            fromUrl, fromStoryName, fromStoryUrl, fromStID, toUrl, choiceTxt,
            requestorEmail: req.email,
            requestorID: user.username,
            requestorName: user.firstname + ' ' + user.lastname,
            name: TNotification_1.E_NOTIF_NAME.LINK_A_TALE_REQUEST,
            type: TNotification_1.E_NOTIF_TYPE.ACTION,
            forEmails: [req.email, authorEmail],
            doC: Date.now()
        };
        const MAX_REQ_PER_USER = 5;
        let existingLinkReqs = yield getNotifsBy({
            requestorEmail: req.email,
            name: TNotification_1.E_NOTIF_NAME.LINK_A_TALE_REQUEST
        });
        if (existingLinkReqs && existingLinkReqs.length > MAX_REQ_PER_USER) {
            return res.json(MSG.NOTIF_LINKATALELIMIT);
        }
        if (existingLinkReqs && existingLinkReqs.length > 0) {
            if (existingLinkReqs.some(linkObj => linkObj.fromStoryUrl === fromStoryUrl &&
                linkObj.fromStID === fromStID &&
                linkObj.choiceTxt === choiceTxt)) {
                return res.json(MSG.NOTIF_LINKATALEDUPLICATE);
            }
        }
        yield setNotification(newLinkReqObj);
        res.json({
            status: 200,
            msg: 'Request sent successfully ...'
        });
    }
    catch (err) {
        console.log(err);
        res.json(MSG.GENERIC_FAILURE);
    }
});
module.exports = requestLinkATaleController;
//# sourceMappingURL=requestlinkatale.js.map