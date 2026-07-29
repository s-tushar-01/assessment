import express from 'express'
import jwt from 'jsonwebtoken'
import request from 'supertest'
import { describe, expect, it, vi } from 'vitest'
import { requireAuth } from '../../src/middleware/auth.middleware.js'
import { createVehicleRouter } from '../../src/modules/vehicles/vehicle.routes.js'

describe('PUT /api/vehicles/:id', () => {
  it('updates a vehicle for an authenticated user', async () => {
    const createVehicle = vi.fn()
    const listVehicles = vi.fn()
    const searchVehicles = vi.fn()
    const updateVehicle = vi.fn().mockResolvedValue({
      id: 'vehicle-1',
      make: 'Honda',
      model: 'Civic',
      category: 'Sedan',
      price: 28900,
      quantity: 3,
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
        listVehicles,
        searchVehicles,
        updateVehicle,
      ),
    )

    const response = await request(app)
      .put('/api/vehicles/vehicle-1')
      .set('Authorization', `Bearer ${token}`)
      .send({ make: 'Honda', price: 28900 })

    expect(response.status).toBe(200)
    expect(response.body.id).toBe('vehicle-1')
    expect(updateVehicle).toHaveBeenCalledWith('vehicle-1', {
      make: 'Honda',
      price: 28900,
    })
  })
})
