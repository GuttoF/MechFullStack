import { Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import validator from 'validator'
import userModel from '../models/userModel.js'
import doctorModel from '../models/doctorModel.js'
import appointmentModel from '../models/appointmentModel.js'
import { v2 as cloudinary } from 'cloudinary'
import Stripe from 'stripe'
import Razorpay from 'razorpay'

const stripeInstance = process.env.STRIPE_SECRET_KEY ? new Stripe(process.env.STRIPE_SECRET_KEY as string) : null
const razorpayInstance = process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET ? new (Razorpay as any)({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
}) : null

export const registerUser = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body as any
    if (!name || !email || !password) {
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
    const userData = { name, email, password: hashedPassword }
    const newUser = new userModel(userData as any)
    const user = await newUser.save()
    const token = jwt.sign({ id: (user as any)._id }, process.env.JWT_SECRET as string)
    res.json({ success: true, token })
  } catch (error: any) {
    console.log(error)
    res.json({ success: false, message: error.message })
  }
}

export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body as any
    const user = await userModel.findOne({ email })
    if (!user) {
      return res.json({ success: false, message: 'Usuário não encontrado' })
    }
    const isMatch = await bcrypt.compare(password, (user as any).password)
    if (isMatch) {
      const token = jwt.sign({ id: (user as any)._id }, process.env.JWT_SECRET as string)
      res.json({ success: true, token })
    } else {
      res.json({ success: false, message: 'Credenciais inválidas' })
    }
  } catch (error: any) {
    console.log(error)
    res.json({ success: false, message: error.message })
  }
}

export const getProfile = async (req: Request, res: Response) => {
  try {
    const { userId } = req.body as any
    const userData = await userModel.findById(userId).select('-password')
    res.json({ success: true, userData })
  } catch (error: any) {
    console.log(error)
    res.json({ success: false, message: error.message })
  }
}

export const updateProfile = async (req: Request, res: Response) => {
  try {
    const { userId, name, phone, address, dob, gender } = req.body as any
    const imageFile = (req as any).file
    if (!name || !phone || !dob || !gender) {
      return res.json({ success: false, message: 'Dados faltando' })
    }
    await userModel.findByIdAndUpdate(userId, { name, phone, address: JSON.parse(address), dob, gender })
    if (imageFile) {
      const imageUpload = await cloudinary.uploader.upload(imageFile.path, { resource_type: 'image' })
      const imageURL = imageUpload.secure_url
      await userModel.findByIdAndUpdate(userId, { image: imageURL })
    }
    res.json({ success: true, message: 'Perfil atualizado' })
  } catch (error: any) {
    console.log(error)
    res.json({ success: false, message: error.message })
  }
}

export const bookAppointment = async (req: Request, res: Response) => {
  try {
    const { userId, docId, slotDate, slotTime } = req.body as any
    const docData: any = await doctorModel.findById(docId).select('-password')
    if (!docData?.available) {
      return res.json({ success: false, message: 'Médico indisponível' })
    }
    let slots_booked = docData.slots_booked || {}
    if (slots_booked[slotDate]) {
      if (slots_booked[slotDate].includes(slotTime)) {
        return res.json({ success: false, message: 'Horário indisponível' })
      } else {
        slots_booked[slotDate].push(slotTime)
      }
    } else {
      slots_booked[slotDate] = []
      slots_booked[slotDate].push(slotTime)
    }
    const userData = await userModel.findById(userId).select('-password')
    if (docData.slots_booked) delete docData.slots_booked
    const appointmentData = {
      userId,
      docId,
      userData,
      docData,
      amount: docData.fees,
      slotTime,
      slotDate,
      date: Date.now(),
    }
    const newAppointment = new appointmentModel(appointmentData as any)
    await newAppointment.save()
    await doctorModel.findByIdAndUpdate(docId, { slots_booked })
    res.json({ success: true, message: 'Consulta marcada' })
  } catch (error: any) {
    console.log(error)
    res.json({ success: false, message: error.message })
  }
}

export const cancelAppointment = async (req: Request, res: Response) => {
  try {
    const { userId, appointmentId } = req.body as any
    const appointmentData: any = await appointmentModel.findById(appointmentId)
    if (appointmentData.userId !== userId) {
      return res.json({ success: false, message: 'Ação não autorizada' })
    }
    await appointmentModel.findByIdAndUpdate(appointmentId, { cancelled: true })
    const { docId, slotDate, slotTime } = appointmentData
    const doctorData: any = await doctorModel.findById(docId)
    let slots_booked = doctorData.slots_booked
    slots_booked[slotDate] = slots_booked[slotDate].filter((e: string) => e !== slotTime)
    await doctorModel.findByIdAndUpdate(docId, { slots_booked })
    res.json({ success: true, message: 'Consulta cancelada' })
  } catch (error: any) {
    console.log(error)
    res.json({ success: false, message: error.message })
  }
}

export const listAppointment = async (req: Request, res: Response) => {
  try {
    const { userId } = req.body as any
    const appointments = await appointmentModel.find({ userId })
    res.json({ success: true, appointments })
  } catch (error: any) {
    console.log(error)
    res.json({ success: false, message: error.message })
  }
}

export const paymentRazorpay = async (req: Request, res: Response) => {
  try {
    const { appointmentId } = req.body as any
    const appointmentData: any = await appointmentModel.findById(appointmentId)
    if (!appointmentData || appointmentData.cancelled) {
      return res.json({ success: false, message: 'Consulta cancelada ou inexistente' })
    }
    const options = {
      amount: appointmentData.amount * 100,
      currency: process.env.CURRENCY,
      receipt: appointmentId,
    }
    if (!razorpayInstance) {
      return res.status(400).json({ success: false, message: 'Razorpay não configurado' })
    }
    const order = await razorpayInstance.orders.create(options)
    res.json({ success: true, order })
  } catch (error: any) {
    console.log(error)
    res.json({ success: false, message: error.message })
  }
}

export const verifyRazorpay = async (req: Request, res: Response) => {
  try {
    const { razorpay_order_id } = req.body as any
    const orderInfo = await razorpayInstance.orders.fetch(razorpay_order_id)
    if (orderInfo.status === 'paid') {
      await appointmentModel.findByIdAndUpdate(orderInfo.receipt, { payment: true })
      res.json({ success: true, message: 'Pagamento confirmado' })
    } else {
      res.json({ success: false, message: 'Falha no pagamento' })
    }
  } catch (error: any) {
    console.log(error)
    res.json({ success: false, message: error.message })
  }
}

export const paymentStripe = async (req: Request, res: Response) => {
  try {
    const { appointmentId } = req.body as any
    const { origin } = req.headers as any
    const appointmentData: any = await appointmentModel.findById(appointmentId)
    if (!appointmentData || appointmentData.cancelled) {
      return res.json({ success: false, message: 'Consulta cancelada ou inexistente' })
    }
    const currency = (process.env.CURRENCY as string).toLocaleLowerCase()
    const line_items = [
      {
        price_data: {
          currency,
          product_data: { name: 'Taxa de consulta' },
          unit_amount: appointmentData.amount * 100,
        },
        quantity: 1,
      },
    ]
    if (!stripeInstance) {
      return res.status(400).json({ success: false, message: 'Stripe não configurado' })
    }
    const session = await stripeInstance.checkout.sessions.create({
      success_url: `${origin}/verify?success=true&appointmentId=${appointmentData._id}`,
      cancel_url: `${origin}/verify?success=false&appointmentId=${appointmentData._id}`,
      line_items: line_items as any,
      mode: 'payment',
    })
    res.json({ success: true, session_url: session.url })
  } catch (error: any) {
    console.log(error)
    res.json({ success: false, message: error.message })
  }
}

export const verifyStripe = async (req: Request, res: Response) => {
  try {
    const { appointmentId, success } = req.body as any
    if (success === 'true') {
      await appointmentModel.findByIdAndUpdate(appointmentId, { payment: true })
      return res.json({ success: true, message: 'Pagamento confirmado' })
    }
    res.json({ success: false, message: 'Falha no pagamento' })
  } catch (error: any) {
    console.log(error)
    res.json({ success: false, message: error.message })
  }
}
// Modificado em Sun Oct  5 15:01:50 -03 2025
