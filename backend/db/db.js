const mongoose = require('mongoose')

module.exports = async () => {
    try {
        const connection = await mongoose.connect(process.env.DB)
        console.log("MongoDb connected to database successfully")
    } catch (err) {
        console.error(err)    
        console.log("Could not connect to database!")    
    }
}