import { describe, expect, it, vi } from 'vitest'
import { restockVehicle } from '../../src/modules/vehicles/vehicle.service.js'

describe('restockVehicle', () => {
  it('adds the requested quantity to stock', async () => {
    const repository = {
      restock: vi.fn().mockResolvedValue({
        id: 'vehicle-1',
        make: 'Honda',
        model: 'Civic',
        category: 'Sedan',
        price: 28900,
        quantity: 5,
      }),
    }

    const result = await restockVehicle('vehicle-1', 3, { repository })

    expect(repository.restock).toHaveBeenCalledWith('vehicle-1', 3)
    expect(result.quantity).toBe(5)
  })

  it('rejects a non-positive restock quantity', async () => {
    const repository = { restock: vi.fn() }

    await expect(
      restockVehicle('vehicle-1', 0, { repository }),
    ).rejects.toThrow('QUANTITY_INVALID')
    expect(repository.restock).not.toHaveBeenCalled()
  })
})
