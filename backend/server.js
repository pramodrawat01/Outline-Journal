import express from 'express'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import { connectDB } from './config/db.js'
import authRoutes from "./routes/auth.routes.js";


dotenv.config()


const app = express()
const PORT = process.env.PORT || 5000

// middlewares
app.use(express.json())
app.use(cookieParser())
app.use(
    cors({
        origin : process.env.CLIENT_URL || "http://localhost:5173",
        credentials : true,
    })
)

// routes
app.use('/api/auth', authRoutes)


app.get("/", (req, res) => {
    res.send("outline api is running")
})

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
});