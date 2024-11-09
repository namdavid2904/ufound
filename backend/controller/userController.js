const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const googleLogin = async (req, res) => {
    try {
        const { id_token } = req.body;

        // Verify Google ID Token
        const ticket = await client.verifyIdToken({
            idToken: id_token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();

        // Extract Google ID, email, name
        const googleId = payload['sub'];
        const email = payload['email'];
        const name = payload['name'];

        // Check if user exists, else create new user
        const user = await User.findOne({ googleId });
        if (!user) {
            const newUser = new User({
                googleId,
                email,
                name
            });
            await newUser.save();
        }

        // JWT Token for session management
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
            expiresIn: '7d'
        });
        res.status(200).json({ token });
    } catch(error) {
        res.status(500).json({
            message: 'Error authenticating Google',
        })
    }
};

module.exports = googleLogin;