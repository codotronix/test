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
const CONFIG = require('../../config');
const mongo_1 = require("../services/mongo");
const crypter_1 = require("../utils/crypter");
const readStoryController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const storyUrl = req.params.storyUrl;
        if (!storyUrl)
            throw 'Sorry, we could not find this tale ... :(';
        const db = mongo_1.getDB();
        const tale = yield db.collection(CONFIG.talesCollection).findOne({ "info.storyUrl": storyUrl });
        if (!tale)
            throw 'Sorry, we could not find this tale ... :(';
        if (!tale.isPublished) {
            throw 'Sorry, this tale is in unpublished state. If you know the author, please request him / her to publish it and then you can see it :)';
        }
        let author = yield db.collection(CONFIG.usersCollection).findOne({ email: tale.info.authorEmail });
        author.username = author.username ? ('@' + author.username) : encodeURIComponent(crypter_1.encrypt(author.email));
        tale.info.imgUrl = tale.info.imgUrl ? `/ups/banners/${tale.info.imgUrl}` : '/assets/img/bg/small/storytelling-4203628_640.jpg';
        const EXT = '.webp';
        const EXT300 = '.300x.webp';
        tale.info.imgUrlSquare = tale.info.imgUrl.substr(0, tale.info.imgUrl.length - EXT.length) + EXT300;
        tale.info.authorEmailEnc = crypter_1.encrypt(tale.info.authorEmail);
        tale.info.authorEmail = '';
        res.render('templates/tale', { tale, author });
    }
    catch (err) {
        if (typeof (err) === 'string')
            res.send(`
            <div>
                <h1>${err}</h1>
                <a href="https://reactale.com/gallery">Go Home</a>
            </div>
        `);
        else
            res.send('Sorry, we coud not find this tale');
    }
});
module.exports = readStoryController;
//# sourceMappingURL=readstory.js.map