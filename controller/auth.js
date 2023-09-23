import User from "../model/User.js"
import bcrypt from "bcryptjs"

export const register = async (req, res) => {
    const { fullName, email, password } = req.body
    try {
        const salt = bcrypt.genSaltSync(10)
        const hashedPassword = bcrypt.hashSync(password, salt)
        const newUser = new User({
            fullName,
            email,
            password:hashedPassword
        })
        await newUser.save()
        res.status(201).json({status:"success", newUser })
    } catch (err) {
        res.status(500).json({status:"failed",err})
    }
}

export const login = async (req, res) => {
    const {email,password} = req.body
    try{
        const isCorrectPassword = await bcrypt.compare(password,req.user.password)
        const user = await User.findOne({email})
        if(!user) return res.status(400).json({msg:"User not found"})
        if(!isCorrectPassword) return res.status(400).json({msg:"Invalid credentials"})
        req.session.user = user
        req.session.isAuthenicated = true
        return res.status(200).json({status:"success",user})
    }catch(err){
        return res.json(500).json({status:"failed",err})
    }
}

export const logout = async(req,res)=>{
    try{
        req.session.destroy()
        return res.status(200).json({msg:"Logout success"})
    }catch(err){
        return res.status(500).json(err)
    }
}

export const googleLogin = async(req,res,next)=>{
    passport.authenticate("google", { scope: ["profile", "email"] })
}

export const googleSuccess = async(req,res)=>{
    const {email} = req.user
    const user = new User({email})
    if(!user) return res.status(400).json({status:"failed",msg:"User not found"})
    return res.status(200).json({status:"success",user:req.user})
}

export const googleFailed = async(req,res,next)=>{
    return res.status(401).json({status:"failed",user:null})
}

export const googleCallback = async(req,res,next)=>{
    passport.authenticate("google", { failureRedirect: "/google/failed", successRedirect: "/google/success" })
}

