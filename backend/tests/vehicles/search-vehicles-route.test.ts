import express from 'express'
import jwt from 'jsonwebtoken'
import request from 'supertest'
import { describe, expect, it, vi } from 'vitest'
import { requireAuth } from '../../src/middleware/auth.middleware.js'
import { createVehicleRouter } from '../../src/modules/vehicles/vehicle.routes.js'

describe('GET /api/vehicles/search', () => {
  it('passes query filters to the search handler', async () => {
    const createVehicle = vi.fn()
    const listVehicles = vi.fn()
    const searchVehicles = vi.fn().mockResolvedValue([])
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
      ),
    )

    const response = await request(app)
      .get('/api/vehicles/search')
      .query({
        query: 'Civic',
        make: 'Honda',
        category: 'Sedan',
        minPrice: '20000',
        maxPrice: '30000',
      })
      .set('Authorization', `Bearer ${token}`)

    expect(response.status).toBe(200)
    expect(searchVehicles).toHaveBeenCalledWith({
      query: 'Civic',
      make: 'Honda',
      category: 'Sedan',
      minPrice: 20000,
      maxPrice: 30000,
    })
  })
})
