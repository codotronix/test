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
const { getNotifById, getStoriesBy, updateStory, deleteNotification } = require('../services/firestore.service');
const MSG = require('../constants/msg');
const CONFIG = require('../../config');
const execLinkATaleController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id, execCode } = req.body;
    const validExecCodes = ["APPROVE", "DENY", "DELETE"];
    if (!id || !execCode || !validExecCodes.includes(execCode)) {
        res.json(MSG.GENERIC_PARAMSMISSING);
        return;
    }
    try {
        const notif = yield getNotifById(id);
        if (!notif) {
            res.json(MSG.NOTIF_NOTIFNOTFOUND);
            return;
        }
        if (!notif.forEmails.includes(req.email)) {
            res.json(MSG.NOTIF_NOPERMISSION);
            return;
        }
        if (execCode === "APPROVE") {
            let srcTale = null;
            let temp = yield getStoriesBy({ "info.storyUrl": notif.fromStoryUrl }, { full: true });
            if (temp && Array.isArray(temp) && temp.length > 0)
                srcTale = temp[0];
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
            yield updateStory(srcTale._fireID, srcTale);
        }
        yield deleteNotification(id);
        res.json(Object.assign(Object.assign({}, MSG.GENERIC_SUCCESS), { id }));
    }
    catch (err) {
        console.log(err);
        res.json(MSG.GENERIC_FAILURE);
    }
});
module.exports = execLinkATaleController;
//# sourceMappingURL=execlinkatale.js.map