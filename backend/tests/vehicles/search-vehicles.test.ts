import { describe, expect, it, vi } from 'vitest'
import { searchVehicles } from '../../src/modules/vehicles/vehicle.service.js'

describe('searchVehicles', () => {
  it('passes make, category, and price filters to the repository', async () => {
    const vehicles = [
      {
        id: 'vehicle-1',
        make: 'Honda',
        model: 'Civic',
        category: 'Sedan',
        price: 28900,
        quantity: 3,
      },
    ]
    const repository = { search: vi.fn().mockResolvedValue(vehicles) }
    const filters = {
      make: 'Honda',
      category: 'Sedan',
      minPrice: 20000,
      maxPrice: 30000,
    }

    const result = await searchVehicles(filters, { repository })

    expect(repository.search).toHaveBeenCalledWith(filters)
    expect(result).toEqual(vehicles)
  })
})
