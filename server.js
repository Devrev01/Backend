import express from "express"
import session from "express-session"
import MongoStore from "connect-mongo"
import { connect } from "./config/database.js"
import mongoose from "mongoose"
import passport from "passport"
import authRoute from "./route/auth.js"
import cors from "cors"

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
}))

mongoose.connection.on("disconnected", () => {
    console.log("MongoDB disconnected")
})

mongoose.connection.on("connected", () => {
    console.log("MongoDB connected")
    app.use(session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        cookie: {
            sameSite: "lax",
            secure: false,
            maxAge:24*60*60*1000
        },
        store: MongoStore.create({ client: mongoose.connection.getClient(), ttl: 24*60*60*1000, autoRemove: 'native'})
    }))
    app.use(passport.initialize());
    app.use(passport.session());
    app.use('/api/auth', authRoute)
})


app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`)
    connect()
})