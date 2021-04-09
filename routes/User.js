// import library
const express = require('express');
const router = express.Router()
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { check, validationResult  } = require('express-validator');
const token_key = process.env.TOKEN_KEY;

// import user model
const User = require('./../models/User');


// middleware setup
router.use(express.json());
router.use(express.urlencoded({ extended: true }));


// Desc: default user api route
// Method: GET
// Access: Public
// URL: /api/user/
router.get(
  "/",
  (req, res) => {
    return res.status(200).json({
      status: true,
      message: "Default User API Route."
    });
  }
);



module.exports = router;



