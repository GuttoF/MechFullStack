import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDB from './config/mongodb.js'
import connectCloudinary from './config/cloudinary.js'
import userRouter from './routes/userRoute.js'
import doctorRouter from './routes/doctorRoute.js'
import adminRouter from './routes/adminRoute.js'
import swaggerUi from 'swagger-ui-express'
import swaggerDoc from './swagger.json' assert { type: 'json' }

const app = express()
const port = process.env.PORT || 4000
connectDB()
connectCloudinary()

app.use(express.json())
app.use(cors())

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDoc))

app.use('/api/user', userRouter)
app.use('/api/admin', adminRouter)
app.use('/api/doctor', doctorRouter)

app.get('/', (req, res) => {
  res.send('API Working')
})

app.listen(Number(port), '0.0.0.0', () => console.log(`Server started on PORT:${port}`))
