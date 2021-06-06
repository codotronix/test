const express = require('express')
// const helmet = require("helmet");
const compression = require('compression')
const path = require('path')
const fs = require('fs')
var rfs = require('rotating-file-stream')
const morgan = require('morgan')
// const ejs = require('ejs')
const cors = require('cors')
// const mongoose = require('mongoose')
// const { connectToDB } = require('./be/services/mongo')
const { initFirestore } = require('./be/services/firestore.service')

const router = require('./be/router')

// First Create ALL Required Directory Paths
fs.mkdirSync('./be/user-uploads/banners', { recursive: true });
fs.mkdirSync('./logs', { recursive: true });
////

/**
 * CORS needs to be configured, 
 * as FE is at webapp.reactale.com
 * and BE is at reactale.com
 */
const corsOptions = {
    origin: ['https://webapp.reactale.com', 'https://webapp.reactale.site', 'http://localhost:3000'],
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    preflightContinue: false,
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}

// Let's create a file write stream for Morgan
// to use as a place to log things ...
// create a rotating write stream
// one log file per day in the logs/ directory
//
// rfs.createStream takes 2 params
// 1st function should return the newFileName each time it is called//
// Next comes the options//
// For details, see: https://www.npmjs.com/package/rotating-file-stream
//
// var accessLogStream = rfs.createStream(() => {
//         const d = new Date()
//         return `${d.getUTCFullYear()}-${(d.getUTCMonth()+1).toString().padStart(2, '0')}-${(d.getUTCDate()).toString().padStart(2, '0')}.log`
//     },
//     {
//     size: "5M", // rotate every 5 MegaBytes written
//     interval: '1d', // rotate daily
//     path: path.join(__dirname, 'logs')
// })

const app = express()
app.use(cors(corsOptions))
app.disable('x-powered-by')
app.set('view engine', 'ejs')
app.set('views', './be/views')

// app.use(helmet())
app.use(compression())
// app.use(morgan('combined', { stream: accessLogStream }))

app.use(express.json())
// app.use('/r', express.static(path.join(__dirname, 'fe', 'build'))) // for all static fe reactjs app
// app.use('/r/**', express.static(path.join(__dirname, 'fe', 'build'))) // for all static fe reactjs app
// app.use('/assets', express.static(path.join(__dirname, 'fe', 'build', 'assets'))) // for all common assets
// app.use('/be-assets', express.static(path.join(__dirname, 'be', 'assets'))) // for all be only assets
// app.use('/ups', express.static(path.join(__dirname, 'be', 'user-uploads'))) // for all user upoaded data

app.use(router)
app.use('/', (req, res, next) => {
    res.send(`
        <h1>Sorry, could not find that page...</h1>
        <p>
        <a href="/>Click here to go home</a>
        </p>
    `)
})


// console.log('Hi 1')
// connectToDB((err, client) => {
//     if(err) {
//         console.log('connectToDB callback with error = ', err)
//         return
//     }
//     console.log('DB connection successful ...')
//     app.listen(process.env.PORT || 9090, () => {
//         console.log('server started on port 9090')
//     })
// })

// FOR FIRESTORE
// initFirestore('reactale-2', path.join(__dirname, 'secrets', 'gcp', 'reactale-2-c8f3a5d01201.json'))
initFirestore(process.env.GCP_PROJECT_ID, process.env.GOOGLE_APPLICATION_CREDENTIALS)

// console.log(process.env.TALE_BANNER_BUCKET)

app.listen(process.env.PORT || 9090, () => {
    console.log('server started on port 9090')
})