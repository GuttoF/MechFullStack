import mongoose from 'mongoose'

const connectDB = async (): Promise<void> => {
  const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017'
  const dbName = process.env.MONGODB_DB_NAME || 'mech'
  const connectionString = `${mongoUri}/${dbName}`
  
  mongoose.connection.on('connected', () => console.log('Database Connected'))
  mongoose.connection.on('error', (err) => console.error('Database connection error:', err))
  
  await mongoose.connect(connectionString)
}

export default connectDB
