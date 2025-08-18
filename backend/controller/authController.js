import User from "../model/userModel.js";
import validator from "validator";
import bcrypt from "bcryptjs";
import { genToken, genToken1 } from "../config/token.js";

export const registration = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existUser = await User.findOne({ email });
    if (existUser) {
      return res.status(400).json({ message: "user already exist" });
    }
    if (!validator.isEmail(email)) {
      return res.status(400).json({ message: "enter a valid email" });
    }
    if (password.length < 8) {
      return res.status(400).json({ message: "Enter Stronge Pasword" });
    }
    let hashPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ email, name, password: hashPassword });
    let token = await genToken(user._id);
    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    return res.status(201).json(user);
  } catch (error) {
    console.log("register error");
    return res.status(500).json({ message: `Registration error ${error}` });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "incorrect password" });
    }
    let token = await genToken(user._id);
    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    return res.status(201).json(user);
  } catch (error) {
    console.log("Login error:", error);
    return res.status(500).json({ message: "Login failed" });
  }
};



export const logOut = async(req, res)=>{

  try{
  res.clearCookie("token")
  return res.status(200).json({message: "logOut is successful"})

  }catch(error){

 console.log("Logout error:", error);
 return res.status(500).json({ message: `LogOut failed ${error} ` });

  }
}

export const googleLogin = async(req,res)=>{
  try{


const {name, email} = req.body;
const user = await User.findOne({ email });
    if (!user) {
     user = await User.create({name, email})
    }
    
    let token = await genToken(user._id);
    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    return res.status(200).json(user);


  }  catch(error){
        console.log("GooleLogin error:", error);
    return res.status(500).json({ message: `GoogleLogin failed ${error}` });
 

    }
  }



export const adminLogin = async (req,res) => {
    try {
        let {email , password} = req.body
        if(email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD){
        let token = await genToken1(email)
        res.cookie("token",token,{
        httpOnly:true,
        secure:false,
        sameSite: "Strict",
        maxAge: 1 * 24 * 60 * 60 * 1000
    })
    return res.status(200).json(token)
        }
        return res.status(400).json({message:"Invaild creadintials"})

    } catch (error) {
        console.log("AdminLogin error")
    return res.status(500).json({message:`AdminLogin error ${error}`})
        
    }
    
}

