import request from 'supertest'
import { describe, expect, it, vi } from 'vitest'
import { createApp } from '../src/app.js'

describe('application wiring', () => {
  it('mounts the registration route under /api/auth', async () => {
    const registerUser = vi.fn().mockResolvedValue({
      id: 'user-1',
      email: 'driver@example.com',
      role: 'USER',
    })

    const response = await request(
      createApp({ registerUser }),
    )
      .post('/api/auth/register')
      .send({ email: 'driver@example.com', password: 'password123' })

    expect(response.status).toBe(201)
    expect(response.body.email).toBe('driver@example.com')
  })

  it('mounts the login route under /api/auth', async () => {
    const registerUser = vi.fn()
    const loginUser = vi.fn().mockResolvedValue({
      token: 'jwt-token',
      user: { id: 'user-1', email: 'driver@example.com', role: 'USER' },
    })

    const response = await request(
      createApp({ registerUser, loginUser }),
    )
      .post('/api/auth/login')
      .send({ email: 'driver@example.com', password: 'password123' })

    expect(response.status).toBe(200)
    expect(response.body.token).toBe('jwt-token')
  })

  it('mounts the vehicle creation route under /api/vehicles', async () => {
    const registerUser = vi.fn()
    const createVehicle = vi.fn().mockResolvedValue({
      id: 'vehicle-1',
      make: 'Toyota',
      model: 'Corolla',
      category: 'Sedan',
      price: 24500,
      quantity: 4,
    })

    const response = await request(
      createApp({ registerUser, createVehicle }),
    )
      .post('/api/vehicles')
      .send({
        make: 'Toyota',
        model: 'Corolla',
        category: 'Sedan',
        price: 24500,
        quantity: 4,
      })

    expect(response.status).toBe(201)
    expect(response.body.id).toBe('vehicle-1')
  })

  it('allows the frontend origin to call the API', async () => {
    const response = await request(
      createApp({ registerUser: vi.fn() }),
    )
      .options('/api/auth/login')
      .set('Origin', 'http://localhost:5173')
      .set('Access-Control-Request-Method', 'POST')

    expect(response.status).toBe(204)
    expect(response.headers['access-control-allow-origin']).toBe('http://localhost:5173')
  })
})
