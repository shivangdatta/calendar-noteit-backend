const mongoose = require('mongoose')

const tryConnect = async () => {
    try{
        await mongoose.connect(process.env.MONGO_URI)
    }
    catch (err) {
        console.log(err)
    }
}

module.exports = tryConnect