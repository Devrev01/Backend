import passport from "passport"
import User from "../model/User.js"
import bcrypt from "bcryptjs"
import otpGenerator from "otp-generator"
import emailjs from "@emailjs/nodejs"
import dotenv from "dotenv"
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
        req.session.isAuthenicated = true
        res.status(201).json({ status: "success", newUser })
        next()
    } catch (err) {
        res.status(500).json({ status: "failed", err })
    }
}

export const login = async (req, res) => {
    const { email, password } = req.body
    try {
        const isCorrectPassword = await bcrypt.compare(password, req.user.password)
        const user = await User.findOne({ email })
        if (!user) return res.status(400).json({ status: "failed", msg: "User not found" })
        if (!isCorrectPassword) return res.status(400).json({ status: "failed", msg: "Invalid credentials" })
        req.session.user = user
        req.session.isAuthenicated = true
        return res.status(200).json({ status: "success", user })
    } catch (err) {
        return res.json(500).json({ status: "failed", err })
    }
}

export const logout = async (req, res) => {
    try {
        req.session.destroy()
        return res.status(200).json({ status: "success", msg: "Logout successfully" })
    } catch (err) {
        return res.status(500).json(err)
    }
}

export const googleLogin = async (req, res, next) => {
    passport.authenticate("google", { scope: ["profile", "email"] })
}

export const googleSuccess = async (req, res) => {
    const { email } = req.user
    const user = new User({ email })
    if (!user) return res.status(400).json({ status: "failed", msg: "User not found" })
    return res.status(200).json({ status: "success", user: req.user })
}

export const googleFailed = async (req, res, next) => {
    return res.status(401).json({ status: "failed", user: null })
}

export const googleCallback = async (req, res, next) => {
    passport.authenticate("google", { failureRedirect: "/google/failed", successRedirect: "/google/success" })
}

export const verifyEmail = async (req, res, next) => {
    const user = await User.findOne({ email: req.session.user.email })
    if (!user) return res.status(400).json({ status: "failed", msg: "User not found" })
    const otp = otpGenerator.generate(4, { lowerCaseAlphabets: false, upperCaseAlphabets: false, specialChars: false })
    req.session.otp = otp
    req.session.otpExpireAt = Date.now() + 600000
    try {
        await emailjs.send("service_oi7m1hm", "template_41rmm2f", {
            to_email: req.session.user.email,
            to_name: req.session.user.fullName,
            OTP: req.session.otp,
        }, { publicKey: process.env.PUBLIC_KEY, privateKey: process.env.PRIVATE_KEY });
        return res.status(200).json({ message: 'Email sent successfully', otpId: userotp._id })
    }
    catch (err) {   
        return res.status(200).json(err)
    }   
}

export const verifyOtp = async (req, res, next) => {
    const { otp } = req.body
    if (Date.now() > req.session.otpExpireAt){
        req.session.otp = null
        return res.status(419).json({status:"failed",msg:"Timeout"})
    }
    if (otp === req.session.otp){
        const user = new User({email:req.session.user.email})
        user.isVerified = true
        await user.save()
        return res.status(200).json({status:"success",msg:"Email verified"})
    }
    else return res.status(400).json({status:"failed",msg:"Invalid OTP"})
}