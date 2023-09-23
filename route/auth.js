import express from "express"
import {login,register,logout,googleLogin,googleSuccess,googleFailed,googleCallback} from "../controller/auth.js"

const router = express.Router()
router.post("/login",login)
router.post("/register",register)
router.post("/logout",logout)
router.post("/google",googleLogin)
router.post("/google/success",googleSuccess)
router.post("/google/failed",googleFailed)
router.post("/google/callback",googleCallback)

export default router