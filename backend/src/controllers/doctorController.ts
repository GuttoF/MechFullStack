import { Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import doctorModel from '../models/doctorModel.js'
import appointmentModel from '../models/appointmentModel.js'

export const loginDoctor = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body as any
    const user: any = await doctorModel.findOne({ email })
    if (!user) return res.json({ success: false, message: 'Credenciais inválidas' })
    const isMatch = await bcrypt.compare(password, user.password)
    if (isMatch) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET as string)
      res.json({ success: true, token })
    } else {
      res.json({ success: false, message: 'Credenciais inválidas' })
    }
  } catch (error: any) {
    console.log(error)
    res.json({ success: false, message: error.message })
  }
}

export const appointmentsDoctor = async (req: Request, res: Response) => {
  try {
    const { docId } = req.body as any
    const appointments = await appointmentModel.find({ docId })
    res.json({ success: true, appointments })
  } catch (error: any) {
    console.log(error)
    res.json({ success: false, message: error.message })
  }
}

export const appointmentCancel = async (req: Request, res: Response) => {
  try {
    const { docId, appointmentId } = req.body as any
    const appointmentData: any = await appointmentModel.findById(appointmentId)
    if (appointmentData && appointmentData.docId === docId) {
      await appointmentModel.findByIdAndUpdate(appointmentId, { cancelled: true })
      return res.json({ success: true, message: 'Consulta cancelada' })
    }
    res.json({ success: false, message: 'Consulta cancelada' })
  } catch (error: any) {
    console.log(error)
    res.json({ success: false, message: error.message })
  }
}

export const appointmentComplete = async (req: Request, res: Response) => {
  try {
    const { docId, appointmentId } = req.body as any
    const appointmentData: any = await appointmentModel.findById(appointmentId)
    if (appointmentData && appointmentData.docId === docId) {
      await appointmentModel.findByIdAndUpdate(appointmentId, { isCompleted: true })
      return res.json({ success: true, message: 'Consulta concluída' })
    }
    res.json({ success: false, message: 'Consulta cancelada' })
  } catch (error: any) {
    console.log(error)
    res.json({ success: false, message: error.message })
  }
}

export const doctorList = async (_req: Request, res: Response) => {
  try {
    const doctors = await doctorModel.find({}).select(['-password', '-email'])
    res.json({ success: true, doctors })
  } catch (error: any) {
    console.log(error)
    res.json({ success: false, message: error.message })
  }
}

export const changeAvailablity = async (req: Request, res: Response) => {
  try {
    const { docId } = req.body as any
    const docData: any = await doctorModel.findById(docId)
    await doctorModel.findByIdAndUpdate(docId, { available: !docData.available })
    res.json({ success: true, message: 'Disponibilidade atualizada' })
  } catch (error: any) {
    console.log(error)
    res.json({ success: false, message: error.message })
  }
}

export const doctorProfile = async (req: Request, res: Response) => {
  try {
    const { docId } = req.body as any
    const profileData = await doctorModel.findById(docId).select('-password')
    res.json({ success: true, profileData })
  } catch (error: any) {
    console.log(error)
    res.json({ success: false, message: error.message })
  }
}

export const updateDoctorProfile = async (req: Request, res: Response) => {
  try {
    const { docId, fees, address, available } = req.body as any
    await doctorModel.findByIdAndUpdate(docId, { fees, address, available })
    res.json({ success: true, message: 'Perfil atualizado' })
  } catch (error: any) {
    console.log(error)
    res.json({ success: false, message: error.message })
  }
}

export const doctorDashboard = async (req: Request, res: Response) => {
  try {
    const { docId } = req.body as any
    const appointments: any[] = await appointmentModel.find({ docId })
    let earnings = 0
    appointments.forEach((item) => {
      if (item.isCompleted || item.payment) earnings += item.amount
    })
    const patients: string[] = []
    appointments.forEach((item) => {
      if (!patients.includes(item.userId)) patients.push(item.userId)
    })
    const dashData = {
      earnings,
      appointments: appointments.length,
      patients: patients.length,
      latestAppointments: appointments.reverse(),
    }
    res.json({ success: true, dashData })
  } catch (error: any) {
    console.log(error)
    res.json({ success: false, message: error.message })
  }
}
// Modificado em Sun Oct  5 15:01:51 -03 2025
