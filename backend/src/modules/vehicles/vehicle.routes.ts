import { Router } from 'express'
import type {
  VehicleInput,
  VehicleRecord,
} from './vehicle.service.js'

export type CreateVehicleHandler = (
  input: VehicleInput,
) => Promise<VehicleRecord>

export function createVehicleRouter(createVehicle: CreateVehicleHandler) {
  const router = Router()

  router.post('/', async (request, response, next) => {
    try {
      const vehicle = await createVehicle(request.body as VehicleInput)
      return response.status(201).json(vehicle)
    } catch (error) {
      return next(error)
    }
  })

  return router
}
