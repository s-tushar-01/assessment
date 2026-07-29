import express from 'express'
import jwt from 'jsonwebtoken'
import request from 'supertest'
import { describe, expect, it, vi } from 'vitest'
import {
  requireAdmin,
  requireAuth,
} from '../../src/middleware/auth.middleware.js'
import { createVehicleRouter } from '../../src/modules/vehicles/vehicle.routes.js'

describe('POST /api/vehicles/:id/restock', () => {
  it('restocks a vehicle for an admin user', async () => {
    const createVehicle = vi.fn()
    const restockVehicle = vi.fn().mockResolvedValue({
      id: 'vehicle-1',
      make: 'Honda',
      model: 'Civic',
      category: 'Sedan',
      price: 28900,
      quantity: 5,
    })
    const app = express()
    const token = jwt.sign(
      { sub: 'admin-1', role: 'ADMIN' },
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
        requireAdmin,
        undefined,
        restockVehicle,
      ),
    )

    const response = await request(app)
      .post('/api/vehicles/vehicle-1/restock')
      .set('Authorization', `Bearer ${token}`)
      .send({ quantity: 3 })

    expect(response.status).toBe(200)
    expect(response.body.quantity).toBe(5)
    expect(restockVehicle).toHaveBeenCalledWith('vehicle-1', 3)
  })
})
