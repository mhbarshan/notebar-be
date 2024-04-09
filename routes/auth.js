const express = require("express");
const router = express.Router();
const User = require("../model/User");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");
var fetchUser = require("../middleware/fetchUser");


const JWT_SECRET = "MyProject$one";

//Route1: Create a User using: POST "/api/auth/createuser" .Doesn't require auth no login required

router.post(
  "/createuser",
  [
    body("email", "Enter a valid email").isEmail(),
    body("name", "Enter a valid name").isLength({ min: 3 }),
    body("password", "Password must be not less than 6 characters.").isLength({
      min: 6,
    }),
  ],
  //if errors occured then return error
  async (req, res) => {
    // const user = User(req.body)
    // user.save()
    // let success = false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    //check email already exist
    try {
      let user = await User.findOne({ email: req.body.email });
      if (user) {
        return res.status(400).json({ success:false, error: "Email already Exist" });
      }
      const salt = await bcrypt.genSalt(10);
      const securedPass = await bcrypt.hash(req.body.password, salt);
      user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: securedPass,
      });
      //     .then((user) => res.json(user))
      //     .catch(err=>console.log(err))
      //     res.json()
      //     res.send(req.body);
      const data = {
        user: {
          id: user.id,
        },
      };
      const authToken = jwt.sign(data, JWT_SECRET);
    //  const success = true
      //  console.log(jwtData)

      res.json({success:true,authToken});
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal server error");
    }
  }
);
//Route2: Authenticate user
router.post(
  "/login",
  [
    body("email", "Enter a valid email").isEmail(),
    body("password", "Password Can not be blank.").exists(),
    body("password", "Password must be not less than 6 characters.").isLength({
      min: 6,
    }),
  ],
  //if errors occured then return error
  async (req, res) => {
    // let success = false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { email, password } = req.body;
    try {
      let user = await User.findOne({ email });
      if (!user) {
        return res
          .status(400)
          .json({ success:false, error: "Please try to login with valid credentials." });
      }

      const passwordCompare = await bcrypt.compare(password, user.password);
      if (!passwordCompare) {
       
        return res
          .status(400)
          .json({ success:false, error: "Please try to login with valid credentials."});
      }

      const data = {
        user: {
          id: user.id,
        },
      };
      const authToken = jwt.sign(data, JWT_SECRET);
      // success = true
      res.json({success:true,authToken});
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal server error");
    }
  }
);
// Route3: Get User details using: POST "/api/auth/getuser".
router.post(
  "/getuser", fetchUser,
  //if errors occured then return error
  async (req, res) => {
     
    try {
      const userId = req.user.id;
      const user = await User.findById(userId).select("-password");
      res.send(user)
    } catch (error) {
      console.error(error.message);

      res.status(500).send("Internal server error");
    }
  }
);
module.exports = router;
