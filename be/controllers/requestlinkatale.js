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
const TNotification_1 = require("../types/TNotification");
const CONFIG = require('../../config');
const mongo_1 = require("../services/mongo");
const msg_1 = __importDefault(require("../constants/msg"));
const crypter_1 = require("../utils/crypter");
const requestLinkATaleController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { fromUrl, fromStoryName, fromStoryUrl, fromStID, toUrl, choiceTxt, authorEmailEnc } = req.body;
    if (!fromUrl || !fromStoryName || !fromStoryUrl || !fromStID || !toUrl || !choiceTxt || !authorEmailEnc) {
        res.json(msg_1.default.SIGNIN_PARAMSMISSING);
        return;
    }
    try {
        const db = mongo_1.getDB();
        let user = yield db.collection(CONFIG.usersCollection)
            .findOne({ email: req.email });
        if (!user) {
            res.json(msg_1.default.SIGNIN_EMAILNOTEXIST);
            return;
        }
        const authorEmail = crypter_1.decrypt(authorEmailEnc);
        if (authorEmail === req.email) {
            res.json(msg_1.default.NOTIF_LINKTOSELFNOTALLOWED);
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
        let existingLinkReqs = yield db.collection(CONFIG.notifCollection)
            .find({ requestorEmail: req.email,
            name: TNotification_1.E_NOTIF_NAME.LINK_A_TALE_REQUEST
        })
            .toArray();
        if (existingLinkReqs && existingLinkReqs.length > MAX_REQ_PER_USER) {
            return res.json(msg_1.default.NOTIF_LINKATALELIMIT);
        }
        if (existingLinkReqs && existingLinkReqs.length > 0) {
            if (existingLinkReqs.some(linkObj => linkObj.fromStoryUrl === fromStoryUrl &&
                linkObj.fromStID === fromStID &&
                linkObj.choiceTxt === choiceTxt)) {
                return res.json(msg_1.default.NOTIF_LINKATALEDUPLICATE);
            }
        }
        yield db.collection(CONFIG.notifCollection).insertOne(newLinkReqObj);
        res.json({
            status: 200,
            msg: 'Request sent successfully ...'
        });
    }
    catch (err) {
        console.log(err);
        res.json(msg_1.default.GENERIC_FAILURE);
    }
});
module.exports = requestLinkATaleController;
//# sourceMappingURL=requestlinkatale.js.map