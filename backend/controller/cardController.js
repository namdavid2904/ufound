const Card = require('../models/Card');
const { processImage } = require('../utils/extractData');
const openai = require('../config/openaiClient');


// User report found Ucard
const reportFoundCard = async (req, res) => {
    try {
        const { location, imageUrl } = req.body;
        const { email } = req.user;

        // Extract text data from image
        const extractedData = await processImage(imageUrl); 
        const { spireId, studentName } = extractedData;

        // Generate embedding with OpenAI
        const textToEmbed = `${spireId} ${studentName} ${location}`;
        const response = await openai.createEmbedding({
            model: "text-embedding-ada-002",
            input: textToEmbed,
        })

        // Create a new card entry
        const newCard = new Card({ spireId: spireId, studentName: studentName, locationFound: location, imageUrl: imageUrl, finderEmail: email });
        await newCard.save();

        res.status(201).json({ message: 'Card reported successfully', newCard });
    } catch (error) {
        console.error('Error reporting found item:', error);
        res.status(500).json({ message: 'Server error' });
  }
};

// Search lost card by spireId or student name
const searchLostCard = async (req, res) => {
    try {
        const { spireId, studentName } = req.query;
        let query = {};

        if (spireId) query.spireId = spireId;
        if (studentName) query.studentName = studentName;

        const cards = await Card.find(query);
        res.status(200).json(cards);
    } catch (error) {
        console.error('Error searching for lost item:', error);
        res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { reportFoundCard, searchLostCard };