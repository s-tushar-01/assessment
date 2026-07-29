import express from 'express'
import request from 'supertest'
import { describe, expect, it, vi } from 'vitest'
import { createAuthRouter } from '../../src/modules/auth/auth.routes.js'

describe('POST /api/auth/register', () => {
  it('returns the created user for valid registration data', async () => {
    const registerUser = vi.fn().mockResolvedValue({
      id: 'user-1',
      email: 'driver@example.com',
      role: 'USER',
    })
    const app = express()

    app.use(express.json())
    app.use('/api/auth', createAuthRouter(registerUser))

    const response = await request(app)
      .post('/api/auth/register')
      .send({ email: 'driver@example.com', password: 'password123' })

    expect(response.status).toBe(201)
    expect(response.body).toEqual({
      id: 'user-1',
      email: 'driver@example.com',
      role: 'USER',
    })
    expect(registerUser).toHaveBeenCalledWith({
      email: 'driver@example.com',
      password: 'password123',
    })
  })
})
