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
    locationFound: {
        type: String,
        required: true
    },
    finderEmail: {
        type: String,
        required: true
    },
    imagePath: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['found', 'returned'],
        default: 'found'
    }
},{
    timestamps: true
})


module.exports = mongoose.model('Card', cardSchema);