import { Router, type RequestHandler } from 'express'
import type {
  VehicleInput,
  VehicleRecord,
} from './vehicle.service.js'

export type CreateVehicleHandler = (
  input: VehicleInput,
) => Promise<VehicleRecord>

export function createVehicleRouter(
  createVehicle: CreateVehicleHandler,
  authMiddleware?: RequestHandler,
) {
  const router = Router()

  const handlers = authMiddleware ? [authMiddleware] : []

  router.post('/', ...handlers, async (request, response, next) => {
    try {
      const vehicle = await createVehicle(request.body as VehicleInput)
      return response.status(201).json(vehicle)
    } catch (error) {
      return next(error)
    }
  })

  return router
}
