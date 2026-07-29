import { describe, expect, it, vi } from 'vitest'
import { loginUser } from '../../src/modules/auth/auth.service.js'

describe('loginUser', () => {
  it('returns a token and safe user details for valid credentials', async () => {
    const repository = {
      findByEmail: vi.fn().mockResolvedValue({
        id: 'user-1',
        email: 'driver@example.com',
        passwordHash: 'hashed-password',
        role: 'USER',
      }),
    }
    const comparePassword = vi.fn().mockResolvedValue(true)
    const signToken = vi.fn().mockReturnValue('jwt-token')

    const result = await loginUser(
      { email: 'driver@example.com', password: 'password123' },
      { repository, comparePassword, signToken },
    )

    expect(comparePassword).toHaveBeenCalledWith(
      'password123',
      'hashed-password',
    )
    expect(signToken).toHaveBeenCalledWith({
      sub: 'user-1',
      role: 'USER',
    })
    expect(result).toEqual({
      token: 'jwt-token',
      user: {
        id: 'user-1',
        email: 'driver@example.com',
        role: 'USER',
      },
    })
  })
})
