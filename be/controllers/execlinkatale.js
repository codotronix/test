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
const mongo_1 = require("../services/mongo");
const msg_1 = __importDefault(require("../constants/msg"));
const mongodb_1 = require("mongodb");
const execLinkATaleController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id, execCode } = req.body;
    const validExecCodes = ["APPROVE", "DENY", "DELETE"];
    if (!id || !execCode || !validExecCodes.includes(execCode)) {
        res.json(msg_1.default.SIGNIN_PARAMSMISSING);
        return;
    }
    try {
        const db = mongo_1.getDB();
        const notifCollection = db.collection(CONFIG.notifCollection);
        const objectID = new mongodb_1.ObjectID.createFromHexString(id);
        const notif = yield notifCollection.findOne({ _id: objectID });
        if (!notif) {
            res.json(msg_1.default.NOTIF_NOTIFNOTFOUND);
            return;
        }
        if (!notif.forEmails.includes(req.email)) {
            res.json(msg_1.default.NOTIF_NOPERMISSION);
            return;
        }
        if (execCode === "APPROVE") {
            const talesCollection = db.collection(CONFIG.talesCollection);
            let srcTale = yield talesCollection.findOne({ "info.storyUrl": notif.fromStoryUrl });
            if (!srcTale)
                throw 'Unable to find source tale for Link-A-Tale id = ' + id;
            let idCounter = srcTale.idCounter;
            let newST = {
                id: "ST" + (++idCounter).toString().padStart(3, '0'),
                title: "link: " + notif.choiceTxt,
                text: `((r.fn.goto ,, ${notif.toUrl}))`,
                choices: []
            };
            let newChoice = {
                id: "C" + (++idCounter).toString().padStart(3, '0'),
                text: notif.choiceTxt,
                next: newST.id
            };
            srcTale.storylets[notif.fromStID].choices.push(newChoice.id);
            srcTale.storylets[newST.id] = newST;
            srcTale.choices[newChoice.id] = newChoice;
            srcTale.idCounter = idCounter;
            yield talesCollection.updateOne({ "info.storyUrl": srcTale.info.storyUrl }, { $set: srcTale });
        }
        yield notifCollection.deleteOne({ _id: objectID });
        res.json(Object.assign(Object.assign({}, msg_1.default.GENERIC_SUCCESS), { _id: id }));
    }
    catch (err) {
        console.log(err);
        res.json(msg_1.default.GENERIC_FAILURE);
    }
});
module.exports = execLinkATaleController;
//# sourceMappingURL=execlinkatale.js.map