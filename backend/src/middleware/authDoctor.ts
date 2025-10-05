import jwt from 'jsonwebtoken'
import { Request, Response, NextFunction } from 'express'

// doctor authentication middleware
const authDoctor = async (req: Request, res: Response, next: NextFunction) => {
  const dtoken = (req.headers as any).dtoken as string | undefined
  if (!dtoken) {
    return res.json({ success: false, message: 'Não autorizado. Faça login novamente.' })
  }
  try {
    const token_decode = jwt.verify(dtoken, process.env.JWT_SECRET as string) as any
    ;(req.body as any).docId = token_decode.id
    next()
  } catch (error: any) {
    console.log(error)
    res.json({ success: false, message: 'Sessão inválida. Faça login novamente.' })
  }
}

export default authDoctor
