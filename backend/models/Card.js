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

// Create indexes for full-text search with spireId, student name, location
cardSchema.index({
    spireId: 'text',
    studentName: 'text',
    locationFound: 'text',
});

module.exports = mongoose.model('Card', cardSchema);