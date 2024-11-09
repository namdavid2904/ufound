const mongoose = require('mongoose');

const dbConnect = async() => {
    try {
        const connection = await mongoose.connect(process.env.MONGODB_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('DB connected');
    } catch(error) {
        console.error("Error connecting to database", error);
    }
}

module.exports = dbConnect;