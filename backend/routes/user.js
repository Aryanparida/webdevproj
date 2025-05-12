const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const { authenticateToken } = require("./userAuth");
//signup
router.post("/sign-up",async(req,res) => {

    try{
        const{username,email,password,address} =req.body;
        //check the username is more than 4
        if(username.length < 4){
            return res.status(400).json({message: "username length should b more than 3"});
        }
        //check user name alredy exits
        const existingusername = await User.findOne({username: username});
        if(existingusername){
            return res.status(400).json({message:"username alredy exits"});
        }
        //check email alredy exits
        const existingemail = await User.findOne({email: email});
        if(existingemail){
            return res.status(400).json({message:"email alredy exits"});
        }
        //check for the password 
        if(password.length <= 5){
            return res
            .status(400)
            .json({message: "password length should b more than 5"});
        }
        const hashPass =  await bcrypt.hash(password,10)
        const newUser= new User({
            username: username,
            email: email,
            password: hashPass,
            address: address
        });
        await newUser.save();
        return res.status(200).json({message:"signup successfully"});
        

    }catch (error) {
        res.status(500).json({message:"internal server error"});
    }
});
//login
router.post("/login", async (req, res) => {
    try {
      const { username, password } = req.body;
      const user = await User.findOne({ username });
      if (!user) {
        return res.status(400).json({ message: "Invalid Credentials" });
      }
      bcrypt.compare(password, user.password, (err, data) => {
        if (data) {
          const authClaims = [
            { name: user.username },
            { role: user.role },
            { jti: jwt.sign({}, "bookStore123") },
          ];
          const token = jwt.sign({ authClaims }, "bookStore123", {
            expiresIn: "30d",
          });
  
          res.json({
            _id: user._id,
            role: user.role,
            token,
          });
        } else {
          return res.status(400).json({ message: "Invalid credentials" });
        }
      });
    } catch (error) {
      return res.status(400).json({ message: "Internal Error" });
    }
  });
  
  //Get Users (individual) Profile Data
  router.get("/getUserData", authenticateToken, async (req, res) => {
    try {
      const { id } = req.headers;
  
      const data = await User.findById(id);
      return res.status(200).json(data);
    } catch (error) {
      return res.status(500).json({ message: "An error occurred" });
    }
  });
  
  //Update address
  router.put("/update-user-address", authenticateToken, async (req, res) => {
    try {
      const { id } = req.headers;
      const { address } = req.body;
      await User.findByIdAndUpdate(id, { address });
      return res.status(200).json({
        status: "Success",
        message: "Address updated successfully",
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "An error occurred" });
    }
  });
module.exports = router; 