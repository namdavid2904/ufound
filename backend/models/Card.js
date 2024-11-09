const mongoose = require('mongoose');

var cardSchema = new mongoose.Schema({
    spireID: {
        type: String,
        required: true,
        unique: true
    },
    studentName: {
        type: String
    },
    imagePath: {
        type: String,
        required: true
    }
},{
    timestamps: true
})


module.exports = mongoose.model('Card', cardSchema);