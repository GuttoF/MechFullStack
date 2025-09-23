import { Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import appointmentModel from '../models/appointmentModel.js'
import doctorModel from '../models/doctorModel.js'
import bcrypt from 'bcrypt'
import validator from 'validator'
import { v2 as cloudinary } from 'cloudinary'
import userModel from '../models/userModel.js'

export const loginAdmin = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body as any
    if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
      const token = jwt.sign(email + password, process.env.JWT_SECRET as string)
      res.json({ success: true, token })
    } else {
      res.json({ success: false, message: 'Credenciais inválidas' })
    }
  } catch (error: any) {
    console.log(error)
    res.json({ success: false, message: error.message })
  }
}

export const appointmentsAdmin = async (_req: Request, res: Response) => {
  try {
    const appointments = await appointmentModel.find({})
    res.json({ success: true, appointments })
  } catch (error: any) {
    console.log(error)
    res.json({ success: false, message: error.message })
  }
}

export const appointmentCancel = async (req: Request, res: Response) => {
  try {
    const { appointmentId } = req.body as any
    await appointmentModel.findByIdAndUpdate(appointmentId, { cancelled: true })
    res.json({ success: true, message: 'Consulta cancelada' })
  } catch (error: any) {
    console.log(error)
    res.json({ success: false, message: error.message })
  }
}

export const addDoctor = async (req: Request, res: Response) => {
  try {
    const { name, email, password, speciality, degree, experience, about, fees, address } = req.body as any
    const imageFile = (req as any).file
    if (!name || !email || !password || !speciality || !degree || !experience || !about || !fees || !address) {
      return res.json({ success: false, message: 'Dados faltando' })
    }
    if (!validator.isEmail(email)) {
      return res.json({ success: false, message: 'Informe um e-mail válido' })
    }
    if ((password as string).length < 8) {
      return res.json({ success: false, message: 'Informe uma senha forte (8+ caracteres)' })
    }
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)
    const imageUpload = await cloudinary.uploader.upload(imageFile.path, { resource_type: 'image' })
    const imageUrl = imageUpload.secure_url
    const doctorData = {
      name,
      email,
      image: imageUrl,
      password: hashedPassword,
      speciality,
      degree,
      experience,
      about,
      fees,
      address: JSON.parse(address),
      date: Date.now(),
    }
    const newDoctor = new doctorModel(doctorData as any)
    await newDoctor.save()
    res.json({ success: true, message: 'Médico adicionado' })
  } catch (error: any) {
    console.log(error)
    res.json({ success: false, message: error.message })
  }
}

export const allDoctors = async (_req: Request, res: Response) => {
  try {
    const doctors = await doctorModel.find({}).select('-password')
    res.json({ success: true, doctors })
  } catch (error: any) {
    console.log(error)
    res.json({ success: false, message: error.message })
  }
}

export const adminDashboard = async (_req: Request, res: Response) => {
  try {
    const doctors = await doctorModel.find({})
    const users = await userModel.find({})
    const appointments = await appointmentModel.find({})
    const dashData = {
      doctors: doctors.length,
      appointments: appointments.length,
      patients: users.length,
      latestAppointments: appointments.reverse(),
    }
    res.json({ success: true, dashData })
  } catch (error: any) {
    console.log(error)
    res.json({ success: false, message: error.message })
  }
}
// Modificado em Sun Oct  5 15:01:51 -03 2025
