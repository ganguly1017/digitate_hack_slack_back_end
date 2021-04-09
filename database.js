// library import
const mongoose = require('mongoose');
const db_url = process.env.DB_URL;
const assert = require('assert');

// mongoose connect
mongoose.connect(
  db_url,
  {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: true,
    useUnifiedTopology: true
  },
  (error, link) => {
    // check error
    assert.strictEqual(error, null, "Database connection failed...");

    // Database connection established message
    console.log("Database connection success...");
  }
)