import { v2 as cloudinary } from 'cloudinary'

const connectCloudinary = async (): Promise<void> => {
  const cloudName = process.env.CLOUDINARY_NAME
  const apiKey = process.env.CLOUDINARY_API_KEY
  const apiSecret = process.env.CLOUDINARY_SECRET_KEY

  if (cloudName && apiKey && apiSecret) {
    cloudinary.config({
      cloud_name: cloudName,
      api_key: apiKey,
      api_secret: apiSecret,
    })
    console.log('Cloudinary configured')
  } else {
    console.warn('Cloudinary not configured - image uploads will fail')
  }
}

export default connectCloudinary
