// include library
require('dotenv').config();

const express = require('express');
const app = express();
const cors = require("cors");

const port = process.env.PORT

// middleware setup
// Cross Origin Resource Sharing Setup
app.use(cors())

// Desc: default route
// Method: GET
// Access: Public
// URL: /
app.get(
  "/",
  (req, res) => {
    return res.status(200).json({
      status: true,
      message: "Default API Route."
    });
  }
)


// Start web server
app.listen(port, () => {
  console.log("Server running at port : " + port);
});

