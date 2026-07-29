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

export type VehicleSearchFilters = {
  make?: string
  model?: string
  category?: string
  minPrice?: number
  maxPrice?: number
}

export async function searchVehicles(
  filters: VehicleSearchFilters,
  dependencies: {
    repository: {
      search: (filters: VehicleSearchFilters) => Promise<VehicleRecord[]>
    }
  },
) {
  return dependencies.repository.search(filters)
}

export type VehicleUpdateInput = Partial<VehicleInput>

export async function updateVehicle(
  id: string,
  input: VehicleUpdateInput,
  dependencies: {
    repository: {
      update: (id: string, input: VehicleUpdateInput) => Promise<VehicleRecord>
    }
  },
) {
  if (input.price !== undefined && (!Number.isFinite(input.price) || input.price <= 0)) {
    throw new Error('PRICE_INVALID')
  }

  if (
    input.quantity !== undefined &&
    (!Number.isInteger(input.quantity) || input.quantity < 0)
  ) {
    throw new Error('QUANTITY_INVALID')
  }

  return dependencies.repository.update(id, input)
}

export async function deleteVehicle(
  id: string,
  dependencies: { repository: { delete: (id: string) => Promise<void> } },
) {
  await dependencies.repository.delete(id)
}
