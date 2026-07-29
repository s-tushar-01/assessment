import express from 'express'
import jwt from 'jsonwebtoken'
import request from 'supertest'
import { describe, expect, it, vi } from 'vitest'
import {
  requireAdmin,
  requireAuth,
} from '../../src/middleware/auth.middleware.js'
import { createVehicleRouter } from '../../src/modules/vehicles/vehicle.routes.js'

describe('DELETE /api/vehicles/:id', () => {
  it('deletes a vehicle for an admin user', async () => {
    const createVehicle = vi.fn()
    const listVehicles = vi.fn()
    const searchVehicles = vi.fn()
    const updateVehicle = vi.fn()
    const deleteVehicle = vi.fn().mockResolvedValue(undefined)
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
        listVehicles,
        searchVehicles,
        updateVehicle,
        deleteVehicle,
        requireAdmin,
      ),
    )

    const response = await request(app)
      .delete('/api/vehicles/vehicle-1')
      .set('Authorization', `Bearer ${token}`)

    expect(response.status).toBe(204)
    expect(deleteVehicle).toHaveBeenCalledWith('vehicle-1')
  })
})
