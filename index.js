require('dotenv').config()
const express = require('express');
const cors = require('cors');
const {todoRouter} = require('./routes/todo.js')

const allowedOrigins = ['http://localhost:3000',];
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: false}))
app.use('/', todoRouter)

const port = process.env.PORT || 3000; // use environment variable for port or default to 3000

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
