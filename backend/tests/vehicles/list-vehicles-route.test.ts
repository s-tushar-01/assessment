import express from 'express'
import jwt from 'jsonwebtoken'
import request from 'supertest'
import { describe, expect, it, vi } from 'vitest'
import { requireAuth } from '../../src/middleware/auth.middleware.js'
import { createVehicleRouter } from '../../src/modules/vehicles/vehicle.routes.js'

describe('GET /api/vehicles', () => {
  it('returns available vehicles for an authenticated user', async () => {
    const createVehicle = vi.fn()
    const listVehicles = vi.fn().mockResolvedValue([
      {
        id: 'vehicle-1',
        make: 'Toyota',
        model: 'Corolla',
        category: 'Sedan',
        price: 24500,
        quantity: 4,
      },
    ])
    const app = express()
    const token = jwt.sign(
      { sub: 'user-1', role: 'USER' },
      'development-secret',
    )

    app.use(express.json())
    app.use(
      '/api/vehicles',
      createVehicleRouter(createVehicle, requireAuth, listVehicles),
    )

    const response = await request(app)
      .get('/api/vehicles')
      .set('Authorization', `Bearer ${token}`)

    expect(response.status).toBe(200)
    expect(response.body).toHaveLength(1)
    expect(response.body[0].id).toBe('vehicle-1')
    expect(listVehicles).toHaveBeenCalledOnce()
  })
})
