export type VehicleInput = {
  make: string
  model: string
  category: string
  price: number
  quantity: number
}

export type VehicleRecord = VehicleInput & {
  id: string
}

export type VehicleRepository = {
  create: (vehicle: VehicleInput) => Promise<VehicleRecord>
}

export async function createVehicle(
  input: VehicleInput,
  dependencies: { repository: VehicleRepository },
) {
  if (!Number.isFinite(input.price) || input.price <= 0) {
    throw new Error('PRICE_INVALID')
  }

  if (!Number.isInteger(input.quantity) || input.quantity < 0) {
    throw new Error('QUANTITY_INVALID')
  }

  return dependencies.repository.create(input)
}

export async function listVehicles(dependencies: {
  repository: { findMany: () => Promise<VehicleRecord[]> }
}) {
  return dependencies.repository.findMany()
}
