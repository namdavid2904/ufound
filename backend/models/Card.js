const mongoose = require('mongoose');

var cardSchema = new mongoose.Schema({
    spireId: {
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
    imageUrl: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    embedding: {
        type: [Number],
        required: true,
    }
},{
    timestamps: true
})


module.exports = mongoose.model('Card', cardSchema);