import { describe, expect, it, vi } from 'vitest'
import { purchaseVehicle } from '../../src/modules/vehicles/vehicle.service.js'

describe('purchaseVehicle', () => {
  it('decreases stock by one when stock is available', async () => {
    const repository = {
      purchase: vi.fn().mockResolvedValue({
        id: 'vehicle-1',
        make: 'Honda',
        model: 'Civic',
        category: 'Sedan',
        price: 28900,
        quantity: 2,
      }),
    }

    const result = await purchaseVehicle('vehicle-1', { repository })

    expect(repository.purchase).toHaveBeenCalledWith('vehicle-1')
    expect(result.quantity).toBe(2)
  })

  it('rejects a purchase when no stock is available', async () => {
    const repository = { purchase: vi.fn().mockResolvedValue(null) }

    await expect(
      purchaseVehicle('vehicle-1', { repository }),
    ).rejects.toThrow('OUT_OF_STOCK')
  })
})
