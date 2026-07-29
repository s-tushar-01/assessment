import { describe, expect, it, vi } from 'vitest'
import { createRegisterHandler } from '../../src/modules/auth/auth.handler.js'

describe('createRegisterHandler', () => {
  it('connects registration requests to the registration service', async () => {
    const repository = {
      findByEmail: vi.fn().mockResolvedValue(null),
      create: vi.fn().mockResolvedValue({
        id: 'user-1',
        email: 'driver@example.com',
        role: 'USER',
      }),
    }
    const hashPassword = vi.fn().mockResolvedValue('hashed-password')

    const result = await createRegisterHandler({
      repository,
      hashPassword,
    })({ email: 'driver@example.com', password: 'password123' })

    expect(result).toEqual({
      id: 'user-1',
      email: 'driver@example.com',
      role: 'USER',
    })
  })
})
