import { Request, Response } from 'express'
import { AuthService } from './auth.service'
import { loginSchema } from './auth.schema'

const authService = new AuthService()

export class AuthController {
  async login(req: Request, res: Response) {
    const parsed = loginSchema.safeParse(req.body)

    if (!parsed.success) {
      return res.status(400).json({
        message: 'Dados inválidos',
        errors: parsed.error.format()
      })
    }

    try {
      const result = await authService.login(parsed.data)
      return res.status(200).json(result)
    } catch (err: any) {
      return res.status(401).json({ message: err.message })
    }
  }
}
