const express = require('express');
const mongoose = require("mongoose");
const passport = require('passport');

// Route
const auth = require('./routes/auth');

// passport config
require('./config/passport')(passport)

const app = express();

app.get('/', (req, res) => res.send('BUI HAI YEN'));
app.use('/auth', auth)

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server started on port ${port}`))