import { v2 as cloudinary } from 'cloudinary'

const connectCloudinary = async (): Promise<void> => {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME as string,
    api_key: process.env.CLOUDINARY_API_KEY as string,
    api_secret: process.env.CLOUDINARY_SECRET_KEY as string,
  })
}

export default connectCloudinary
