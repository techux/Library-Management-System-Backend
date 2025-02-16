const mongoose = require('mongoose');

const dbConnect = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_STRING)
        console.log(`[INFO] MongoDB connected: ${conn.connection.host}`)
    } catch (error) {
        console.log(`[ERROR] Error in Connecting Database : ${error.stack || error.message}`)
    }
}

module.exports = dbConnect