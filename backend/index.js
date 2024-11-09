const express = require('express');
const dotenv = require('dotenv').config();
const PORT = process.env.PORT || 3000;
const app = express();
const cors = require('cors');
const morgan = require('morgan');
const dbConnect = require('./config/dbConnect');

dbConnect();
app.use(morgan());
app.use(cors());
app.use(express.json());
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})