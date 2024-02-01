import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import userRoutes from './routes/user.route.js'
import authRoutes from './routes/auth.route.js'
import listingRoutes from './routes/listing.route.js'
import cookieParser from 'cookie-parser'
import path from 'path'

dotenv.config()
mongoose.connect(process.env.MONGO).then(() => {
    console.log('connected to MDB')
}).catch((e) => {
    console.log(e)
})

// const __dirname=path.resolve()

const app = express()

// app.use(express.static(path.join(__dirname,'/JWT_Project/dist')))
// app.get('*',(req,res)=>{
// res.sendFile(path.join(__dirname,'JWT_Project','dist','index.html'))
// })
//
app.use(express.json())
app.use(cookieParser())
app.listen(3000, () => {
    console.log('server run on port 3000')
})

app.use("/api/user", userRoutes)
app.use("/api/auth", authRoutes)
app.use("/api/listing", listingRoutes)


app.use((err, req, res,next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal server error';
    return res.status(statusCode).json({
        success: false,
        message,
        statusCode
    })
})