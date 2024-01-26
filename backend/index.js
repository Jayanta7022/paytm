const express = require('express');
const cors = require('cors');
require('dotenv').config();
const mongoose = require('mongoose');
const PORT = process.env.PORT;
mongoose
  .connect('mongodb://localhost:27017/paytm')
  .then(() => console.log('hello'));
const mainRouter = require('./router/index.js');

const app = express();

app.use(cors());
app.use(express.json());
app.use('/api/v1', mainRouter);

app.listen(PORT, () => {
  console.log(`server is running on ${PORT}`);
});
