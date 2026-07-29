import { describe, expect, it, vi } from 'vitest'
import { updateVehicle } from '../../src/modules/vehicles/vehicle.service.js'

describe('updateVehicle', () => {
  it('updates a vehicle using the supplied fields', async () => {
    const repository = {
      update: vi.fn().mockResolvedValue({
        id: 'vehicle-1',
        make: 'Honda',
        model: 'Civic',
        category: 'Sedan',
        price: 28900,
        quantity: 3,
      }),
    }

    const result = await updateVehicle(
      'vehicle-1',
      { make: 'Honda', price: 28900 },
      { repository },
    )

    expect(repository.update).toHaveBeenCalledWith('vehicle-1', {
      make: 'Honda',
      price: 28900,
    })
    expect(result.id).toBe('vehicle-1')
  })
})
