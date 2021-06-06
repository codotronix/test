const express = require('express')
// const helmet = require("helmet");
const compression = require('compression')
const path = require('path')
const fs = require('fs')
var rfs = require('rotating-file-stream')
const morgan = require('morgan')
const ejs = require('ejs')
// const mongoose = require('mongoose')
const { connectToDB } = require('./be/services/mongo')
const router = require('./be/router')

// First Create ALL Required Directory Paths
fs.mkdirSync('./be/user-uploads/banners', { recursive: true });
fs.mkdirSync('./logs', { recursive: true });
////

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
var accessLogStream = rfs.createStream(() => {
        const d = new Date()
        return `${d.getUTCFullYear()}-${(d.getUTCMonth()+1).toString().padStart(2, '0')}-${(d.getUTCDate()).toString().padStart(2, '0')}.log`
    },
    {
    size: "5M", // rotate every 5 MegaBytes written
    interval: '1d', // rotate daily
    path: path.join(__dirname, 'logs')
})

const app = express()
app.disable('x-powered-by')
app.set('view engine', 'ejs')
app.set('views', './be/views')

// app.use(helmet())
app.use(compression())
app.use(morgan('combined', { stream: accessLogStream }))

app.use(express.json())
app.use('/r', express.static(path.join(__dirname, 'fe', 'build'))) // for all static fe reactjs app
app.use('/r/**', express.static(path.join(__dirname, 'fe', 'build'))) // for all static fe reactjs app
app.use('/assets', express.static(path.join(__dirname, 'fe', 'build', 'assets'))) // for all common assets
app.use('/be-assets', express.static(path.join(__dirname, 'be', 'assets'))) // for all be only assets
app.use('/ups', express.static(path.join(__dirname, 'be', 'user-uploads'))) // for all user upoaded data
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
connectToDB((err, client) => {
    if(err) {
        console.log('connectToDB callback with error = ', err)
        return
    }
    console.log('DB connection successful ...')
    app.listen(process.env.PORT || 9090, () => {
        console.log('server started on port 9090')
    })
})