const express = require('express');
const dotenv = require('dotenv').config();
const PORT = process.env.PORT || 4000;
const app = express();
const cors = require('cors');
const morgan = require('morgan');
const dbConnect = require('./config/dbConnect');
const userRouter = require('./routes/userRoutes');
const cardRouter = require('./routes/cardRoutes');


dbConnect();
app.use(morgan());
app.use(cors());
app.use(express.json());
app.use('/api/user', userRouter);
app.use('/api/card', cardRouter);


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})