import express from "express"
import { login, register, logout, googleLogin, googleCallback, verifyEmail, verifyOtp, setSession } from "../controller/auth.js"
import { checkAuth } from "../middleware/auth.js"

const router = express.Router()
router.post("/login", login)
router.post("/register", register)
router.post("/verifyOtp", verifyOtp)
router.get("/check-auth", checkAuth)
router.get("/verifyEmail", verifyEmail)
router.get("/logout", logout)
router.get('/google',googleLogin)
router.get('/setSession/:email',setSession)
router.get("/google/callback",googleCallback );

export default router