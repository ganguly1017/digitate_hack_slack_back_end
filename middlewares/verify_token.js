// library include
const jwt = require('jsonwebtoken');
const User = require('./../models/User');
const token_key = process.env.TOKEN_KEY;

function verifyToken(req, res, next){
  // get token from http header
  const token = req.headers["x-access-token"];

  // is token empty
  if (!token){
    return res.status(404).json({
      status: false,
      message: "Token not provided",
      error: {
        token_error: "Token not provided"
      }
    });
  }

  // verify token
  jwt.verify(token, token_key, function(error, decoded){

    // check error
    if (error){
      return res.status(404).json({
        status: false,
        message: "Token decryption error",
        error: {
          token_error: "Token decryption error"
        }
      });
    }

    // check user id in mongodb database
    User.findById({ _id: decoded.id }, { password: 0, createdAt: 0 }).then(user => {
      // is user object is empty
      if (!user){
        return res.status(404).json({
          status: false,
          message: "User token invalid",
          error: {
            token_error: "User token invalid"
          }
        });
      }

      // add user object in request object
      req.user = {
        id: user._id,
        username: user.username,
        email: user.email
      };

      next();

    }).catch(error => {
      return res.status(502).json({
        status: false,
        message: "DB Error Token.",
        error: {
          token_error: "DB Error Token."
        }
      });
    });


  });
}

module.exports = verifyToken;