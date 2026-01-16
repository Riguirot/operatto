import { LoginDTO, AuthResponse } from './auth.types'

export class AuthService {
  async login(data: LoginDTO): Promise<AuthResponse> {
    const { email, password } = data

    // 🔒 MOCK — depois entra banco, hash, etc.
    if (email !== 'admin@operatto.com' || password !== '123456') {
      throw new Error('Credenciais inválidas')
    }

    return {
      accessToken: 'mock-token-123'
    }
  }
}
