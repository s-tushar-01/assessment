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
  return dependencies.repository.create(input)
}
