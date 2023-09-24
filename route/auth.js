import express from "express"
import { login, register, logout, googleLogin, googleCallback, verifyEmail, verifyOtp } from "../controller/auth.js"
import { checkAuth } from "../middleware/auth.js"
import passport from "passport"
import "../passport.js"

const router = express.Router()
router.post("/login", login)
router.post("/register", register)
router.post("/verifyOtp", verifyOtp)
router.get("/check-auth", checkAuth)
router.get("/verifyEmail", verifyEmail)
router.get("/logout", logout)
router.get('/google', googleLogin)
router.get('/google/callback',
    passport.authenticate("google", { failureRedirect: "https://bookmanager2023.onrender.com/signin?error=emailNotFound" }),
    (req, res, next) => {
        req.session.user = req.user
        req.session.isAuthenicated = true
        req.session.save()
        console.log("google callback")
        res.redirect("https://bookmanager2023.onrender.com/signin?success=loginSuccess")
    }
)
router.get("/google/callback", googleCallback);

export default router