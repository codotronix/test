"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserPrefs = void 0;
const ajax_1 = require("../utils/ajax");
const urls_1 = require("../utils/urls");
const updateUserPrefs = async (email, partialPrefs) => ajax_1.ajaxPost(urls_1.UPDATE_MYPREFERENCES, { email, partialPrefs });
exports.updateUserPrefs = updateUserPrefs;
