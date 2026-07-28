const User = require("../models/user");
const OTP = require("../models/otp");
const { hashPassword, comparePassword } = require("../utils/hash");
const generateToken = require("../utils/jwt");
const sendEmail = require("../services/email.service");
const crypto = require("crypto");

const signup = async (req, res) => {
    try {

        const {
            fullname,
            email,
            password,
            confirmPassword,
            roles
        } = req.body;

        if (!fullname || !email || !password || !confirmPassword) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        if (password !== confirmPassword) {
            return res.status(400).json({
                success: false,
                message: "Passwords do not match"
            });
        }

        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                message: "Password must contain at least 6 characters"
            });
        }



        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: "Email already exists"
            });
        }

        const hashedPassword = await hashPassword(password);


        const user = await User.create({
            name: fullname,
            email,
            password: hashedPassword,
            role: roles || "candidate"
        });

        const token = generateToken(user);

        res.cookie("token", token, {
            httpOnly: true,
            secure: false,       
            sameSite: "lax",
            maxAge: 24 * 60 * 60 * 1000
        });

        await sendEmail(
            user.email,
            "Welcome to Ujwal Radiant Vision",
            `
            <h2>Welcome ${user.name}</h2>

            <p>Your account has been created successfully.</p>

            <p>
                You can now login and access the
                <b>Online Skill Assessment and Digital Certification Platform</b>.
            </p>

            <br>

            <p>Regards,</p>
            <h3>Ujwal Radiant Vision Team</h3>
            `
        );


        const userResponse = user.toObject();
        delete userResponse.password;


        return res.status(201).json({
            success: true,
            message: "Registration Successful",
            token,
            user: userResponse
        });

    } catch (err) {

        console.log(err);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });

    }
};

const login = async (req, res) => {

    const { email, password, role } = req.body;

    if (!email || !password || !role) {

        return res.status(400).json({
            message: "All fields required",
        });

    }

    try {

        const user = await User.findOne({
            email,
            role,
        });

        if (!user) {

            return res.status(401).json({
                message: "Invalid Credentials",
            });

        }

        const isMatch = await comparePassword(
            password,
            user.password
        );

        if (!isMatch) {

            return res.status(401).json({
                message: "Invalid Credentials",
            });

        }

        const token = generateToken(user);

        res.cookie("token", token, {

            httpOnly: true,

            secure: false,

            sameSite: "lax",

            maxAge: 7 * 24 * 60 * 60 * 1000,

        });
        const userResponse = user.toObject();
        delete userResponse.password;

        res.status(200).json({

            message: "Login Successful",

            user,

        });

    }

    catch (err) {

        res.status(500).json({
            message: err.message,
        });

    }

};

const forgetPassword = async (req, res) => {

    try {

        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                success: false,
                message: "Email is required"
            });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        // generate 6 digit otp
        const otp = Math.floor(
            100000 + Math.random() * 900000
        ).toString();

        // remove old otp
        await OTP.deleteMany({ email });

        // save new otp
        await OTP.create({

            email,

            otp,

            expireAt: new Date(Date.now() + 5 * 60 * 1000)

        });

        await sendEmail(

            email,

            "Password Reset OTP",

            `
            <h2>Password Reset</h2>

            <p>Your OTP is</p>

            <h1>${otp}</h1>

            <p>OTP expires in 5 minutes.</p>
            `
        );

        return res.status(200).json({

            success: true,

            message: "OTP Sent Successfully"

        });

    }

    catch(err){

        return res.status(500).json({

            success:false,

            message:err.message

        });

    }

};

const verifyOTP = async (req,res)=>{

    try{

        const {email,otp}=req.body;

        if(!email || !otp){

            return res.status(400).json({

                success:false,

                message:"Email and OTP required"

            });

        }

        const data=await OTP.findOne({email,otp});

        if(!data){

            return res.status(400).json({

                success:false,

                message:"Invalid OTP"

            });

        }

        if(data.expireAt < new Date()){

            await OTP.deleteOne({_id:data._id});

            return res.status(400).json({

                success:false,

                message:"OTP Expired"

            });

        }

        return res.status(200).json({

            success:true,

            message:"OTP Verified"

        });

    }

    catch(err){

        res.status(500).json({

            success:false,

            message:err.message

        });

    }

};

const resetPassword = async(req,res)=>{

    try{

        const {

            email,

            otp,

            password,

            confirmPassword

        }=req.body;

        if(!email || !otp || !password || !confirmPassword){

            return res.status(400).json({

                success:false,

                message:"All fields required"

            });

        }

        if(password!==confirmPassword){

            return res.status(400).json({

                success:false,

                message:"Passwords do not match"

            });

        }

        const otpData=await OTP.findOne({email,otp});

        if(!otpData){

            return res.status(400).json({

                success:false,

                message:"Invalid OTP"

            });

        }

        if(otpData.expireAt < new Date()){

            return res.status(400).json({

                success:false,

                message:"OTP Expired"

            });

        }

        const hashedPassword=await hashPassword(password);

        await User.findOneAndUpdate(

            {email},

            {

                password:hashedPassword

            }

        );

        await OTP.deleteOne({_id:otpData._id});

        return res.status(200).json({

            success:true,

            message:"Password Changed Successfully"

        });

    }

    catch(err){

        res.status(500).json({

            success:false,

            message:err.message

        });

    }

};

const logout = (req,res)=>{

    res.clearCookie("token");

    return res.status(200).json({

        success:true,

        message:"Logout Successful"

    });

};

module.exports = {
    signup,
    login,
    forgetPassword,
    verifyOTP,
    resetPassword,
    logout
};