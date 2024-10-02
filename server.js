require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const path = require('path')
const cors = require('cors')
const tryConnect = require('./config/dbConn.js')
const corsOptions = require('./config/corsOptions.js')
const { logger } = require('./middleware/logger.js')
const admin = require("firebase-admin");
const cookieParser = require('cookie-parser')
// const { verifyFirebaseToken } = require('./middleware/authorization.js');

const serviceAccount = require("./firebase-admin-sdk.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const PORT = process.env.PORT || 3500
const app = express()

console.log(PORT);

app.use(cookieParser())

tryConnect()

app.use(logger)

app.use(cors(corsOptions))
app.use(express.json())

app.use('/authentication' , require('./routes/authRoutes.js'))
app.use('/userdata' , require('./routes/userRoute.js')) 

mongoose.connection.once('open' , () => {
    console.log('DB connection successfull')
    app.listen(PORT , () => console.log(`Listening to port no. : ${PORT}`) )
})

mongoose.connection.on('error' , err => {
    console.log(err)
})