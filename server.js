import express from "express"
import session from "express-session"
import MongoStore from "connect-mongo"
import { connect } from "./config/database.js"
import mongoose from "mongoose"
import passport from "passport"

const app = express()

app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({mongoUrl: process.env.MONGO_URI})
}))

app.use(passport.initialize());
app.use(passport.session());


mongoose.connection.on("disconnected",()=>{
    console.log("MongoDB disconnected")
})

mongoose.connection.on("connected",()=>{
    console.log("MongoDB connected")
})

app.listen(process.env.PORT,()=>{
    console.log(`Server is running on port ${process.env.PORT}`)
    connect()
})