// import library
const express = require('express');
const router = express.Router()
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');
const token_key = process.env.TOKEN_KEY;

// import user model
const User = require('./../models/User');
const verifyToken = require('../middlewares/verify_token');


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

// Desc: get single user data
// Method: POST
// Access: Private
// URL: /api/user/getUser/:userID
router.post(
  "/getUser/:userID",
  verifyToken,
  (req, res) => {

    const userID = req.params.userID;

    if (userID != '') {
      User.findById(userID, { password: 0, email: 0, __v: 0 }).then(user => {
        if (user) {
          return res.status(200).json({
            status: true,
            message: "User data retrieved",
            user: user
          });
        } else {
          return res.status(404).json({
            status: true,
            message: "User data not retrieved",
          });
        }
      }).catch(err => {
        return res.status(502).json({
          status: false,
          message: "Database error.",
          error: {
            db_error: "Some error in database."
          }
        });
      });
    } else {
      return res.status(400).json({
        status: false,
        message: "user id not provided",
        error: {
          user_id: "User id not provided."
        }
      });
    }
  }
);



// Desc: Register User API Route
// Method: POST
// Access: Public
// URL: /api/user/register
router.post(
  "/register",
  [
    check("username").not().isEmpty().withMessage("Please enter your username.").trim().escape(),
    check("password").not().isEmpty().withMessage("Please enter your password.").trim().escape(),
    check("password1").not().isEmpty().withMessage("Please enter your re-type password.").trim().escape(),
    check("email").isEmail().normalizeEmail().withMessage("Please enter valid email.")

  ],
  (req, res) => {

    // check validation errors
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      let error = {};

      for (index = 0; index < errors.array().length; index++) {
        error = {
          ...error,
          [errors.array()[index].param]: errors.array()[index].msg
        }
      }

      return res.status(400).json({
        status: false,
        message: "form validation error.",
        error: error
      });
    }

    // check password = password1
    if (req.body.password != req.body.password1) {
      return res.status(400).json({
        status: false,
        message: "form validation error.",
        error: {
          password1: "Re-type password is same as password."
        }
      });
    }

    // check if email already exists
    User.findOne({ email: req.body.email }).then(user => {

      // if user email exists
      if (user) {
        return res.status(400).json({
          status: false,
          message: "User already exists.",
          error: {
            email: "Email already exists."
          }
        });
      } else {
        // password hashing
        let salt = bcrypt.genSaltSync(10);
        let hashedPassword = bcrypt.hashSync(req.body.password, salt);


        // Save new user into database
        const newUser = new User({
          username: req.body.username,
          email: req.body.email,
          password: hashedPassword
        })

        newUser.save().then(user => {
          return res.status(200).json({
            status: true,
            message: "User register success.",
            user: {
              id: user._id,
              username: user.username,
              email: user.email
            }
          });
        }).catch(error => {
          return res.status(502).json({
            status: false,
            message: "Database error.",
            error: {
              db_error: "Some error in database."
            }
          });
        });
      }

    }).catch(error => {
      return res.status(502).json({
        status: false,
        message: "Database error.",
        error: {
          db_error: "Some error in database."
        }
      });
    });
  }
);


// Desc: Login user API Route
// Method: POST
// Access: Public
// URL: /api/user/login
router.post(
  "/login",
  [
    check("password").not().isEmpty().withMessage("Please enter your password.").trim().escape(),
    check("email").isEmail().normalizeEmail().withMessage("Please enter valid email.")
  ],
  (req, res) => {

    // check validation errors
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      let error = {};

      for (index = 0; index < errors.array().length; index++) {
        error = {
          ...error,
          [errors.array()[index].param]: errors.array()[index].msg
        }
      }

      return res.status(400).json({
        status: false,
        message: "form validation error.",
        error: error
      });
    }


    // check if email already exists
    User.findOne({ email: req.body.email }).then(user => {

      // if user email not exists
      if (!user) {
        return res.status(400).json({
          status: false,
          message: "User not exists.",
          error: {
            email: "Email not exists."
          }
        });
      } else {
        // match user password
        let isPasswordMatch = bcrypt.compareSync(req.body.password, user.password)

        if (!isPasswordMatch) {
          return res.status(400).json({
            status: false,
            message: "Password not matched",
            error: {
              password: "Password not match in database."
            }
          });
        }

        // Generate JSON Web Token
        const authToken = jwt.sign(
          {
            id: user._id,
            username: user.username,
            email: user.email
          },
          token_key,
          {
            expiresIn: 3600
          }
        );

        return res.status(200).json({
          status: true,
          message: "User login success.",
          user: {
            id: user._id,
            username: user.username,
            email: user.email
          },
          token: authToken
        });
      }

    }).catch(error => {
      return res.status(502).json({
        status: false,
        message: "Database error.",
        error: {
          db_error: "Some error in database."
        }
      });
    });
  }
);



module.exports = router;



