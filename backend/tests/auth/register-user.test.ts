import { describe, expect, it, vi } from 'vitest'
import { registerUser } from '../../src/modules/auth/auth.service.js'

describe('registerUser', () => {
  it('creates a user with a hashed password and the default USER role', async () => {
    const repository = {
      findByEmail: vi.fn().mockResolvedValue(null),
      create: vi.fn().mockResolvedValue({
        id: 'user-1',
        email: 'driver@example.com',
        role: 'USER',
      }),
    }
    const hashPassword = vi.fn().mockResolvedValue('hashed-password')

    const result = await registerUser(
      { email: 'driver@example.com', password: 'password123' },
      { repository, hashPassword },
    )

    expect(hashPassword).toHaveBeenCalledWith('password123')
    expect(repository.create).toHaveBeenCalledWith({
      email: 'driver@example.com',
      passwordHash: 'hashed-password',
      role: 'USER',
    })
    expect(result).toEqual({
      id: 'user-1',
      email: 'driver@example.com',
      role: 'USER',
    })
  })

  it('rejects an email that is already registered', async () => {
    const repository = {
      findByEmail: vi.fn().mockResolvedValue({ id: 'existing-user' }),
      create: vi.fn(),
    }
    const hashPassword = vi.fn()

    await expect(
      registerUser(
        { email: 'driver@example.com', password: 'password123' },
        { repository, hashPassword },
      ),
    ).rejects.toThrow('EMAIL_ALREADY_EXISTS')

    expect(hashPassword).not.toHaveBeenCalled()
    expect(repository.create).not.toHaveBeenCalled()
  })

  it('rejects passwords shorter than eight characters', async () => {
    const repository = {
      findByEmail: vi.fn().mockResolvedValue(null),
      create: vi.fn(),
    }
    const hashPassword = vi.fn()

    await expect(
      registerUser(
        { email: 'driver@example.com', password: 'short' },
        { repository, hashPassword },
      ),
    ).rejects.toThrow('PASSWORD_TOO_SHORT')
  })
})
