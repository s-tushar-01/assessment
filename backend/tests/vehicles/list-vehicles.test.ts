import { describe, expect, it, vi } from 'vitest'
import { listVehicles } from '../../src/modules/vehicles/vehicle.service.js'

describe('listVehicles', () => {
  it('returns all available vehicles from the repository', async () => {
    const vehicles = [
      {
        id: 'vehicle-1',
        make: 'Toyota',
        model: 'Corolla',
        category: 'Sedan',
        price: 24500,
        quantity: 4,
      },
    ]
    const repository = { findMany: vi.fn().mockResolvedValue(vehicles) }

    const result = await listVehicles({ repository })

    expect(repository.findMany).toHaveBeenCalledOnce()
    expect(result).toEqual(vehicles)
  })
})
