// import library
const express = require('express');
const router = express.Router()
const { check, validationResult } = require('express-validator');
const verifyToken = require('./../middlewares/verify_token');

// import user model
const User = require('./../models/User');
const Team = require('./../models/Team');
const Chat = require('./../models/Chat');


// middleware setup
router.use(express.json());
router.use(express.urlencoded({ extended: true }));


// Desc: default chat api route
// Method: GET
// Access: Public
// URL: /api/chat/
router.get(
  "/",
  (req, res) => {
    return res.status(200).json({
      status: true,
      message: "Default Chat API Route."
    });
  }
);


// Desc: new chat insert api route
// Method: POST
// Access: Private
// URL: /api/chat/new
router.post(
  "/new",
  verifyToken,
  [
    check("message").not().isEmpty().withMessage("Please enter message").trim().escape(),
    check("team").not().isEmpty().withMessage("Please provide team_id.").trim().escape(),
    check("to").not().isEmpty().withMessage("Please provide to_id.").trim().escape(),
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

    // save new chat message data
    const newChat = new Chat({
      message: req.body.message,
      team: req.body.team,
      to: req.body.to,
      from: req.user.id
    })

    newChat.save().then(chat => {
      return res.status(200).json({
        status: true,
        message: "Chat message saved...",
        chat: chat
      });

    }).catch(err => {
      console.log(err)
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



// Desc: get user detial in a chat team api route
// Method: POST
// Access: Private
// URL: /api/chat/getTeamUser
router.post(
  "/getTeamUser",
  verifyToken,
  [
    check("team").not().isEmpty().withMessage("Please enter team id").trim().escape()
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

    // get all chat team user
    Chat.find({ team: req.body.team }).distinct("from").then(users => {
      return res.status(200).json({
        status: true,
        message: "Team user id retreived...",
        users: users
      });
    }).catch(err => {
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



