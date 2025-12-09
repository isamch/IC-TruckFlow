import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import createError from 'http-errors'
import errorHandler from './src/middleware/errorHandler.js'
import cookieParser from "cookie-parser";
import mainRouter from './src/routes/index.js'

const app = express()

// Core Middleware
app.use(cors())
app.use(helmet())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser());



// Main Router
app.use("/api", mainRouter)


// 404 Handler
app.use((req, res, next) => {
  next(createError.NotFound('The route you requested does not exist.'))
})

// Global Error Handler
app.use(errorHandler)

export default app