const mongoose = require('mongoose');
const Card = require('../models/Card');

const dbConnect = async() => {
    try {
        const connection = await mongoose.connect(process.env.MONGODB_URL);
        console.log('DB connected');

        // Create Time-To-Live index to auto delete cards after 1 week
        Card.collection.createIndex({ createdAt: 1 }, { expireAfterSeconds: 604800 });        
    } catch(error) {
        console.error("Error connecting to database", error);
    }
}

module.exports = dbConnect;