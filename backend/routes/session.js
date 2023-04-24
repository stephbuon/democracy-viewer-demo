const express = require("express");
const router = express.Router();

const control = require("../controllers/users");
const { authenticateJWT } = require("../middleware/authentication");
const passport = require("../util/passport");

// Route to create a session and get access token
router.post('/', async (req, res, next) => {
  try {
      const result = await control.authenticateUser(req.models.users, req.body);
      if (result === null) {
        res.status(401).json({message: "Invalid credentials"});
      } else {
        res.status(201).json(result);
      }
  } catch (err) {
      console.error('Failed to log in:', err);
      res.status(500).json({ message: err.toString() });
  }
  next();
});


// router.post('/sso',
//   passport.authenticate('saml', {
//     successRedirect: '/',
//     failureRedirect: '/login',
//   })
// );

// // Route to create a session using SSO
// router.post('/sso', async (req, res, next) => {
//   try {
//       passport.authenticate('saml', {
//           successRedirect: '/',
//           failureRedirect: '/login',
//       });
//   } catch (err) {
//       console.error('Failed to log in with SAML:', err);
//       res.status(500).json({ message: err.toString() });
//   }
//   next();
// });
  
// Route to get user data from token
router.get('/', authenticateJWT, async (req, res, next) => {
  try {
    res.status(200).json(req.user);
  } catch (err) {
    console.error("Failed to get session:", err);
    res.status(500).json({message: err.toString()});
  }
  next();
});
  
module.exports = router;