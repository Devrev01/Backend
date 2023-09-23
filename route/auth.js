import express from "express"
import {login,register,logout,googleLogin,googleSuccess,googleFailed,googleCallback, verifyEmail, verifyOtp} from "../controller/auth.js"
import { checkAuth } from "../middleware/auth.js"

const router = express.Router()
router.post("/login",login)
router.post("/register",register)
router.post("/verifyOtp",verifyOtp)
router.get("/check-auth",checkAuth)
router.get("/verifyEmail",verifyEmail)
router.get("/logout",logout)
router.get("/google",googleLogin)
router.get("/google/success",googleSuccess)
router.get("/google/failed",googleFailed)
router.get("/google/callback",googleCallback)

export default router