import mongoose, { Schema, Document, Model } from 'mongoose'

export interface Appointment extends Document {
  userId: string
  docId: string
  slotDate: string
  slotTime: string
  userData: Record<string, any>
  docData: Record<string, any>
  amount: number
  date: number
  cancelled: boolean
  payment: boolean
  isCompleted: boolean
}

const appointmentSchema = new Schema<Appointment>({
  userId: { type: String, required: true },
  docId: { type: String, required: true },
  slotDate: { type: String, required: true },
  slotTime: { type: String, required: true },
  userData: { type: Object as any, required: true },
  docData: { type: Object as any, required: true },
  amount: { type: Number, required: true },
  date: { type: Number, required: true },
  cancelled: { type: Boolean, default: false },
  payment: { type: Boolean, default: false },
  isCompleted: { type: Boolean, default: false },
})

const appointmentModel: Model<Appointment> = mongoose.models.appointment || mongoose.model<Appointment>('appointment', appointmentSchema)
export default appointmentModel
