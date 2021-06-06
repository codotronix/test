// const MongoClient = require('mongodb').MongoClient
const CONFIG = require('../../config')

import { Db, MongoClient } from 'mongodb'

let _client: MongoClient;
let _db: Db

export const getDB = () => _db

export const connectToDB = (cb: Function) => {
    if(_client) cb(null, _client)

    // console.log('Hi2, CONFIG.dbUri = ', CONFIG.dbUri)

    MongoClient.connect(CONFIG.dbUri, { useUnifiedTopology: true })
    // MongoClient.connect('mongodb+srv://almighty:Jomma2018@codocluster-nwvop.mongodb.net/test?retryWrites=true&w=majority', { useUnifiedTopology: true })
    .then(client => {
        _client = client
        _db = client.db(CONFIG.dbName) // pass any new dbName to override the default
        cb(null, client)
    })
    .catch(err => cb(err))
}