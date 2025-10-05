import jwt from 'jsonwebtoken'
import { Request, Response, NextFunction } from 'express'

// user authentication middleware
const authUser = async (req: Request, res: Response, next: NextFunction) => {
  const token = (req.headers as any).token as string | undefined
  if (!token) {
    return res.json({ success: false, message: 'Não autorizado. Faça login novamente.' })
  }
  try {
    const token_decode = jwt.verify(token, process.env.JWT_SECRET as string) as any
    ;(req.body as any).userId = token_decode.id
    next()
  } catch (error: any) {
    console.log(error)
    res.json({ success: false, message: 'Sessão inválida. Faça login novamente.' })
  }
}

export default authUser
