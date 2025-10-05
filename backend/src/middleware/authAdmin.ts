import jwt from 'jsonwebtoken'
import { Request, Response, NextFunction } from 'express'

// admin authentication middleware
const authAdmin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const atoken = (req.headers as any).atoken as string | undefined
    if (!atoken) {
      return res.json({ success: false, message: 'Não autorizado. Faça login novamente.' })
    }
    const token_decode = jwt.verify(atoken, process.env.JWT_SECRET as string) as any
    if (token_decode !== (process.env.ADMIN_EMAIL as string) + (process.env.ADMIN_PASSWORD as string)) {
      return res.json({ success: false, message: 'Não autorizado. Faça login novamente.' })
    }
    next()
  } catch (error: any) {
    console.log(error)
    res.json({ success: false, message: 'Sessão inválida. Faça login novamente.' })
  }
}

export default authAdmin
