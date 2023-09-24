import passport from "passport"
import User from "../model/User.js"
import bcrypt from "bcryptjs"
import otpGenerator from "otp-generator"
import emailjs from "@emailjs/nodejs"
import dotenv from "dotenv"
import '../passport.js'
dotenv.config()

export const register = async (req, res) => {
    const { fullName, email, password } = req.body
    try {
        const salt = bcrypt.genSaltSync(10)
        const hashedPassword = bcrypt.hashSync(password, salt)
        const user = await User.findOne({ email })
        if (user) return res.status(400).json({ status: "failed", msg: "User already exists" })
        const newUser = new User({
            fullName,
            email,
            password: hashedPassword
        })
        await newUser.save()
        req.session.user = newUser
        req.session.isAuthenticated = true
        await req.session.save()
        return res.status(201).json({ status: "success", newUser })
    } catch (err) {
        res.status(500).json({ status: "failed", err })
    }
}

export const login = async (req, res, next) => {
    const { email, password } = req.body
    try {
        const user = await User.findOne({ email })
        if (!user) return res.status(400).json({ status: "failed", msg: "User not found" })
        const isCorrectPassword = await bcrypt.compare(password, user.password)
        if (!isCorrectPassword) return res.status(400).json({ status: "failed", msg: "Invalid credentials" })
        req.session.user = user
        req.session.isAuthenticated = true
        await req.session.save()
        return res.status(200).json({ status: "success", user })
    } catch (err) {
        return res.json(500).json({ status: "failed", err })
    }
}

export const logout = async (req, res) => {
    try {
        req.session.isAuthenticated = false
        req.session.destroy((err) => {
            if (err) return res.status(500).json(err)
            console.log("session destroyed")
        })
        return res.status(200).json({ status: "success", msg: "Logout successfully" })
    } catch (err) {
        return res.status(500).json(err)
    }
}

export const setSession = async (req, res, next) => {
    try {
        const dbUser = await User.findOne({ email: req.params.email });
        if (!dbUser) return res.status(400).json({ status: "failed", msg: "User not found" });

        req.session.user = dbUser;
        req.session.isAuthenticated = true;
        await req.session.save();
        console.log(req.session.user)
        return res.status(200).json({ status: "success", msg: "Session set successfully" })
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const googleLogin = async (req, res, next) => {
    console.log("googlelogin")
    passport.authenticate("google", { scope: ["profile", "email"] })(req, res, next)
}


export const googleCallback = async (req, res, next) => {
    console.log("google callback");
    
    passport.authenticate("google", async (err, user, info) => {
        if (err) return res.redirect("https://bookmanager2023.onrender.com/signin?error=emailNotFound")
        return res.redirect("https://bookmanager2023.onrender.com/signin?email="+info.emails[0].value)
    })(req, res, next);
};

export const verifyEmail = async (req, res, next) => {
    const user = await User.findOne({ email: req.session.user.email })
    if (!user) return res.status(400).json({ status: "failed", msg: "User not found" })
    const otp = otpGenerator.generate(4, { lowerCaseAlphabets: false, upperCaseAlphabets: false, specialChars: false })
    req.session.otp = otp
    req.session.otpExpireAt = Date.now() + 600000
    await req.session.save()
    try {
        await emailjs.send("service_oi7m1hm", "template_41rmm2f", {
            to_email: req.session.user.email,
            to_name: req.session.user.fullName,
            OTP: req.session.otp,
        }, { publicKey: process.env.PUBLIC_KEY, privateKey: process.env.PRIVATE_KEY });
        return res.status(200).json({ status: "success", msg: "OTP sent" })
    }
    catch (err) {
        return res.status(200).json(err)
    }
}

export const verifyOtp = async (req, res, next) => {
    const { otp } = req.body
    if (Date.now() > req.session.otpExpireAt) {
        req.session.otp = null
        return res.status(419).json({ status: "failed", msg: "Timeout" })
    }
    if (otp === req.session.otp) {
        const user = await User.findOne({ email: req.session.user.email })
        user.isVerified = true
        await user.save()
        return res.status(200).json({ status: "success", msg: "Email verified" })
    }
    else return res.status(400).json({ status: "failed", msg: "Invalid OTP" })
}