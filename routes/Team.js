// import library
const express = require('express');
const router = express.Router()
const { check, validationResult } = require('express-validator');
const verifyToken = require('./../middlewares/verify_token');

// import user model
const User = require('./../models/User');
const Team = require('./../models/Team');


// middleware setup
router.use(express.json());
router.use(express.urlencoded({ extended: true }));


// Desc: default team api route
// Method: GET
// Access: Public
// URL: /api/team/
router.get(
  "/",
  (req, res) => {
    return res.status(200).json({
      status: true,
      message: "Default Team API Route."
    });
  }
);


// Desc: Create new team API Route
// Method: POST
// Access: Private
// URL: /api/team/new
router.post(
  "/new",
  verifyToken,
  [
    check("name").not().isEmpty().withMessage("Please enter team name.").trim().escape(),
    check("description").not().isEmpty().withMessage("Please enter description.").trim().escape()
  
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

    // save new team data
    const newTeam = new Team({
      name: req.body.name,
      description: req.body.description,
      user: req.user.id
    })

    newTeam.save().then(team => {
      return res.status(200).json({
        status: true,
        message: "New team created successfully...",
        team: {
          name: team.name,
          description: team.description,
          user_id: team.user
        }
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



