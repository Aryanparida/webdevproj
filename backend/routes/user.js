const router = require("express").Router();
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt= require("jsonwebtoken");
const {authenticateToken} =require("./userAuth")

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
            password:hashPass,
            address: address
        });
        await newUser.save();
        return res.status(200).json({message:"signup successfully"});
        

    }catch (error) {
        res.status(500).json({message:"internal server error"});
    }
});

//signin 
router.post("/sign-in",async(req,res) => {

    try{
        const {username,password}= req.body;
        const existingUser = await User.findOne({username});
        if(!existingUser){
            res.status(400).json({message:"invalid credentials"});
        }

        await bcrypt.compare(password,existingUser.password,(err,data)=>{
            if(data){
                const authClaims=[
                    {name:existingUser.username},
                    {role:existingUser.role},
                ];
                const token= jwt.sign({authClaims},"bookStore123",{
                    expiresIn:"30d",
                })
                res.status(200).json({
                    id:existingUser._id,
                    role:existingUser.role,
                    token:token
                });
            }
            else{
                res.status(400).json({message:"invalid credentia"});
            }
        });

    }catch (error) {
        res.status(500).json({message:"internal server error"});
    }
});
// get user-information
router.get("/get-user-information",authenticateToken, async (req,res)=>{
    try{
        const{id}= req.headers;
        const data = await User.findById

    }catch (error){
        res.status(500).json({message:"internal server error"});

    }
}) 
module.exports = router;