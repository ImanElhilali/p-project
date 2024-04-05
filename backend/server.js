import express from 'express'
import cors from 'cors'
import path from 'path'
import dotenv from 'dotenv'
import connectDB from './config/db.js'
import companyRoutes from './routes/companyRoutes.js'
import localRoutes from './routes/localRoutes.js'
import userRoutes from './routes/userRoutes.js'
import agentRoutes from './routes/agentRoutes.js'
import pumpRoutes from './routes/pumpRoutes.js'
import pumpTypeRoutes from './routes/pumpTypeRoutes.js'
import repositoryRoutes from './routes/repositoryRoutes.js'
import transactionRoutes from './routes/transactionRoutes.js'
import cookieParser from 'cookie-parser'
import { notFound, errorHandler } from './middleware/errorMiddleware.js'

dotenv.config()

connectDB()

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(cors({ origin: 'https://p-project.onrender.com', credentials: true }))

app.use('/api/companies', companyRoutes)
app.use('/api/locals', localRoutes)
app.use('/api/users', userRoutes)
app.use('/api/agents', agentRoutes)
app.use('/api/pumps', pumpRoutes)
app.use('/api/pumpTypes', pumpTypeRoutes)
app.use('/api/repositories', repositoryRoutes)
app.use('/api/transactions', transactionRoutes)

app.use(notFound)
app.use(errorHandler)

// /serve static assets if in production
if (process.env.NODE_ENV === 'production') {
  //     //set static folder
  app.use(express.static('frontend/build'))

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html'))
  })
}

const port = process.env.PORT || 5001

app.listen(port, () => console.log(`Server listen on port ${port}`))
