import express from "express";
import session from "express-session";
import MongoStore from "connect-mongo";
import { connect } from "./config/database.js";
import passport from "passport";
import authRoute from "./route/auth.js";
import cartRoute from "./route/cart.js";
import cors from "cors";

const app = express();

// Middleware Configurations
app.set("trust proxy", 1);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin: "https://bookmanager2023.onrender.com",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
}));

// Connect to MongoDB
const initializeDatabase = async () => {
    try {
        await connect();
        console.log("MongoDB connected");
    } catch (error) {
        console.error("Failed to connect to MongoDB:", error);
        process.exit(1);  // Exit the process with a failure code
    }
}

// Initialize Session
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        sameSite: "none",
        secure: true,
        httpOnly: false,
        maxAge: 24 * 60 * 60 * 1000
    },
    store: MongoStore.create({ 
        mongoUrl: process.env.MONGO_URI, 
        ttl: 24 * 60 * 60 * 1000, 
        autoRemove: 'native'
    })
}));

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use('/api/auth', authRoute);
app.use('/api/cart', cartRoute);

// Start the server
const startServer = async () => {
    await initializeDatabase();
    app.listen(process.env.PORT, () => {
        console.log(`Server is running on port ${process.env.PORT}`);
    });
}

startServer();