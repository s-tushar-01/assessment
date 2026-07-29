import express from 'express'
import jwt from 'jsonwebtoken'
import request from 'supertest'
import { describe, expect, it, vi } from 'vitest'
import { requireAuth } from '../../src/middleware/auth.middleware.js'
import { createVehicleRouter } from '../../src/modules/vehicles/vehicle.routes.js'

describe('POST /api/vehicles/:id/purchase', () => {
  it('purchases a vehicle for an authenticated user', async () => {
    const createVehicle = vi.fn()
    const purchaseVehicle = vi.fn().mockResolvedValue({
      id: 'vehicle-1',
      make: 'Honda',
      model: 'Civic',
      category: 'Sedan',
      price: 28900,
      quantity: 2,
    })
    const app = express()
    const token = jwt.sign(
      { sub: 'user-1', role: 'USER' },
      'development-secret',
    )

    app.use(express.json())
    app.use(
      '/api/vehicles',
      createVehicleRouter(
        createVehicle,
        requireAuth,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        purchaseVehicle,
      ),
    )

    const response = await request(app)
      .post('/api/vehicles/vehicle-1/purchase')
      .set('Authorization', `Bearer ${token}`)

    expect(response.status).toBe(200)
    expect(response.body.quantity).toBe(2)
    expect(purchaseVehicle).toHaveBeenCalledWith('vehicle-1')
  })
})
