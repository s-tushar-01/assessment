import { describe, expect, it, vi } from 'vitest'
import { deleteVehicle } from '../../src/modules/vehicles/vehicle.service.js'

describe('deleteVehicle', () => {
  it('deletes a vehicle by ID', async () => {
    const repository = { delete: vi.fn().mockResolvedValue(undefined) }

    await deleteVehicle('vehicle-1', { repository })

    expect(repository.delete).toHaveBeenCalledWith('vehicle-1')
  })
})
