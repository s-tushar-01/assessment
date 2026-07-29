import { describe, expect, it, vi } from 'vitest'
import { createVehicle } from '../../src/modules/vehicles/vehicle.service.js'

describe('createVehicle', () => {
  it('creates a vehicle with all required inventory fields', async () => {
    const repository = {
      create: vi.fn().mockResolvedValue({
        id: 'vehicle-1',
        make: 'Toyota',
        model: 'Corolla',
        category: 'Sedan',
        price: 24500,
        quantity: 4,
      }),
    }

    const result = await createVehicle(
      {
        make: 'Toyota',
        model: 'Corolla',
        category: 'Sedan',
        price: 24500,
        quantity: 4,
      },
      { repository },
    )

    expect(repository.create).toHaveBeenCalledWith({
      make: 'Toyota',
      model: 'Corolla',
      category: 'Sedan',
      price: 24500,
      quantity: 4,
    })
    expect(result).toEqual({
      id: 'vehicle-1',
      make: 'Toyota',
      model: 'Corolla',
      category: 'Sedan',
      price: 24500,
      quantity: 4,
    })
  })
})
