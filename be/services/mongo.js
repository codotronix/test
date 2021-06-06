"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectToDB = exports.getDB = void 0;
const CONFIG = require('../../config');
const mongodb_1 = require("mongodb");
let _client;
let _db;
const getDB = () => _db;
exports.getDB = getDB;
const connectToDB = (cb) => {
    if (_client)
        cb(null, _client);
    mongodb_1.MongoClient.connect(CONFIG.dbUri, { useUnifiedTopology: true })
        .then(client => {
        _client = client;
        _db = client.db(CONFIG.dbName);
        cb(null, client);
    })
        .catch(err => cb(err));
};
exports.connectToDB = connectToDB;
//# sourceMappingURL=mongo.js.map