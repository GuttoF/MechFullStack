import mongoose, { Schema, Document, Model } from 'mongoose'

export interface Doctor extends Document {
  name: string
  email: string
  password: string
  image: string
  speciality: string
  degree: string
  experience: string
  about: string
  available: boolean
  fees: number
  slots_booked: Record<string, string[]>
  address: Record<string, any>
  date: number
}

const doctorSchema = new Schema<Doctor>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  image: { type: String, required: true },
  speciality: { type: String, required: true },
  degree: { type: String, required: true },
  experience: { type: String, required: true },
  about: { type: String, required: true },
  available: { type: Boolean, default: true },
  fees: { type: Number, required: true },
  slots_booked: { type: Object as any, default: {} },
  address: { type: Object as any, required: true },
  date: { type: Number, required: true },
}, { minimize: false })

const doctorModel: Model<Doctor> = mongoose.models.doctor || mongoose.model<Doctor>('doctor', doctorSchema)
export default doctorModel
