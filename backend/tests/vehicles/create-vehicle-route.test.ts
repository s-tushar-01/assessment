import express from 'express'
import request from 'supertest'
import { describe, expect, it, vi } from 'vitest'
import { createVehicleRouter } from '../../src/modules/vehicles/vehicle.routes.js'

describe('POST /api/vehicles', () => {
  it('returns the created vehicle for valid data', async () => {
    const createVehicle = vi.fn().mockResolvedValue({
      id: 'vehicle-1',
      make: 'Toyota',
      model: 'Corolla',
      category: 'Sedan',
      price: 24500,
      quantity: 4,
    })
    const app = express()

    app.use(express.json())
    app.use('/api/vehicles', createVehicleRouter(createVehicle))

    const response = await request(app)
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
    expect(createVehicle).toHaveBeenCalledWith({
      make: 'Toyota',
      model: 'Corolla',
      category: 'Sedan',
      price: 24500,
      quantity: 4,
    })
  })
})
